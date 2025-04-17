import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {globalColors} from '../../Theme/globalColors';
import {useDispatch, useSelector} from 'react-redux';
import {withdrawFromWallet} from '../../Redux/Slices/walletSlice';

const WithdrawBalanceScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {balance} = useSelector(state => state.wallet);
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const handleWithdraw = async () => {
    if (!amount && !selectedAmount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const amountToWithdraw = selectedAmount || parseFloat(amount);
    if (isNaN(amountToWithdraw) || amountToWithdraw <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (amountToWithdraw > balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    try {
      await dispatch(withdrawFromWallet({amount: amountToWithdraw}));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to withdraw balance');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={globalColors.darkBlue} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Withdraw Money</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Enter Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              keyboardType="numeric"
              value={amount}
              onChangeText={text => {
                setAmount(text);
                setSelectedAmount(null);
              }}
            />
          </View>

          <Text style={styles.quickAmountTitle}>Quick Amounts</Text>
          <View style={styles.quickAmountContainer}>
            {quickAmounts.map(quickAmount => (
              <TouchableOpacity
                key={quickAmount}
                style={[
                  styles.quickAmountButton,
                  selectedAmount === quickAmount && styles.selectedQuickAmount,
                  quickAmount > balance && styles.disabledAmount,
                ]}
                onPress={() => {
                  if (quickAmount <= balance) {
                    setSelectedAmount(quickAmount);
                    setAmount('');
                  }
                }}
                disabled={quickAmount > balance}>
                <Text
                  style={[
                    styles.quickAmountText,
                    selectedAmount === quickAmount &&
                      styles.selectedQuickAmountText,
                    quickAmount > balance && styles.disabledAmountText,
                  ]}>
                  ₹{quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Icon
            name="information-circle-outline"
            size={24}
            color={globalColors.blue}
          />
          <Text style={styles.infoText}>
            Money will be withdrawn from your wallet instantly
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={handleWithdraw}>
          <Text style={styles.withdrawButtonText}>Withdraw Money</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.LightWhite,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBlock: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: globalColors.darkBlue,
  },
  balanceCard: {
    backgroundColor: globalColors.blue,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: globalColors.white,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: globalColors.white,
  },
  card: {
    backgroundColor: globalColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: globalColors.darkBlue,
    marginBottom: 20,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: globalColors.blue,
    marginBottom: 30,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: globalColors.darkBlue,
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: globalColors.darkBlue,
    paddingVertical: 10,
  },
  quickAmountTitle: {
    fontSize: 16,
    color: globalColors.grey,
    marginBottom: 15,
  },
  quickAmountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickAmountButton: {
    backgroundColor: globalColors.LightWhite,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: globalColors.grey,
  },
  selectedQuickAmount: {
    backgroundColor: globalColors.blue,
    borderColor: globalColors.blue,
  },
  disabledAmount: {
    opacity: 0.5,
    borderColor: globalColors.grey,
  },
  quickAmountText: {
    fontSize: 16,
    color: globalColors.darkBlue,
  },
  selectedQuickAmountText: {
    color: globalColors.white,
  },
  disabledAmountText: {
    color: globalColors.grey,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globalColors.LightWhite,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: globalColors.grey,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: globalColors.LightWhite,
  },
  withdrawButton: {
    backgroundColor: globalColors.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: globalColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WithdrawBalanceScreen;
