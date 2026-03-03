import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { GroupListScreen } from '../screens/GroupListScreen';
import { GroupDetailScreen } from '../screens/GroupDetailScreen';
import { AddExpenseScreen } from '../screens/AddExpenseScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  GroupList: undefined;
  GroupDetail: { groupId: string };
  AddExpense: { groupId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="GroupList" component={GroupListScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
    </Stack.Navigator>
  );
}
