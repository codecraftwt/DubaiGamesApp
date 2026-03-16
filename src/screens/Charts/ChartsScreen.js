import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChartLandingScreen from './ChartLandingScreen';
import VartharListScreen from './VartharListScreen';
import PreviousResultChartScreen from './PreviousResultChartScreen';

const ChartStack = createStackNavigator();

const ChartsScreen = () => {
    return (
        <ChartStack.Navigator
            screenOptions={{
                headerStyle: {
                    height: 50, // Smaller header height
                    backgroundColor: '#fff', // optional
                    shadowColor: 'transparent', // remove shadow on iOS
                    elevation: 0, // remove shadow on Android
                },
                headerTitleAlign: 'center', // center the title
                headerTitleStyle: {
                    fontSize: 16, // smaller font size
                    fontWeight: '600',
                },
                headerBackTitleVisible: false, // remove back text
            }}
        >
            <ChartStack.Screen
                name="ChartLanding"
                component={ChartLandingScreen}
                options={{ headerShown: false }} // hide header on landing
            />
            <ChartStack.Screen
                name="VartharList"
                component={VartharListScreen}
                options={{
                    headerShown: false
                }}
            />
            <ChartStack.Screen
                name="PreviousResultChart"
                component={PreviousResultChartScreen}
                options={{
                    headerShown: false
                }}
            />
        </ChartStack.Navigator>
    );
};

export default ChartsScreen;