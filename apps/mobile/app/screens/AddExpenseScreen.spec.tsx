import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { AddExpenseScreen } from './AddExpenseScreen';
import { groupService } from '../services/group.service';

jest.mock('../services/group.service', () => ({
  groupService: {
    members: jest.fn(),
  },
}));

describe('AddExpenseScreen', () => {
  it('shows validation error when no payer is available', async () => {
    (groupService.members as jest.Mock).mockResolvedValueOnce([]);

    const { getByText } = render(
      <PaperProvider>
        <AddExpenseScreen route={{ params: { groupId: 'g1' } }} navigation={{ goBack: jest.fn() }} />
      </PaperProvider>,
    );

    fireEvent.press(getByText('Create Expense'));

    await waitFor(() => expect(getByText('Select a payer')).toBeTruthy());
  });
});
