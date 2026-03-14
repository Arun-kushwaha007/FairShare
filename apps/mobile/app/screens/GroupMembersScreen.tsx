import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import type { GroupMemberSummaryDto } from '@fairshare/shared-types';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';
import { ListItem } from '../components/ui/ListItem';
import { EmptyState } from '../components/ui/EmptyState';

export function GroupMembersScreen({ route }: { route: { params: { groupId: string } } }) {
  const [members, setMembers] = React.useState<GroupMemberSummaryDto[]>([]);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviting, setInviting] = React.useState(false);
  const toast = useToastStore((state) => state.show);

  const loadMembers = React.useCallback(async () => {
    try {
      const data = await groupService.members(route.params.groupId);
      setMembers(data);
    } catch {
      toast('Failed to load members');
    }
  }, [route.params.groupId, toast]);

  React.useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const onInvite = async () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email) {
      toast('Enter an email to invite');
      return;
    }

    // Basic email validation
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast('Invalid email format');
      return;
    }

    try {
      setInviting(true);
      await groupService.invite(route.params.groupId, { email });
      setInviteEmail('');
      toast('Invite successfully sent');
      await loadMembers();
    } catch (error: any) {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        toast(message[0]);
      } else if (typeof message === 'string') {
        toast(message);
      } else {
        toast('Failed to invite member');
      }
    } finally {
      setInviting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text variant="headlineSmall">Members</Text>
      <TextInput
        label="Invite by email"
        value={inviteEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setInviteEmail}
      />
      <Button mode="contained" onPress={() => void onInvite()} loading={inviting} disabled={inviting}>
        Invite
      </Button>

      {members.length === 0 ? (
        <EmptyState title="No members found" />
      ) : (
        members.map((member) => (
          <ListItem key={member.memberId} title={member.name} description={`${member.email} • ${member.role}`} />
        ))
      )}
    </ScrollView>
  );
}
