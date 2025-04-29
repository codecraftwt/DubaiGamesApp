import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { globalColors } from '../../Theme/globalColors';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { format } from 'date-fns';

const MarketCountdown = ({ marketData, selectedMarket, currentTime, selectedDate }) => {
  const { t } = useTranslation();
  const [timers, setTimers] = useState([]);
  const [currentTimeWithSeconds, setCurrentTimeWithSeconds] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentTime) return;

    setIsLoading(true);
    const now = new Date();
    const seconds = now.getSeconds();
    setCurrentTimeWithSeconds(
      `${currentTime}:${seconds.toString().padStart(2, '0')}`,
    );

    const interval = setInterval(() => {
      const now = new Date();
      const seconds = now.getSeconds();
      setCurrentTimeWithSeconds(
        `${currentTime}:${seconds.toString().padStart(2, '0')}`,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTime]);

  useEffect(() => {
    if (!marketData || !selectedMarket || !currentTimeWithSeconds) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);
    const marketTimes = marketData.filter(
      time => time.market.toLowerCase() === selectedMarket.toLowerCase(),
    );

    // Check if selected date is today
    const today = new Date();
    const isToday = format(selectedDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

    const timerObjects = marketTimes
      .map(time => {
        const [hours, minutes] = time.end_time.split(':').map(Number);
        const [currentHours, currentMinutes, currentSeconds] =
          currentTimeWithSeconds.split(':').map(Number);

        let timeDiffInSeconds;
        let isMarketClosed;

        if (isToday) {
          // For today, calculate time difference from current time
          const endTimeInSeconds = hours * 3600 + minutes * 60;
          const currentTimeInSeconds =
            currentHours * 3600 + currentMinutes * 60 + currentSeconds;
          timeDiffInSeconds = endTimeInSeconds - currentTimeInSeconds;
          isMarketClosed = timeDiffInSeconds < 0 && currentHours < 24;
        } else {
          // For future dates, calculate time difference from start of day
          const endTimeInSeconds = hours * 3600 + minutes * 60;
          timeDiffInSeconds = endTimeInSeconds;
          isMarketClosed = false;
        }

        if (timeDiffInSeconds < 0) {
          timeDiffInSeconds += 24 * 3600;
        }

        const hoursLeft = Math.floor(timeDiffInSeconds / 3600);
        const minutesLeft = Math.floor((timeDiffInSeconds % 3600) / 60);
        const secondsLeft = timeDiffInSeconds % 60;

        return {
          type: time.type,
          timeLeft: {
            hours: hoursLeft,
            minutes: minutesLeft,
            seconds: secondsLeft,
          },
          endTime: time.end_time,
          isClosed: isMarketClosed,
          isFutureDate: !isToday,
        };
      })
      .filter(timer => timer !== null);

    timerObjects.sort((a, b) => {
      const aTotalSeconds =
        a.timeLeft.hours * 3600 + a.timeLeft.minutes * 60 + a.timeLeft.seconds;
      const bTotalSeconds =
        b.timeLeft.hours * 3600 + b.timeLeft.minutes * 60 + b.timeLeft.seconds;
      return aTotalSeconds - bTotalSeconds;
    });

    setTimers(timerObjects);
  }, [marketData, selectedMarket, currentTimeWithSeconds, selectedDate]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={globalColors.blue} />
      </View>
    );
  }

  if (!timers.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.timersRow}>
        {timers.map((timer, index) => (
          <LinearGradient
            key={index}
            colors={timer.type === 'open' ? ['#2193b0', '#6dd5ed'] : ['#FF416C', '#FF4B2B']}
            style={[styles.timerCard, index === 0 ? styles.rightBorder : null]}
          >
            <View style={styles.contentContainer}>
              <Text style={styles.marketType}>
                {timer.type === 'open' ? t('openMarket') : t('closeMarket')}
              </Text>
              <View style={styles.timeContainer}>
                {timer.isClosed ? (
                  <Text style={styles.closedText}>{t('marketClosed')}</Text>
                ) : (
                  <View style={styles.timeRow}>
                    <View style={styles.timeBlock}>
                      <Text style={styles.timeValue}>
                        {timer.timeLeft.hours.toString().padStart(2, '0')}
                      </Text>
                      <Text style={styles.timeLabel}>{t('hours')}</Text>
                    </View>
                    <Text style={styles.timeSeparator}>:</Text>
                    <View style={styles.timeBlock}>
                      <Text style={styles.timeValue}>
                        {timer.timeLeft.minutes.toString().padStart(2, '0')}
                      </Text>
                      <Text style={styles.timeLabel}>{t('minutes')}</Text>
                    </View>
                    <Text style={styles.timeSeparator}>:</Text>
                    <View style={styles.timeBlock}>
                      <Text style={styles.timeValue}>
                        {timer.timeLeft.seconds.toString().padStart(2, '0')}
                      </Text>
                      <Text style={styles.timeLabel}>{t('seconds')}</Text>
                    </View>
                  </View>
                )}
              </View>
              {timer.isFutureDate && (
                <Text style={styles.futureDateText}>
                  {format(selectedDate, 'dd MMM yyyy')}
                </Text>
              )}
            </View>
          </LinearGradient>
        ))}
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 8,
  },
  loadingContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timersRow: {
    flexDirection: 'row',
    gap: 4,
  },
  timerCard: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 6,
  },
  marketType: {
    fontSize: 8,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  timeContainer: {
    marginVertical: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  timeBlock: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 22,
  },
  timeValue: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  timeLabel: {
    fontSize: 5,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.3,
  },
  timeSeparator: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginHorizontal: 2,
  },
  closedText: {
    fontSize: 8,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  futureDateText: {
    fontSize: 6,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 2,
  },
});

export default MarketCountdown;
