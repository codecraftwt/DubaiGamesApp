import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { globalColors } from '../../Theme/globalColors';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { format } from 'date-fns';

const MarketCountdown = ({ marketData, selectedMarket, currentTime, selectedDate, compact = false, rotateMarkets = false, alternateOpenClose = false }) => {
  const { t } = useTranslation();
  const [timers, setTimers] = useState([]);
  const [currentTimeWithSeconds, setCurrentTimeWithSeconds] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [markets, setMarkets] = useState([]);
  const [currentMarketIndex, setCurrentMarketIndex] = useState(0);
  const [showOpen, setShowOpen] = useState(true);

  useEffect(() => {
    if (!currentTime) return;

    const updateCurrentTime = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      setCurrentTimeWithSeconds(`${currentTime}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, [currentTime]);

  useEffect(() => {
    if (marketData && Array.isArray(marketData)) {
      const uniqueMarkets = Array.from(new Set(marketData.map(m => (m.market || '').toLowerCase())));
      setMarkets(uniqueMarkets);
      // initialize current market
      if (uniqueMarkets.length > 0) {
        const initialIndex = selectedMarket ? Math.max(0, uniqueMarkets.indexOf(selectedMarket.toLowerCase())) : 0;
        setCurrentMarketIndex(initialIndex === -1 ? 0 : initialIndex);
      }
    }
  }, [marketData, selectedMarket]);

  useEffect(() => {
    if (!rotateMarkets || markets.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentMarketIndex(prev => (prev + 1) % markets.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [rotateMarkets, markets]);

  useEffect(() => {
    if (!alternateOpenClose) return;
    const interval = setInterval(() => {
      setShowOpen(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, [alternateOpenClose]);

  useEffect(() => {
    if (!marketData || !selectedMarket || !currentTimeWithSeconds) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    const effectiveMarket = rotateMarkets && markets.length > 0 ? markets[currentMarketIndex] : selectedMarket?.toLowerCase();
    const marketTimes = marketData.filter(
      time => time.market.toLowerCase() === effectiveMarket
    );

    const today = new Date();
    const isToday = format(selectedDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

    const timerObjects = marketTimes.map(time => {
      const [hours, minutes] = time.end_time.split(':').map(Number);
      const [currentHours, currentMinutes, currentSeconds] = currentTimeWithSeconds.split(':').map(Number);

      let timeDiffInSeconds;
      let isMarketClosed;

      if (isToday) {
        const endTimeInSeconds = hours * 3600 + minutes * 60;
        const currentTimeInSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
        timeDiffInSeconds = endTimeInSeconds - currentTimeInSeconds;
        isMarketClosed = timeDiffInSeconds < 0 && currentHours < 24;
      } else {
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
        timeLeft: { hours: hoursLeft, minutes: minutesLeft, seconds: secondsLeft },
        endTime: time.end_time,
        isClosed: isMarketClosed,
        isFutureDate: !isToday,
      };
    });

    timerObjects.sort((a, b) => {
      const aSeconds = a.timeLeft.hours * 3600 + a.timeLeft.minutes * 60 + a.timeLeft.seconds;
      const bSeconds = b.timeLeft.hours * 3600 + b.timeLeft.minutes * 60 + b.timeLeft.seconds;
      return aSeconds - bSeconds;
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

  const listToRender = (() => {
    if (alternateOpenClose) {
      const desiredType = showOpen ? 'open' : 'close';
      const found = timers.find(t => t.type === desiredType);
      return found ? [found] : [];
    }
    return compact ? timers.slice(0, 1) : timers.slice(0, 2);
  })();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {listToRender.map((timer, index) => (
          <LinearGradient
            key={index}
            colors={
              timer.type === 'open'
                ? ['#1e3c72', '#2a5298']
                : ['#93291e', '#ed213a']
            }
            style={[
              styles.card,
              (alternateOpenClose || compact) ? styles.cardFull : (index === 0 ? styles.cardLeft : styles.cardRight),
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={styles.marketType}>
                {timer.type === 'open' ? t('openMarket') : t('closeMarket')}
              </Text>

              {timer.isClosed ? (
                <Text style={styles.closedText}>{t('marketClosed')}</Text>
              ) : (
                <View style={styles.timeRow}>
                  {['hours', 'minutes', 'seconds'].map((unit) => (
                    <View key={unit} style={styles.timeBlock}>
                      <Text style={styles.timeValue}>
                        {timer.timeLeft[unit].toString().padStart(2, '0')}
                      </Text>
                      <Text style={styles.timeLabel}>{t(unit)}</Text>
                    </View>
                  ))}
                </View>
              )}

              {timer.isFutureDate && (
                <Text style={styles.futureText}>
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
const CARD_WIDTH = (width - 32 - 12) / 2; // 32px margin + 12px spacing

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    // paddingVertical: 0,
  },
  loadingContainer: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardFull: {
    width: '100%',
  },
  cardLeft: {
    alignSelf: 'flex-start',
  },
  cardRight: {
    alignSelf: 'flex-end',
  },
  cardContent: {
    padding: 5,
    alignItems: 'center',
  },
  marketType: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    // marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  timeBlock: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    // paddingVertical: 4,
    alignItems: 'center',
    // minWidth: 40,
  },
  timeValue: {
    fontSize: 10,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  timeLabel: {
    fontSize: 10,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  closedText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 6,
    textAlign: 'center',
  },
  futureText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    // marginTop: 8,
  },
});

export default MarketCountdown;
