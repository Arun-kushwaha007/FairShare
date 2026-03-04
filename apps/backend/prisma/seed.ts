import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.$transaction([
    prisma.activity.deleteMany(),
    prisma.receipt.deleteMany(),
    prisma.settlement.deleteMany(),
    prisma.balance.deleteMany(),
    prisma.split.deleteMany(),
    prisma.expense.deleteMany(),
    prisma.groupMember.deleteMany(),
    prisma.group.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.pushToken.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const passwordHash = await hash('Password@123', 10);

  const [u1, u2, u3] = await prisma.$transaction([
    prisma.user.create({
      data: { email: 'alice@fairshare.dev', name: 'Alice', passwordHash },
    }),
    prisma.user.create({
      data: { email: 'bob@fairshare.dev', name: 'Bob', passwordHash },
    }),
    prisma.user.create({
      data: { email: 'cara@fairshare.dev', name: 'Cara', passwordHash },
    }),
  ]);

  const [g1, g2] = await prisma.$transaction([
    prisma.group.create({ data: { name: 'Trip Squad', currency: 'USD', createdBy: u1.id } }),
    prisma.group.create({ data: { name: 'Flatmates', currency: 'USD', createdBy: u2.id } }),
  ]);

  await prisma.groupMember.createMany({
    data: [
      { groupId: g1.id, userId: u1.id, role: 'OWNER' },
      { groupId: g1.id, userId: u2.id, role: 'MEMBER' },
      { groupId: g1.id, userId: u3.id, role: 'MEMBER' },
      { groupId: g2.id, userId: u2.id, role: 'OWNER' },
      { groupId: g2.id, userId: u1.id, role: 'MEMBER' },
      { groupId: g2.id, userId: u3.id, role: 'MEMBER' },
    ],
  });

  const groups = [g1, g2];
  const users = [u1, u2, u3];

  for (let i = 0; i < 10; i += 1) {
    const group = groups[i % 2];
    const payer = users[i % 3];
    const total = BigInt((i + 1) * 1000);
    const perHead = total / 3n;

    const expense = await prisma.expense.create({
      data: {
        groupId: group.id,
        payerId: payer.id,
        description: `Seed expense ${i + 1}`,
        totalAmountCents: total,
        currency: 'USD',
      },
    });

    await prisma.split.createMany({
      data: users.map((user) => ({
        expenseId: expense.id,
        userId: user.id,
        owedAmountCents: perHead,
        paidAmountCents: user.id === payer.id ? total : 0n,
      })),
    });

    await prisma.activity.create({
      data: {
        groupId: group.id,
        actorUserId: payer.id,
        type: 'expense_created',
        entityId: expense.id,
        metadata: { totalAmountCents: total.toString() },
      },
    });
  }

  // minimal baseline balances for demo visibility
  await prisma.balance.createMany({
    data: [
      { groupId: g1.id, userId: u2.id, counterpartyUserId: u1.id, amountCents: -500n },
      { groupId: g1.id, userId: u1.id, counterpartyUserId: u2.id, amountCents: 500n },
      { groupId: g2.id, userId: u3.id, counterpartyUserId: u2.id, amountCents: -700n },
      { groupId: g2.id, userId: u2.id, counterpartyUserId: u3.id, amountCents: 700n },
    ],
  });

  // eslint-disable-next-line no-console
  console.log('Seed complete: 3 users, 2 groups, 10 expenses');
}

main()
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
