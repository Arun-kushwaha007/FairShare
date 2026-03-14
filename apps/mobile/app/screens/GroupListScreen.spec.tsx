import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { GroupListScreen } from './GroupListScreen';
import { groupService } from '../services/group.service';

jest.mock('../services/group.service', () => ({
  groupService: {
    list: jest.fn(),
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
    expect(getByText('Create your first group to start splitting expenses')).toBeTruthy();
  });
});
