import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { globalColors } from '../../Theme/globalColors';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const ResultScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  const result = route?.params?.result;
  const openResult = result?.open_result;
  const closeResult = result?.close_result;

  useFocusEffect(
    useCallback(() => {
      scale.value = 0;
      opacity.value = 0;
      translateY.value = 50;

      scale.value = withSpring(1, { damping: 12, stiffness: 120 });
      opacity.value = withSequence(withDelay(500, withTiming(1, { duration: 800 })));
      translateY.value = withSequence(withDelay(800, withSpring(0, { damping: 12, stiffness: 120 })));

      return () => {
        scale.value = 0;
        opacity.value = 0;
        translateY.value = 50;
      };
    }, [])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const renderBadge = (label, value, color) => (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{label}: {value}</Text>
    </View>
  );

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icon name="arrow-back" size={30} color={globalColors.primary} />
      </TouchableOpacity>

      {/* Background Circles */}
      <View style={styles.background}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />
      </View>

      <Animated.View style={[styles.trophyContainer, animatedStyle]}>
        <Icon name="trophy" size={120} color="#FFD700" />
      </Animated.View>

      <Animated.View style={[styles.contentContainer, contentStyle]}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
          <Text style={styles.congratsText}>{t('congratulations')}</Text>
          <Text style={styles.winText}>{t('youWon')}</Text>
          <Text style={styles.amountText}>₹{route.params?.amount || '0'}</Text>

          {/* Details Card */}
          <View style={styles.card}>
            {/* Date */}
            <View style={styles.detailItem}>
              <Icon name="calendar-outline" size={24} color={globalColors.primary} />
              <Text style={styles.detailText}>
                {new Date(route?.params?.data?.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>

            {/* Time */}
            <View style={styles.detailItem}>
              <Icon name="time-outline" size={24} color={globalColors.primary} />
              <Text style={styles.detailText}>
                {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>

            {/* Open Result */}
            {openResult && !closeResult && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>OPEN RESULT</Text>
                <Text style={styles.resultValue}>
                  {openResult.pannumber}-{openResult.number}
                </Text>
              </View>
            )}

            {closeResult && !openResult && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>CLOSE RESULT</Text>
                <Text style={styles.resultValue}>
                  {closeResult.number}-{closeResult.pannumber}
                </Text>
              </View>
            )}

            {openResult && closeResult && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>RESULT</Text>
                <Text style={styles.resultValue}>
                  {openResult.pannumber}-{openResult.number}{closeResult.number}-{closeResult.pannumber}
                </Text>
              </View>
            )}


            {/* Market */}
            <View style={styles.detailItem}>
              <Icon name="storefront-outline" size={24} color={globalColors.primary} />
              <Text style={styles.detailText}>{route?.params?.data?.market}</Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.white,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 100, // Ensure it's above other components
    padding: 10,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    top: -width * 0.5,
    left: -width * 0.25,
  },
  circle2: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    bottom: -width * 0.3,
    right: -width * 0.1,
  },
  circle3: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    top: '30%',
    right: -width * 0.2,
  },
  trophyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  congratsText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: globalColors.darkBlue,
    marginBottom: 8,
    textAlign: 'center',
  },
  winText: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: globalColors.grey,
    marginBottom: 16,
    textAlign: 'center',
  },
  amountText: {
    fontSize: 44,
    fontFamily: 'Poppins-Bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: globalColors.white,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: globalColors.darkBlue,
    marginLeft: 12,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
    justifyContent: 'flex-start',
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  resultRow: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },

});

export default ResultScreen;
