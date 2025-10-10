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
import StaffAttendance from '../../screens/Attendance/StaffAttendance';
import AddButtonReport from '../../screens/ReportsOfWeek/AddButtonReport';
import AddPaymentReport from '../../screens/ReportsOfWeek/AddPaymentReport';
import VerifyReport from '../../screens/ReportsOfWeek/VerifyReport';
import WeeklyReport from '../../screens/ReportsOfWeek/WeeklyReport';
import PaymentReport from '../../screens/PaymentMethods/PaymentReport';
import OldPaymentReport from '../../screens/PaymentMethods/OldPaymentReport';
import BusinessReport from '../../screens/PaymentMethods/BusinessReport';
import PaymentLedger from '../../screens/PaymentMethods/PaymentLedger';
import DashboardScreen from '../../screens/DashboardScreen/DashboardScreen';
import RegistrationForm from '../../screens/Auth/RegistrationForm';
import CustomerList from '../../screens/Customer/CustomerList';
import MyWallet from '../../screens/MyWallet/MyWallet';
import AddBalanceScreen from '../../screens/MyWallet/AddBalanceScreen';
import WithdrawBalanceScreen from '../../screens/MyWallet/WithdrawBalanceScreen';
import ResultScreen from '../../screens/ResultScreen/ResultScreen';
import BetterLuckScreen from '../../screens/ResultScreen/BetterLuckScreen';
import DailyResultFormScreen from '../../screens/DailyResultFormScreen';
import AddFundAccount from '../../screens/MyWallet/AddFundAccount';
import LogoutAllDevicesScreen from '../../screens/Auth/LogoutAllDevicesScreen';
import LanguageSettings from '../../screens/LanguageSettings/LanguageSettings';

const Stack = createStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="LogoutAllDevices" component={LogoutAllDevicesScreen} />

    {/* Main App with Tab Navigation */}
    <Stack.Screen name="MainApp" component={TabNavigator} />

    {/* Additional Screens accessible from tabs */}
    <Stack.Screen name="AgentList" component={AgentList} />
    <Stack.Screen name="StaffList" component={StaffListScreen} />
    <Stack.Screen name="DailyResultForm" component={DailyResultFormScreen} />
    <Stack.Screen name="ResultPage" component={ResultScreen} />
    <Stack.Screen name="Advance" component={Advance} />
    <Stack.Screen name="EntryDelete" component={EntryDelete} />
    <Stack.Screen name="AddPayment" component={AddPayment} />
    <Stack.Screen name="StaffAttendance" component={StaffAttendance} />
    <Stack.Screen name="Dashboard" component={DashboardScreen} />

    {/* Report Screens */}
    <Stack.Screen name="AddButtonReport" component={AddButtonReport} />
    <Stack.Screen name="AddPaymentReport" component={AddPaymentReport} />
    <Stack.Screen name="VerifyReport" component={VerifyReport} />
    <Stack.Screen name="WeeklyReport" component={WeeklyReport} />
    <Stack.Screen name="PaymentReport" component={PaymentReport} />
    <Stack.Screen name="OldPaymentReport" component={OldPaymentReport} />
    <Stack.Screen name="BusinessReport" component={BusinessReport} />
    <Stack.Screen name="PaymentLedger" component={PaymentLedger} />

    {/* Auth and User Screens */}
    <Stack.Screen name="Register" component={RegistrationForm} />
    <Stack.Screen name="CustomerList" component={CustomerList} />
    <Stack.Screen name="AddBalance" component={AddBalanceScreen} />
    <Stack.Screen name="WithdrawBalance" component={WithdrawBalanceScreen} />
    <Stack.Screen name="Result" component={DailyResultFormScreen} />
    <Stack.Screen name="BetterLuck" component={BetterLuckScreen} />
    <Stack.Screen name="LanguageSettings" component={LanguageSettings} />
    <Stack.Screen name="Account" component={AddFundAccount} />
  </Stack.Navigator>
);

export default StackNavigator;
