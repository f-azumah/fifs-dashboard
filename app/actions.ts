"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { dateOnly, mondayOf, quarterStart } from "@/lib/dates";
import { searchBooks } from "@/lib/openLibrary";
import type {
  FailureMode,
  GoalCategory,
  HabitCategory,
  HabitFrequency,
  OssPrStatus,
  ReadingStatus,
} from "@prisma/client";

const DASHBOARD_PATH = "/";
const HABITS_PATH = "/habits";
const QUARTER_PATH = "/quarter";

// ---------- Tasks ----------

export async function createTask(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const weekOfRaw = String(formData.get("weekOf"));
  const priorityRaw = formData.get("priority");

  await prisma.task.create({
    data: {
      title,
      weekOf: mondayOf(new Date(weekOfRaw)),
      priority: priorityRaw ? Number(priorityRaw) : 2,
    },
  });

  revalidatePath(DASHBOARD_PATH);
}

export async function toggleTaskStatus(taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) return;

  const nextStatus = task.status === "DONE" ? "TODO" : "DONE";
  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: nextStatus,
      completedAt: nextStatus === "DONE" ? new Date() : null,
    },
  });

  revalidatePath(DASHBOARD_PATH);
}

export async function deleteTask(taskId: string) {
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath(DASHBOARD_PATH);
}

export async function saveWeeklyFocus(formData: FormData) {
  const weekOfRaw = String(formData.get("weekOf"));
  const focus = String(formData.get("focus") ?? "");
  const weekOf = mondayOf(new Date(weekOfRaw));

  await prisma.weeklyReflection.upsert({
    where: { weekOf },
    create: { weekOf, focus },
    update: { focus },
  });

  revalidatePath(DASHBOARD_PATH);
}

export async function saveShipReport(formData: FormData) {
  const weekOfRaw = String(formData.get("weekOf"));
  const weekOf = mondayOf(new Date(weekOfRaw));
  const hoursSpentRaw = formData.get("hoursSpent");
  const shipped = String(formData.get("shipped") ?? "");
  const notShipped = String(formData.get("notShipped") ?? "");
  const didShip = String(formData.get("didShip") ?? "") === "true";
  const failureModeRaw = String(formData.get("failureMode") ?? "");

  await prisma.weeklyReflection.upsert({
    where: { weekOf },
    create: {
      weekOf,
      hoursSpent: hoursSpentRaw ? Number(hoursSpentRaw) : null,
      shipped,
      notShipped,
      didShip,
      failureMode: !didShip && failureModeRaw ? (failureModeRaw as FailureMode) : null,
    },
    update: {
      hoursSpent: hoursSpentRaw ? Number(hoursSpentRaw) : null,
      shipped,
      notShipped,
      didShip,
      failureMode: !didShip && failureModeRaw ? (failureModeRaw as FailureMode) : null,
    },
  });

  revalidatePath(DASHBOARD_PATH);
}

export async function saveDepthLog(formData: FormData) {
  const weekOfRaw = String(formData.get("weekOf"));
  const weekOf = mondayOf(new Date(weekOfRaw));
  const wentDeeper = String(formData.get("wentDeeper") ?? "");
  const explainableNow = String(formData.get("explainableNow") ?? "");
  const ossPrStatus = String(formData.get("ossPrStatus") ?? "NOT_STARTED") as OssPrStatus;

  await prisma.depthLog.upsert({
    where: { weekOf },
    create: { weekOf, wentDeeper, explainableNow, ossPrStatus },
    update: { wentDeeper, explainableNow, ossPrStatus },
  });

  revalidatePath(DASHBOARD_PATH);
}

// ---------- Weekly goals ----------

export async function createWeeklyGoal(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const weekOfRaw = String(formData.get("weekOf"));

  await prisma.weeklyGoal.create({
    data: { title, weekOf: mondayOf(new Date(weekOfRaw)) },
  });

  revalidatePath(DASHBOARD_PATH);
}

export async function toggleWeeklyGoal(goalId: string) {
  const goal = await prisma.weeklyGoal.findUnique({ where: { id: goalId } });
  if (!goal) return;

  await prisma.weeklyGoal.update({
    where: { id: goalId },
    data: { done: !goal.done },
  });

  revalidatePath(DASHBOARD_PATH);
}

export async function deleteWeeklyGoal(goalId: string) {
  await prisma.weeklyGoal.delete({ where: { id: goalId } });
  revalidatePath(DASHBOARD_PATH);
}

// ---------- Gym tracker ----------

export async function toggleGymSession(isoDate: string) {
  const date = dateOnly(new Date(`${isoDate}T00:00:00.000Z`));

  const existing = await prisma.gymSession.findUnique({ where: { date } });

  if (existing) {
    await prisma.gymSession.delete({ where: { id: existing.id } });
  } else {
    await prisma.gymSession.create({ data: { date } });
  }

  revalidatePath(DASHBOARD_PATH);
}

export async function saveGymGoal(formData: FormData) {
  const weeklyTarget = Number(formData.get("weeklyTarget"));
  if (!weeklyTarget || weeklyTarget < 1) return;

  await prisma.gymSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", weeklyTarget },
    update: { weeklyTarget },
  });

  revalidatePath(DASHBOARD_PATH);
}

