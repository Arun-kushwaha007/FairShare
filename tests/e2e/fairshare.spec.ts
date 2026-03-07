import { APIRequestContext, expect, test } from '@playwright/test';

const randomEmail = () => `fairshare_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`;

async function bootstrapUsersAndGroup(request: APIRequestContext) {
  const emailA = randomEmail();
  const emailB = randomEmail();
  const password = 'Password123';

  const registerA = await request.post('/auth/register', {
    data: { name: 'User A', email: emailA, password },
  });
  expect(registerA.ok()).toBeTruthy();
  const userA = await registerA.json();

  const registerB = await request.post('/auth/register', {
    data: { name: 'User B', email: emailB, password },
  });
  expect(registerB.ok()).toBeTruthy();
  const userB = await registerB.json();

  const loginA = await request.post('/auth/login', {
    data: { email: emailA, password },
  });
  expect(loginA.ok()).toBeTruthy();
  const loginPayload = await loginA.json();
  const token = loginPayload.accessToken as string;
  const authHeaders = { Authorization: `Bearer ${token}` };

  const createGroup = await request.post('/groups', {
    headers: authHeaders,
    data: { name: 'E2E Group', currency: 'USD' },
  });
  expect(createGroup.ok()).toBeTruthy();
  const group = await createGroup.json();

  const invite = await request.post(`/groups/${group.id}/invite`, {
    headers: authHeaders,
    data: { email: emailB },
  });
  expect(invite.ok()).toBeTruthy();

  return { userA, userB, group, authHeaders };
}

test('register login create group add expense settle expense', async ({ request, baseURL }) => {
  test.skip(process.env.RUN_E2E !== 'true', 'Set RUN_E2E=true to run backend e2e flow');
  test.skip(!baseURL, 'Base URL is required');

  const { userA, userB, group, authHeaders } = await bootstrapUsersAndGroup(request);

  const createExpense = await request.post(`/groups/${group.id}/expenses`, {
    headers: authHeaders,
    data: {
      payerId: userA.user.id,
      description: 'E2E Dinner',
      totalAmountCents: '1000',
      currency: 'USD',
      splits: [
        { userId: userA.user.id, owedAmountCents: '500', paidAmountCents: '1000' },
        { userId: userB.user.id, owedAmountCents: '500', paidAmountCents: '0' },
      ],
    },
  });
  expect(createExpense.ok()).toBeTruthy();

  const settle = await request.post(`/groups/${group.id}/settlements`, {
    headers: authHeaders,
    data: {
      payerId: userB.user.id,
      receiverId: userA.user.id,
      amountCents: '500',
    },
  });
  expect(settle.ok()).toBeTruthy();
});

test('view activity after expense and settlement', async ({ request, baseURL }) => {
  test.skip(process.env.RUN_E2E !== 'true', 'Set RUN_E2E=true to run backend e2e flow');
  test.skip(!baseURL, 'Base URL is required');

  const { userA, userB, group, authHeaders } = await bootstrapUsersAndGroup(request);

  const createExpense = await request.post(`/groups/${group.id}/expenses`, {
    headers: authHeaders,
    data: {
      payerId: userA.user.id,
      description: 'Activity test expense',
      totalAmountCents: '1200',
      currency: 'USD',
      splits: [
        { userId: userA.user.id, owedAmountCents: '600', paidAmountCents: '1200' },
        { userId: userB.user.id, owedAmountCents: '600', paidAmountCents: '0' },
      ],
    },
  });
  expect(createExpense.ok()).toBeTruthy();

  const settle = await request.post(`/groups/${group.id}/settlements`, {
    headers: authHeaders,
    data: {
      payerId: userB.user.id,
      receiverId: userA.user.id,
      amountCents: '600',
    },
  });
  expect(settle.ok()).toBeTruthy();

  const activity = await request.get(`/groups/${group.id}/activity`, {
    headers: authHeaders,
  });
  expect(activity.ok()).toBeTruthy();
  const activityPayload = (await activity.json()) as Array<{ type: string }>;
  expect(activityPayload.some((item) => item.type === 'expense_created')).toBeTruthy();
  expect(activityPayload.some((item) => item.type === 'settlement_created')).toBeTruthy();
});
