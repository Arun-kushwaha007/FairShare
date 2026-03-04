import React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

export function HomeScreen({ navigation }: { navigation: { navigate: (route: string, params?: any) => void } }) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Haptics.selectionAsync();
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Animated.View entering={FadeInDown.duration(400)} style={{ padding: 16 }}>
        <Text variant="headlineSmall">FairShare</Text>
        <Text variant="bodyMedium" style={{ marginVertical: 8 }}>Track shared expenses and settle quickly.</Text>
        <View style={{ gap: 8 }}>
          <Button mode="contained" onPress={() => navigation.navigate('Groups')}>Open Groups</Button>
        </View>
      </Animated.View>
    </ScrollView>
  );
}
