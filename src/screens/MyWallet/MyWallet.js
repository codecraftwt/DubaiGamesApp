import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {globalColors} from '../../Theme/globalColors';
import {useDispatch, useSelector} from 'react-redux';
import {getWalletHistory, setWalletBalance} from '../../Redux/Slices/walletSlice';

const MyWallet = ({navigation}) => {
  const dispatch = useDispatch();
  const {balance} = useSelector(state => state.wallet);
  const {user, wallet_balance} = useSelector(state => state.auth);

  useEffect(() => {
    if (wallet_balance) {
      dispatch(setWalletBalance(wallet_balance));
    }
  }, [user, wallet_balance]);


  useEffect(() => {
    dispatch(getWalletHistory());
  }, [dispatch]); 

  return (
    <ScrollView style={styles.container}>
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
          onPress={() => navigation.navigate('AddBalance')}
          style={styles.addButton}>
          <Icon name="add-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('WithdrawBalance')}
          style={styles.withdrawButton}>
          <Icon name="remove-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsHeader}>
        <Text style={styles.latestText}>Latest Transactions</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Add your transactions list here */}
    </ScrollView>
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
  addButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  withdrawButton: {
    position: 'absolute',
    top: 20,
    right: 60,
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
});

export default MyWallet;
