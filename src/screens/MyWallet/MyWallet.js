import React, {useState} from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {globalColors} from '../../Theme/globalColors';

const MyWallet = () => {
  const [balance, setBalance] = useState(7409332);
  const [modalVisible, setModalVisible] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      title: 'Angga Big Park',
      time: '10 hours',
      amount: '$49,509',
      date: '12 January 2025',
      icon: 'globe-outline',
      color: '#5567FF',
    },
    {
      id: '2',
      title: 'Top Up',
      time: '',
      amount: '$43,129,509',
      date: '12 January 2024',
      icon: 'arrow-up-circle-outline',
      color: '#32D74B',
    },
    {
      id: '3',
      title: 'Angga Big Park',
      time: '10 hours',
      amount: '$49,509',
      date: '12 January 2024',
      icon: 'globe-outline',
      color: '#5567FF',
    },
  ]);

  const handleTopUp = () => {
    const amountToAdd = parseFloat(topUpAmount);
    if (!isNaN(amountToAdd) && amountToAdd > 0) {
      const newBalance = balance + amountToAdd;
      setBalance(newBalance);
      const newTransaction = {
        id: Date.now().toString(),
        title: 'Top Up',
        time: '',
        amount: `$${amountToAdd.toLocaleString()}`,
        date: new Date().toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        icon: 'arrow-up-circle-outline',
        color: '#32D74B',
      };
      setTransactions([newTransaction, ...transactions]);

      setModalVisible(false);
      setTopUpAmount('');
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
        <Text style={styles.balance}>${balance.toLocaleString()}</Text>
        <Text style={styles.name}>Angga Risky</Text>
        <Text style={styles.cardNumber}>2208 1996 4900</Text>
        <Icon
          name="wallet-outline"
          size={24}
          color="#fff"
          style={styles.walletIcon}
        />

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{position: 'absolute', top: 20, right: 20}}>
          <Icon name="add-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsHeader}>
        <Text style={styles.latestText}>Latest Transactions</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

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
            <Text style={styles.modalTitle}>Add Balance</Text>
            <TextInput
              placeholder="Enter amount"
              keyboardType="numeric"
              value={topUpAmount}
              onChangeText={setTopUpAmount}
              style={styles.input}
            />
            <Button title="Add" onPress={handleTopUp} />
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
