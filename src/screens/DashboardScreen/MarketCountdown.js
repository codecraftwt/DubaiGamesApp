import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MarketCountdown = ({ marketData, selectedMarket, isMarketOpen, setIsMarketOpen }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState(null);
  // const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [currentMarket, setCurrentMarket] = useState(null);

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (marketData && marketData.length > 0 && selectedMarket) {
      // Find the market that matches the selected market name
      const market = marketData.find(m =>
        m.market.toLowerCase() === selectedMarket.toLowerCase()
      );

      if (market) {
        setCurrentMarket(market);

        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentSeconds = now.getSeconds();

        // Convert current time to seconds since midnight for easier comparison
        const currentTimeInSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

        const [startHour, startMinute] = market.start_time.split(':').map(Number);
        const [endHour, endMinute] = market.end_time.split(':').map(Number);

        const startTimeInSeconds = startHour * 3600 + startMinute * 60;
        const endTimeInSeconds = endHour * 3600 + endMinute * 60;

        if (currentTimeInSeconds >= startTimeInSeconds && currentTimeInSeconds <= endTimeInSeconds) {
          // Market is open
          setIsMarketOpen(true);

          // Calculate remaining time
          const remainingSeconds = endTimeInSeconds - currentTimeInSeconds;
          const hours = Math.floor(remainingSeconds / 3600);
          const minutes = Math.floor((remainingSeconds % 3600) / 60);
          const seconds = remainingSeconds % 60;

          setTimeLeft({
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0')
          });
          return;
        }
      }

      // If market is not open
      setIsMarketOpen(false);
      setTimeLeft(null);
    }
  }, [currentTime, marketData, selectedMarket]);

  if (!currentMarket) {
    return null; // Don't render anything if no market data
  }

  return (
    <View style={styles.container}>
      {isMarketOpen && timeLeft ? (
        <>
          <Text style={styles.marketOpenText}>{currentMarket.market} Market is OPEN</Text>
          <Text style={styles.countdownText}>
            Time Remaining: {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
          </Text>
        </>
      ) : (
        <Text style={styles.marketClosedText}>{currentMarket.market} Market is CLOSED</Text>
      )}
      <Text style={styles.timingText}>
        Market Timing: {currentMarket.start_time} - {currentMarket.end_time}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  marketOpenText: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  marketClosedText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  countdownText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#343a40',
  },
  timingText: {
    fontSize: 14,
    color: '#6c757d',
  },
});

export default MarketCountdown;