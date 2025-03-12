import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../../screens/Splash/SplashScreen';
import LoginScreen from '../../screens/Auth/LoginScreen';
import TabNavigator from '../TabNavigation/TabNavigator';
import AgentList from '../../screens/Agent/AgentList';
import StaffListScreen from '../../screens/StaffList/StaffListScreen';
import DailyResult from '../../screens/Result/DailyResult';
import ResultPage from '../../screens/Result/ResultPage';
import AdvancePaymentScreen from '../../screens/Advance/Advance';
import Advance from '../../screens/Advance/Advance';
import EntryDelete from '../../screens/EntryDelete/EntryDelete';
import AddPayment from '../../screens/AddPayment/AddPayment';



const Stack = createStackNavigator();

const StackNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AgentList" component={AgentList} />
        <Stack.Screen name="StaffList" component={StaffListScreen} />
        <Stack.Screen name="DailyResult" component={DailyResult} />
        <Stack.Screen name="ResultPage" component={ResultPage} />
        <Stack.Screen name="Advance" component={Advance} />
        <Stack.Screen name="EntryDelete" component={EntryDelete} />
        <Stack.Screen name="AddPayment" component={AddPayment} />
        <Stack.Screen name="MainApp" component={TabNavigator} />
    </Stack.Navigator>
);

export default StackNavigator;
