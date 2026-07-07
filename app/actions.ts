"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { dateOnly, mondayOf } from "@/lib/dates";
import type { HabitCategory, HabitFrequency } from "@prisma/client";

const DASHBOARD_PATH = "/";
const HABITS_PATH = "/habits";

// ---------- Tasks ----------

export async function createTask(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const weekOfRaw = String(formData.get("weekOf"));
  const dayOfWeekRaw = formData.get("dayOfWeek");
  const priorityRaw = formData.get("priority");

  await prisma.task.create({
    data: {
      title,
      weekOf: mondayOf(new Date(weekOfRaw)),
      dayOfWeek:
        dayOfWeekRaw !== null && dayOfWeekRaw !== ""
          ? Number(dayOfWeekRaw)
          : null,
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

export async function saveWeeklyReflection(formData: FormData) {
  const weekOfRaw = String(formData.get("weekOf"));
  const focus = String(formData.get("focus") ?? "");
  const reflection = String(formData.get("reflection") ?? "");
  const weekOf = mondayOf(new Date(weekOfRaw));

  await prisma.weeklyReflection.upsert({
    where: { weekOf },
    create: { weekOf, focus, reflection },
    update: { focus, reflection },
  });

  revalidatePath(DASHBOARD_PATH);
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
