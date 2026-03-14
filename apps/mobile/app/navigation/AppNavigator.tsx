import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '../theme/useAppTheme';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { GroupListScreen } from '../screens/GroupListScreen';
import { GroupDetailScreen } from '../screens/GroupDetailScreen';
import { GroupMembersScreen } from '../screens/GroupMembersScreen';
import { AddExpenseScreen } from '../screens/AddExpenseScreen';
import { ExpenseDetailScreen } from '../screens/ExpenseDetailScreen';
import { SettleUpScreen } from '../screens/SettleUpScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { CreateGroupScreen } from '../screens/CreateGroupScreen';
import { GlobalToast } from '../components/ui/GlobalToast';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Groups: undefined;
  Activity: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  GroupDetail: { groupId: string };
  GroupMembers: { groupId: string };
  AddExpense: { groupId: string };
  ExpenseDetail: { expenseId: string };
  SettleUp: { groupId: string };
  CreateGroup: undefined;
  Settings: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { colors, isDark } = useAppTheme();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text_secondary,
        tabBarStyle: {
          backgroundColor: isDark ? colors.surface : colors.card,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          const iconByRoute: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
            Dashboard: 'view-dashboard',
            Groups: 'account-group',
            Activity: 'history',
            Profile: 'account-circle',
          };
          return <MaterialCommunityIcons name={iconByRoute[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Dashboard" component={HomeScreen} />
      <Tabs.Screen name="Groups" component={GroupListScreen} />
      <Tabs.Screen name="Activity" component={ActivityScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

function AppStack() {
  const { colors, isDark } = useAppTheme();

  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? colors.surface : colors.card,
        },
        headerTintColor: colors.text_primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <RootStack.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />
      <RootStack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <RootStack.Screen name="GroupMembers" component={GroupMembersScreen} />
      <RootStack.Screen name="AddExpense" component={AddExpenseScreen} />
      <RootStack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
      <RootStack.Screen name="SettleUp" component={SettleUpScreen} />
      <RootStack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'Create Group' }} />
      <RootStack.Screen name="Settings" component={SettingsScreen} />
    </RootStack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

export function AppNavigator() {
  const token = useAuthStore((state) => state.accessToken);

  return (
    <>
      {token ? <AppStack /> : <AuthNavigator />}
      <GlobalToast />
    </>
  );
}

