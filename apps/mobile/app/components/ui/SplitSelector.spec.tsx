import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { SplitSelector } from './SplitSelector';

describe('SplitSelector', () => {
  it('renders members and triggers split type change', () => {
    const onSplitTypeChange = jest.fn();

    const { getByText } = render(
      <PaperProvider>
        <SplitSelector
          members={[
            {
              memberId: 'm1',
              userId: 'u1',
              name: 'Arun',
              email: 'arun@example.com',
              avatarUrl: null,
              role: 'OWNER',
            },
          ]}
          splitType="equal"
          selectedParticipantIds={['u1']}
          exactByUser={{}}
          percentagesByUser={{}}
          onSplitTypeChange={onSplitTypeChange}
          onParticipantsChange={jest.fn()}
          onExactChange={jest.fn()}
          onPercentageChange={jest.fn()}
        />
      </PaperProvider>,
    );

    expect(getByText('Arun (arun@example.com)')).toBeTruthy();
    fireEvent.press(getByText('Exact'));
    expect(onSplitTypeChange).toHaveBeenCalledWith('exact');
  });
});
