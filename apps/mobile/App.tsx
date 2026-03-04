import 'react-native-gesture-handler';
import React from 'react';
import { Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { AppNavigator } from './app/navigation/AppNavigator';
import { appTheme } from './app/theme/theme';
import { useAuthStore } from './app/store/authStore';
import { userService } from './app/services/user.service';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const accessToken = useAuthStore((state) => state.accessToken);

  React.useEffect(() => {
    const register = async () => {
      if (!accessToken) {
        return;
      }

      const permission = await Notifications.getPermissionsAsync();
      let status = permission.status;

      if (status !== 'granted') {
        const requested = await Notifications.requestPermissionsAsync();
        status = requested.status;
      }

      if (status !== 'granted') {
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      const deviceType = (Platform.OS === 'android' ? 'android' : Platform.OS === 'ios' ? 'ios' : 'web') as
        | 'ios'
        | 'android'
        | 'web';

      await userService.registerPushToken(token, deviceType);
    };

    void register();
  }, [accessToken]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={appTheme}>
          <StatusBar style="dark" />
          <AppNavigator />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
