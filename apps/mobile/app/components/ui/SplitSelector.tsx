import React from 'react';
import { View } from 'react-native';
import { Button, Checkbox, Text, TextInput } from 'react-native-paper';
import type { GroupMemberSummaryDto } from '@fairshare/shared-types';
import { SplitType } from '../../utils/split';

type SplitSelectorProps = {
  members: GroupMemberSummaryDto[];
  splitType: SplitType;
  selectedParticipantIds: string[];
  exactByUser: Record<string, string>;
  percentagesByUser: Record<string, string>;
  onSplitTypeChange: (type: SplitType) => void;
  onParticipantsChange: (participantIds: string[]) => void;
  onExactChange: (userId: string, value: string) => void;
  onPercentageChange: (userId: string, value: string) => void;
};

export function SplitSelector({
  members,
  splitType,
  selectedParticipantIds,
  exactByUser,
  percentagesByUser,
  onSplitTypeChange,
  onParticipantsChange,
  onExactChange,
  onPercentageChange,
}: SplitSelectorProps) {
  const toggleParticipant = (userId: string) => {
    if (selectedParticipantIds.includes(userId)) {
      onParticipantsChange(selectedParticipantIds.filter((id) => id !== userId));
      return;
    }
    onParticipantsChange([...selectedParticipantIds, userId]);
  };

  return (
    <View style={{ gap: 10 }}>
      <Text variant="titleMedium">Split Type</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button mode={splitType === 'equal' ? 'contained' : 'outlined'} onPress={() => onSplitTypeChange('equal')}>
          Equal
        </Button>
        <Button mode={splitType === 'exact' ? 'contained' : 'outlined'} onPress={() => onSplitTypeChange('exact')}>
          Exact
        </Button>
        <Button
          mode={splitType === 'percentage' ? 'contained' : 'outlined'}
          onPress={() => onSplitTypeChange('percentage')}
        >
          Percentage
        </Button>
      </View>

      <Text variant="titleMedium">Participants</Text>
      {members.map((member) => (
        <View
          key={member.memberId}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
        >
          <Text>
            {member.name} ({member.email})
          </Text>
          <Checkbox
            status={selectedParticipantIds.includes(member.userId) ? 'checked' : 'unchecked'}
            onPress={() => toggleParticipant(member.userId)}
          />
        </View>
      ))}

      {splitType === 'exact'
        ? selectedParticipantIds.map((userId) => {
            const member = members.find((item) => item.userId === userId);
            return (
              <TextInput
                key={userId}
                label={`Exact cents - ${member?.name ?? userId}`}
                keyboardType="numeric"
                value={exactByUser[userId] ?? ''}
                onChangeText={(value) => onExactChange(userId, value)}
              />
            );
          })
        : null}

      {splitType === 'percentage'
        ? selectedParticipantIds.map((userId) => {
            const member = members.find((item) => item.userId === userId);
            return (
              <TextInput
                key={userId}
                label={`Percent - ${member?.name ?? userId}`}
                keyboardType="numeric"
                value={percentagesByUser[userId] ?? ''}
                onChangeText={(value) => onPercentageChange(userId, value)}
              />
            );
          })
        : null}
    </View>
  );
}