// ---------- Daily check-in ----------

export async function saveDailyCheckIn(formData: FormData) {
  const isoDate = String(formData.get("date"));
  const note = String(formData.get("note") ?? "");
  const date = dateOnly(new Date(`${isoDate}T00:00:00.000Z`));

  await prisma.dailyCheckIn.upsert({
    where: { date },
    create: { date, note },
    update: { note },
  });

  revalidatePath(DASHBOARD_PATH);
}

// ---------- Currently reading ----------

export async function setCurrentlyReadingBook(book: {
  title: string;
  author: string;
  coverUrl: string | null;
}) {
  await prisma.currentlyReading.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...book, status: "READING" },
    update: { ...book, status: "READING" },
  });

  revalidatePath(DASHBOARD_PATH);
}

export async function setReadingStatus(status: ReadingStatus) {
  const reading = await prisma.currentlyReading.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", status },
    update: { status },
  });

  if (status === "COMPLETED" && reading.title) {
    const today = dateOnly(new Date());
    const alreadyLogged = await prisma.bookLog.findFirst({
      where: { title: reading.title, completedAt: today },
    });
    if (!alreadyLogged) {
      await prisma.bookLog.create({
        data: {
          title: reading.title,
          author: reading.author,
          coverUrl: reading.coverUrl,
          completedAt: today,
        },
      });
    }
  }

  revalidatePath(DASHBOARD_PATH);
  revalidatePath(QUARTER_PATH);
}

export async function searchBooksAction(query: string) {
  return searchBooks(query);
}

// ---------- Habits ----------

export async function createHabit(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const category = String(formData.get("category")) as HabitCategory;
  const frequency = String(formData.get("frequency")) as HabitFrequency;
  const weeklyTargetRaw = formData.get("weeklyTarget");
  const intervalDaysRaw = formData.get("intervalDays");
  const icon = String(formData.get("icon") ?? "").trim() || null;

  await prisma.habit.create({
    data: {
      name,
      category,
      frequency,
      weeklyTarget:
        frequency === "WEEKLY_TARGET" && weeklyTargetRaw
          ? Number(weeklyTargetRaw)
          : null,
      intervalDays:
        frequency === "INTERVAL" && intervalDaysRaw
          ? Number(intervalDaysRaw)
          : null,
      icon,
    },
  });

  revalidatePath(HABITS_PATH);
}

export async function deleteHabit(habitId: string) {
  await prisma.habit.delete({ where: { id: habitId } });
  revalidatePath(HABITS_PATH);
}

export async function toggleHabitLog(habitId: string, isoDate: string) {
  const date = dateOnly(new Date(`${isoDate}T00:00:00.000Z`));

  const existing = await prisma.habitLog.findUnique({
    where: { habitId_date: { habitId, date } },
  });

  if (existing) {
    await prisma.habitLog.delete({ where: { id: existing.id } });
  } else {
    await prisma.habitLog.create({ data: { habitId, date } });
  }

  revalidatePath(HABITS_PATH);
}

export async function logHabitCompletionToday(habitId: string) {
  const date = dateOnly(new Date());

  await prisma.habitLog.upsert({
    where: { habitId_date: { habitId, date } },
    create: { habitId, date },
    update: {},
  });

  revalidatePath(HABITS_PATH);
}

// ---------- Quarterly goals ----------

export async function createQuarterlyGoal(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const quarterOfRaw = String(formData.get("quarterOf"));
  const category = String(formData.get("category")) as GoalCategory;

  await prisma.quarterlyGoal.create({
    data: { title, category, quarterOf: quarterStart(new Date(quarterOfRaw)) },
  });

  revalidatePath(QUARTER_PATH);
}

export async function toggleQuarterlyGoal(goalId: string) {
  const goal = await prisma.quarterlyGoal.findUnique({ where: { id: goalId } });
  if (!goal) return;

  await prisma.quarterlyGoal.update({
    where: { id: goalId },
    data: { done: !goal.done },
  });

  revalidatePath(QUARTER_PATH);
}

export async function deleteQuarterlyGoal(goalId: string) {
  await prisma.quarterlyGoal.delete({ where: { id: goalId } });
  revalidatePath(QUARTER_PATH);
}

// ---------- Quarterly wins ----------

export async function createQuarterlyWin(formData: FormData) {
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;

  const quarterOfRaw = String(formData.get("quarterOf"));

  await prisma.quarterlyWin.create({
    data: { text, quarterOf: quarterStart(new Date(quarterOfRaw)) },
  });

  revalidatePath(QUARTER_PATH);
}

export async function deleteQuarterlyWin(winId: string) {
  await prisma.quarterlyWin.delete({ where: { id: winId } });
  revalidatePath(QUARTER_PATH);
}

// ---------- Idea parking lot ----------

export async function createIdea(formData: FormData) {
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;

  await prisma.idea.create({ data: { text } });
  revalidatePath(QUARTER_PATH);
}

export async function deleteIdea(ideaId: string) {
  await prisma.idea.delete({ where: { id: ideaId } });
  revalidatePath(QUARTER_PATH);
}
