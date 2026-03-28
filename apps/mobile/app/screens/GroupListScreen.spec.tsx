import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { GroupListScreen } from './GroupListScreen';
import { groupService } from '../services/group.service';
import { expenseService } from '../services/expense.service';

jest.mock('../services/group.service', () => ({
  groupService: {
    list: jest.fn(),
  },
}));

jest.mock('../services/expense.service', () => ({
  expenseService: {
    listRecurring: jest.fn(),
  },
}));

describe('GroupListScreen', () => {
  it('renders empty state when no groups are returned', async () => {
    (groupService.list as jest.Mock).mockResolvedValueOnce([]);

    const { getByText } = render(
      <PaperProvider>
        <GroupListScreen navigation={{ navigate: jest.fn(), setOptions: jest.fn() }} />
      </PaperProvider>,
    );

    await waitFor(() => expect(getByText('No groups yet')).toBeTruthy());
    expect(getByText("You haven't joined any groups yet.")).toBeTruthy();
    expect(expenseService.listRecurring).not.toHaveBeenCalled();
  });
});
