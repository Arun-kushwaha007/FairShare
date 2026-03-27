import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { AddExpenseScreen } from './AddExpenseScreen';
import { groupService } from '../services/group.service';

jest.mock('../services/group.service', () => ({
  groupService: {
    members: jest.fn(),
    get: jest.fn(),
  },
}));

describe('AddExpenseScreen', () => {
  it('shows validation error when no payer is available', async () => {
    (groupService.members as jest.Mock).mockResolvedValueOnce([]);
    (groupService.get as jest.Mock).mockResolvedValueOnce({ id: 'g1', name: 'Trip', currency: 'USD' });

    const { getByText, getByTestId } = render(
      <PaperProvider>
        <AddExpenseScreen route={{ params: { groupId: 'g1' } }} navigation={{ goBack: jest.fn() }} />
      </PaperProvider>,
    );

    await waitFor(() => expect(groupService.members).toHaveBeenCalledWith('g1'));

    fireEvent.changeText(getByTestId('description-input'), 'Dinner');
    fireEvent.changeText(getByTestId('amount-input'), '1000');
    fireEvent.press(getByTestId('next-button'));
    fireEvent.press(getByTestId('next-button'));

    await waitFor(() => expect(getByText('Select a payer')).toBeTruthy());
  });
});
