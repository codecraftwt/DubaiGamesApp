import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {globalColors} from '../../Theme/globalColors';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToWallet,
  withdrawFromWallet,
  setWalletBalance,
} from '../../Redux/Slices/walletSlice';

const MyWallet = () => {
  const dispatch = useDispatch();
  const {balance, loading} = useSelector(state => state.wallet);
  const {user, wallet_balance} = useSelector(state => state.auth);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('credit'); // 'credit' or 'debit'
  const [transactions, setTransactions] = useState([]);

  console.log('wallet_balance --------->', wallet_balance);

  useEffect(() => {
    // Set initial wallet balance from user data
    if (wallet_balance) {
      dispatch(setWalletBalance(wallet_balance));
    }
  }, [user, wallet_balance]);

  const handleTransaction = () => {
    const amountToProcess = parseFloat(amount);
    if (!isNaN(amountToProcess) && amountToProcess > 0) {
      if (transactionType === 'credit') {
        dispatch(addToWallet({amount: amountToProcess}));
      } else {
        dispatch(withdrawFromWallet({amount: amountToProcess}));
      }
      setModalVisible(false);
      setAmount('');
    } else {
      Alert.alert('Invalid amount', 'Please enter a valid number.');
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.transactionItem}>
      <View style={[styles.iconContainer, {backgroundColor: item.color}]}>
        <Icon name={item.icon} size={20} color="#fff" />
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.subDetails}>
          {item.time ? (
            <Text style={styles.subText}>
              <Icon name="time-outline" size={14} /> {item.time}
            </Text>
          ) : null}
          <Text style={styles.subText}>
            <Icon name="calendar-outline" size={14} /> {item.date}
          </Text>
        </View>
      </View>
      <Text style={styles.amount}>{item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.balance}>{balance.toLocaleString()} Rs</Text>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.cardNumber}>{user?.phone || ''}</Text>
        <Icon
          name="wallet-outline"
          size={24}
          color="#fff"
          style={styles.walletIcon}
        />

        <TouchableOpacity
          onPress={() => {
            setTransactionType('credit');
            setModalVisible(true);
          }}
          style={{position: 'absolute', top: 20, right: 20}}>
          <Icon name="add-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setTransactionType('debit');
            setModalVisible(true);
          }}
          style={{position: 'absolute', top: 20, right: 60}}>
          <Icon name="remove-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsHeader}>
        <Text style={styles.latestText}>Latest Transactions</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={globalColors.primary} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {transactionType === 'credit'
                ? 'Add Balance'
                : 'Withdraw Balance'}
            </Text>
            <TextInput
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />
            <Button
              title={transactionType === 'credit' ? 'Add' : 'Withdraw'}
              onPress={handleTransaction}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.LightWhite,
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#0F0F2D',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    position: 'relative',
  },
  balance: {
    color: globalColors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  name: {
    color: globalColors.white,
    marginTop: 20,
    fontSize: 16,
  },
  cardNumber: {
    color: globalColors.white,
    marginTop: 5,
    letterSpacing: 2,
  },
  walletIcon: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  latestText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewAll: {
    color: globalColors.suvagrey,
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globalColors.white,
    padding: 15,
    marginBottom: 12,
    borderRadius: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  subDetails: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  subText: {
    color: globalColors.suvagrey,
    fontSize: 13,
    marginRight: 10,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: globalColors.white,
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: globalColors.grey,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
});

export default MyWallet;
