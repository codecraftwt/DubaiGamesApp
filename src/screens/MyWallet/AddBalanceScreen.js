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
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {globalColors} from '../../Theme/globalColors';
import {useDispatch, useSelector} from 'react-redux';
import {addToWallet} from '../../Redux/Slices/walletSlice';

const AddBalanceScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const {balance} = useSelector(state => state.wallet);

  const quickAmounts = [100, 500, 1000, 2000, 5000];

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

    setLoading(true);
    try {
      await dispatch(addToWallet({amount: amountToAdd})).unwrap();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add balance');
    } finally {
      setLoading(false);
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
                ]}
                onPress={() => {
                  setSelectedAmount(quickAmount);
                  setAmount('');
                }}>
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
