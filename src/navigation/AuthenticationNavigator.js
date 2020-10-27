import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {getDefaultNavOptions} from './DrawerNavigator';

import LoginScreen from '../screens/Authentication/LoginScreen';
import SelectAccountScreen from '../screens/Authentication/SelectAccountScreen';
import ForgotPasswordScreen from '../screens/Authentication/ForgotPasswordScreen';
import Translations from '../services/localization/Translations';

const AuthenticationStack = createStackNavigator();

export default function AuthenticationNavigator({initialRouteName}) {
  return (
    <AuthenticationStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={getDefaultNavOptions()}>
      <AuthenticationStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: Translations.LOGIN,
          headerShown: false,
        }}
      />
      <AuthenticationStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: Translations.RESET_PASSWORD,
          headerBackTitle: Translations.GO_BACK,
          headerShown: true,
        }}
      />
      <AuthenticationStack.Screen
        name="SelectAccount"
        component={SelectAccountScreen}
        options={{
          title: Translations.SELECT_ACCOUNT,
          headerShown: false,
        }}
      />
    </AuthenticationStack.Navigator>
  );
}
