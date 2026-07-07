import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const habits = [
    {
      name: "Wash day",
      category: "HAIR_CARE" as const,
      frequency: "WEEKLY_TARGET" as const,
      weeklyTarget: 1,
      icon: "🚿",
    },
    {
      name: "Daily refresh",
      category: "HAIR_CARE" as const,
      frequency: "DAILY" as const,
      icon: "💧",
    },
    {
      name: "Protein treatment",
      category: "HAIR_CARE" as const,
      frequency: "INTERVAL" as const,
      intervalDays: 49, // every 7 weeks
      icon: "🧴",
    },
    {
      name: "Trim",
      category: "HAIR_CARE" as const,
      frequency: "INTERVAL" as const,
      intervalDays: 90, // every 3 months
      icon: "✂️",
    },
  ];

  for (const habit of habits) {
    const existing = await prisma.habit.findFirst({
      where: { name: habit.name, category: habit.category },
    });
    if (!existing) {
      await prisma.habit.create({ data: habit });
      console.log(`Created habit: ${habit.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
