import React, { useEffect, useState } from 'react';
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
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { globalColors } from '../../Theme/globalColors';
import { useDispatch, useSelector } from 'react-redux';
import { getWalletHistory, getWithdrawHistory, withdrawFromWallet } from '../../Redux/Slices/walletSlice';

const WithdrawBalanceScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { balance, withdrawHistory, loading, error } = useSelector(state => ({
    balance: state.wallet.balance,
    withdrawHistory: state.wallet.withdrawHistory,
    loading: state.wallet.loading,
    error: state.wallet.error
  }));
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  useEffect(() => {
    dispatch(getWithdrawHistory());
    dispatch(getWalletHistory());
  }, [dispatch]);

  const handleQuickAmountPress = (quickAmount) => {
    if (quickAmount <= balance) {
      setSelectedAmount(quickAmount);
      setAmount(quickAmount.toString());
    }
  };

  const handleAmountChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(numericValue);
    setSelectedAmount(null); // Clear quick amount selection when typing
  };

  const handleWithdraw = async () => {
    if (!amount && selectedAmount === null) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const amountToWithdraw = selectedAmount !== null ? selectedAmount : parseFloat(amount);

    if (isNaN(amountToWithdraw)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (amountToWithdraw <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return;
    }

    if (amountToWithdraw < 200) {
      Alert.alert('Error', 'Minimum withdrawal amount is ₹200');
      return;
    }

    if (amountToWithdraw > balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    try {
      await dispatch(withdrawFromWallet({ amount: amountToWithdraw }));
      await dispatch(getWithdrawHistory());
      setAmount('');
      setSelectedAmount(null);
      // Alert.alert('Success', 'Withdrawal request submitted successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to withdraw balance');
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Icon name="checkmark-circle" size={20} color="green" />;
      case 'pending':
        return <Icon name="time-outline" size={20} color="orange" />;
      case 'rejected':
        return <Icon name="close-circle" size={20} color="red" />;
      default:
        return <Icon name="help-circle" size={20} color="gray" />;
    }
  };

  const displayedHistory = showAllHistory ? withdrawHistory : (withdrawHistory?.slice(0, 4) || []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
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
              <Text style={styles.balanceAmount}>₹{balance?.toLocaleString('en-IN') ?? '0'}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Enter Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  keyboardType="numeric"
                  value={selectedAmount !== null ? selectedAmount.toString() : amount}
                  onChangeText={handleAmountChange}  // Use the new handler
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
                    onPress={() => handleQuickAmountPress(quickAmount)}  // Use the new handler
                    disabled={quickAmount > balance}>
                    <Text
                      style={[
                        styles.quickAmountText,
                        selectedAmount === quickAmount && styles.selectedQuickAmountText,
                        quickAmount > balance && styles.disabledAmountText,
                      ]}>
                      ₹{quickAmount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.infoCard}>
              <Icon name="information-circle-outline" size={24} color={globalColors.blue} />
              <Text style={styles.infoText}>
                Money will be withdrawn from your wallet. It may take 2-3 business days to process.
              </Text>
            </View>

            <View style={styles.historySection}>
              <Text style={styles.historyTitle}>Withdrawal History</Text>
              {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
              ) : error ? (
                <Text style={styles.errorText}>Failed to fetch history</Text>
              ) : (
                <View>
                  {withdrawHistory?.length === 0 ? (
                    <Text style={styles.noHistoryText}>No withdrawal history available</Text>
                  ) : (
                    <>
                      {displayedHistory.map((item, index) => (
                        <View key={index} style={styles.historyItem}>
                          <View style={styles.historyItemRow}>
                            <Text style={styles.historyItemAmount}>₹{item?.amount?.toLocaleString('en-IN')}</Text>
                            {getStatusIcon(item.status)}
                          </View>
                          <Text style={styles.historyItemDate}>
                            {(item.created_at).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Text>
                        </View>
                      ))}
                      {withdrawHistory.length > 4 && (
                        <TouchableOpacity
                          onPress={() => setShowAllHistory(!showAllHistory)}
                          style={styles.viewMoreButton}
                        >
                          <Text style={styles.viewMoreText}>
                            {showAllHistory ? 'Show Less' : 'View More'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Fixed bottom button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.withdrawButton,
              (loading || (!amount && selectedAmount === null)) && styles.disabledButton
            ]}
            onPress={handleWithdraw}
            disabled={loading || (!amount && selectedAmount === null)}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.withdrawButtonText}>Withdraw Money</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: globalColors.white,
  },
  container: {
    flex: 1,
    backgroundColor: globalColors.LightWhite,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Extra padding to account for fixed button
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: globalColors.darkBlue,
  },
  balanceCard: {
    backgroundColor: globalColors.blue,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: globalColors.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: globalColors.darkBlue,
    marginBottom: 15,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: globalColors.primary,
    marginBottom: 20,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: globalColors.darkBlue,
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: globalColors.darkBlue,
    paddingVertical: 10,
  },
  quickAmountTitle: {
    fontSize: 14,
    color: globalColors.grey,
    marginBottom: 15,
  },
  quickAmountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickAmountButton: {
    backgroundColor: globalColors.lightGrey,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: globalColors.lightGrey,
  },
  selectedQuickAmount: {
    backgroundColor: globalColors.blue,
    borderColor: globalColors.primary,
  },
  disabledAmount: {
    opacity: 0.5,
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
    backgroundColor: globalColors.lightPrimary,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: globalColors.darkBlue,
    flex: 1,
  },
  historySection: {
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: globalColors.darkBlue,
    marginBottom: 15,
  },
  historyItem: {
    backgroundColor: globalColors.white,
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  historyItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  historyItemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: globalColors.darkBlue,
  },
  historyItemDate: {
    fontSize: 14,
    color: globalColors.grey,
  },
  noHistoryText: {
    textAlign: 'center',
    color: globalColors.grey,
    marginTop: 10,
    fontSize: 16,
  },
  viewMoreButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  viewMoreText: {
    color: globalColors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: globalColors.white,
    padding: 16,
    // borderTopWidth: 1,
    // borderTopColor: globalColors.lightGrey,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  withdrawButton: {
    backgroundColor: globalColors.blue,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  withdrawButtonText: {
    color: globalColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: globalColors.Charcoal,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: globalColors.grey,
    paddingVertical: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: globalColors.error,
    paddingVertical: 20,
  },
});

export default WithdrawBalanceScreen;