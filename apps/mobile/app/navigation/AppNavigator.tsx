import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
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
import { GlobalToast } from '../components/ui/GlobalToast';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Groups: undefined;
  Activity: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Dashboard: undefined;
  Tabs: undefined;
  GroupDetail: { groupId: string };
  GroupMembers: { groupId: string };
  AddExpense: { groupId: string };
  ExpenseDetail: { expenseId: string };
  SettleUp: { groupId: string };
  Settings: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconByRoute: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
            Groups: 'account-group',
            Activity: 'history',
            Profile: 'account',
          };
          return <MaterialCommunityIcons name={iconByRoute[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Groups" component={GroupListScreen} />
      <Tabs.Screen name="Activity" component={ActivityScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

function AppStack() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Dashboard" component={HomeScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />
      <RootStack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <RootStack.Screen name="GroupMembers" component={GroupMembersScreen} />
      <RootStack.Screen name="AddExpense" component={AddExpenseScreen} />
      <RootStack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
      <RootStack.Screen name="SettleUp" component={SettleUpScreen} />
      <RootStack.Screen name="Settings" component={SettingsScreen} />
    </RootStack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator>
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
