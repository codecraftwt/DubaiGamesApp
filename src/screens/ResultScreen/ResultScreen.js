import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {globalColors} from '../../Theme/globalColors';
import {useFocusEffect} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const ResultScreen = ({navigation, route}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useFocusEffect(
    useCallback(() => {
      // Reset values first
      scale.value = 0;
      opacity.value = 0;
      translateY.value = 50;

      // Trigger animations
      scale.value = withSpring(1, {
        damping: 10,
        stiffness: 100,
      });
      opacity.value = withSequence(
        withDelay(500, withTiming(1, {duration: 1000})),
      );
      translateY.value = withSequence(
        withDelay(1000, withSpring(0, {damping: 10, stiffness: 100})),
      );

      return () => {
        // Optional: Reset on blur if you want it to animate again on next focus
        scale.value = 0;
        opacity.value = 0;
        translateY.value = 50;
      };
    }, []),
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{translateY: translateY.value}],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />
      </View>

      <Animated.View style={[styles.trophyContainer, animatedStyle]}>
        <Icon name="trophy" size={120} color="#FFD700" />
      </Animated.View>

      <Animated.View style={[styles.contentContainer, contentStyle]}>
        <Text style={styles.congratsText}>Congratulations!</Text>
        <Text style={styles.winText}>You Won</Text>
        <Text style={styles.amountText}>₹{route.params?.amount || '0'}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Icon
              name="calendar-outline"
              size={24}
              color={globalColors.primary}
            />
            <Text style={styles.detailText}>
              {new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="time-outline" size={24} color={globalColors.primary} />
            <Text style={styles.detailText}>
              {new Date().toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.white,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 30,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  congratsText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: globalColors.darkBlue,
    marginBottom: 10,
  },
  winText: {
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    color: globalColors.grey,
    marginBottom: 20,
  },
  amountText: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    color: '#FFD700',
    marginBottom: 40,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 10,
    borderRadius: 10,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: globalColors.darkBlue,
    marginLeft: 8,
  },
  button: {
    backgroundColor: globalColors.Charcoal,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: globalColors.white,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
});

export default ResultScreen;
