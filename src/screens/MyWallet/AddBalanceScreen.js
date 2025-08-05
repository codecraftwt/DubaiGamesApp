import React, { useState } from 'react';
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
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { globalColors } from '../../Theme/globalColors';
import { useDispatch, useSelector } from 'react-redux';
import { addToWallet } from '../../Redux/Slices/walletSlice';
import RazorpayCheckout from 'react-native-razorpay';
import { API_BASE_URL } from '../../utils/Api';

const AddBalanceScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const { balance } = useSelector(state => state.wallet);
  const { user } = useSelector(state => state.auth);
  const token = useSelector(state => state.auth.token);
  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const getRazorpayKey = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get/key`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success && data.razorpay_key) {
        return data.razorpay_key;
      } else {
        throw new Error('Failed to fetch Razorpay key');
      }
    } catch (error) {
      console.error('Error fetching Razorpay key:', error);
      Alert.alert('Error', 'Unable to initiate payment. Please try again later.');
      return null;
    }
  };

  const handleAddBalance = async () => {
    if (!amount && !selectedAmount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const amountToAdd = selectedAmount || parseFloat(amount);
    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (amountToAdd > 50000) {
      Alert.alert('Error', 'Maximum amount limit is ₹50,000');
      return;
    }

    const razorpayKey = await getRazorpayKey();
    console.log("razorpayKey", razorpayKey)
    if (!razorpayKey) return;

    // Razorpay expects amount in paise (multiply by 100)
    const options = {
      description: 'Add Money to Wallet',
      image: 'https://your-logo-url.com/logo.png', // optional, replace with your logo
      currency: 'INR',
      key: razorpayKey,
      amount: amountToAdd * 100,
      name: 'Dubai Games',
      prefill: {
        email: user?.email || '',    // Use user's email if available
        contact: user?.phone || '',  // Use user's phone if available
        name: user?.name || '',
      },
      theme: { color: globalColors.blue },
    };

    RazorpayCheckout.open(options)
      .then(async (data) => {
        console.log('data from razorpay', data);
        setLoading(true);

        try {
          const response = await fetch(`${API_BASE_URL}/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_payment_id: data.razorpay_payment_id,
            }),
          });

          const verifyResult = await response.json();

          if (!response.ok || verifyResult.status !== 'captured') {
            throw new Error(
              verifyResult.message || 'Payment verification failed'
            );
          }

          await dispatch(
            addToWallet({
              amount: amountToAdd,
              razorpay_payment_id: data.razorpay_payment_id,
            })
          ).unwrap();

          navigation.goBack();
        } catch (error) {
          Alert.alert('Error', error.message || 'Transaction failed');
        } finally {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log('Payment Failed', error);
        Alert.alert('Payment Failed', 'Transaction could not be completed');
      });
  };

  const handleQuickAmountPress = (quickAmount) => {
    setSelectedAmount(quickAmount);
    setAmount(quickAmount.toString());
    Keyboard.dismiss(); // Dismiss keyboard when selecting quick amount
  };

  const handleAmountChange = (text) => {
    setAmount(text);
    if (selectedAmount && text !== selectedAmount.toString()) {
      setSelectedAmount(null);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
        >
          <View style={styles.contentContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}>
                  <Icon name="arrow-back" size={24} color={globalColors.darkBlue} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Money</Text>
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
                    onChangeText={handleAmountChange}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
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
                      ]}
                      onPress={() => handleQuickAmountPress(quickAmount)}>
                      <Text
                        style={[
                          styles.quickAmountText,
                          selectedAmount === quickAmount &&
                          styles.selectedQuickAmountText,
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
                  Money will be added to your wallet instantly
                </Text>
              </View>
            </ScrollView>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.addButton, loading && styles.buttonDisabled]}
              onPress={handleAddBalance}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color={globalColors.white} />
              ) : (
                <Text style={styles.addButtonText}>Add Money</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.LightWhite,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: globalColors.darkBlue,
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
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: globalColors.blue,
    marginBottom: 5,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: globalColors.darkBlue,
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: globalColors.darkBlue,
    paddingVertical: 10,
  },
  quickAmountTitle: {
    fontSize: 12,
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: globalColors.grey,
  },
  selectedQuickAmount: {
    backgroundColor: globalColors.blue,
    borderColor: globalColors.blue,
  },
  quickAmountText: {
    fontSize: 16,
    color: globalColors.darkBlue,
  },
  selectedQuickAmountText: {
    color: globalColors.white,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globalColors.LightWhite,
    borderRadius: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 12,
    color: globalColors.grey,
  },
  footer: {
    padding: 20,
    // backgroundColor: globalColors.white,
    // borderTopWidth: 1,
    // borderTopColor: globalColors.lightgrey,
  },
  addButton: {
    backgroundColor: globalColors.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    color: globalColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddBalanceScreen;