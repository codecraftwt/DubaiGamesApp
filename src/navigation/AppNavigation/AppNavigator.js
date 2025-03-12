import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from '../StackNavigation/StackNavigator';


const AppNavigator = () => (
  <NavigationContainer>
    <StackNavigator />
  </NavigationContainer>
);

export default AppNavigator;
