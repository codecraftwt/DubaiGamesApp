import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { globalColors } from '../../Theme/globalColors';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearWalletState,
  getWalletHistory,
} from '../../Redux/Slices/walletSlice';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

const MyWallet = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { balance, history, loading } = useSelector(state => state.wallet); // Add loading to the selector
  const { user } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getWalletHistory());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(getWalletHistory());
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getWalletHistory());

      return () => {
        dispatch(clearWalletState());
      };
    }, [dispatch])
  );

  const formatDate = dateString => {
    const date = new Date(dateString);
    return format(date, 'dd-MMM-yyyy hh:mm a');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.fixedHeader}>
        <View style={styles.card}>
          <Text style={styles.balance}>{balance} Rs</Text>
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
          <Text style={styles.latestText}>{t('latestTransactions')}</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>{t('viewAll')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.transactionsScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <View style={styles.transactionsList}>
          {/* Show loader while loading data */}
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={globalColors.primary} />
            </View>
          ) : (
            history?.map((transaction, index) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Icon
                    name={
                      transaction.transaction_type === 'credit'
                        ? 'arrow-down'
                        : 'arrow-up'
                    }
                    size={20}
                    color={
                      transaction.transaction_type === 'credit'
                        ? '#4CAF50'
                        : '#F44336'
                    }
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionType}>
                    {transaction.trans_head
                      ? transaction.trans_head
                      : transaction.transaction_type}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {formatDate(transaction.created_at)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color:
                        transaction.transaction_type === 'credit'
                          ? '#4CAF50'
                          : '#F44336',
                    },
                  ]}>
                  {transaction.transaction_type === 'credit' ? '+' : '-'}
                  {parseInt(transaction.amount).toLocaleString()} Rs
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: globalColors.LightWhite,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: globalColors.LightWhite,
  },
  transactionsScroll: {
    flex: 1,
    marginTop: 250,
  },
  card: {
    backgroundColor: '#0F0F2D',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    position: 'relative',
  },
  balance: {
    color: globalColors.white,
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
  },
  name: {
    color: globalColors.white,
    fontFamily: 'Poppins-Medium',
    marginTop: 20,
    fontSize: 16,
  },
  cardNumber: {
    color: globalColors.white,
    fontFamily: 'Poppins-Medium',
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
    marginHorizontal: 20,
    marginBottom: 10,
  },
  latestText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  viewAll: {
    color: globalColors.suvagrey,
    fontSize: 14,
  },
  transactionsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globalColors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: globalColors.darkBlue,
    textTransform: 'capitalize',
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: globalColors.grey,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
});

export default MyWallet;
