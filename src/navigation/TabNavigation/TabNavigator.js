import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import DashboardScreen from '../../screens/DashboardScreen/DashboardScreen';
import SettingsScreen from '../../screens/Setting/Settings';
import DrawerNavigator from '../DrawerNavigation/DrawerNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === 'Dashboard') iconName = 'home';
                else if (route.name === 'Setting') iconName = 'settings'; // Settings icon

                return <Feather name={iconName} size={size} color={color} />;
            },
        })}
    >
        <Tab.Screen name="Dashboard" component={DrawerNavigator} />
        <Tab.Screen name="Setting" component={SettingsScreen} />
    </Tab.Navigator>
);

export default TabNavigator;
