import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {globalColors} from '../../Theme/globalColors';
import {convertTo12HourFormat} from '../../utils/marketTime';

const MarketCountdown = ({marketData, selectedMarket, currentTime}) => {
  const [timers, setTimers] = useState([]);
  const [currentTimeWithSeconds, setCurrentTimeWithSeconds] = useState('');

  useEffect(() => {
    if (!currentTime) return;

    // Initialize with current time and seconds
    const now = new Date();
    const seconds = now.getSeconds();
    setCurrentTimeWithSeconds(
      `${currentTime}:${seconds.toString().padStart(2, '0')}`,
    );

    // Update seconds every second
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
    if (!marketData || !selectedMarket || !currentTimeWithSeconds) return;

    // Filter market times for the selected market
    const marketTimes = marketData.filter(
      time => time.market.toLowerCase() === selectedMarket.toLowerCase(),
    );

    // Calculate time differences and create timer objects
    const timerObjects = marketTimes
      .map(time => {
        const [hours, minutes] = time.end_time.split(':').map(Number);
        const [currentHours, currentMinutes, currentSeconds] =
          currentTimeWithSeconds.split(':').map(Number);

        // Convert to total seconds for more precise calculation
        const endTimeInSeconds = hours * 3600 + minutes * 60;
        const currentTimeInSeconds =
          currentHours * 3600 + currentMinutes * 60 + currentSeconds;

        // Calculate time difference
        let timeDiffInSeconds = endTimeInSeconds - currentTimeInSeconds;

        // Check if market is closed for today
        const isMarketClosed = timeDiffInSeconds < 0 && currentHours < 24;

        // Handle case where end time is on the next day
        if (timeDiffInSeconds < 0) {
          timeDiffInSeconds += 24 * 3600; // Add 24 hours in seconds
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
        };
      })
      .filter(timer => timer !== null); // Remove null timers (exceeded ones)

    // Sort timers by time left in ascending order
    timerObjects.sort((a, b) => {
      const aTotalSeconds =
        a.timeLeft.hours * 3600 + a.timeLeft.minutes * 60 + a.timeLeft.seconds;
      const bTotalSeconds =
        b.timeLeft.hours * 3600 + b.timeLeft.minutes * 60 + b.timeLeft.seconds;
      return aTotalSeconds - bTotalSeconds;
    });

    setTimers(timerObjects);
  }, [marketData, selectedMarket, currentTimeWithSeconds]);

  if (!timers.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Market Times</Text>
      {timers.map((timer, index) => (
        <View key={index} style={styles.timerContainer}>
          <Text style={styles.timerType}>
            {timer.type === 'open' ? 'Open Market' : 'Close Market'}
          </Text>
          {timer.isClosed ? (
            <View style={styles.closedContainer}>
              <Text style={styles.closedText}>Market Closed</Text>
              <Text style={styles.nextDayText}>Will open tomorrow</Text>
            </View>
          ) : (
            <>
              <View style={styles.timeContainer}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeValue}>
                    {timer.timeLeft.hours.toString().padStart(2, '0')}
                  </Text>
                  <Text style={styles.timeLabel}>Hours</Text>
                </View>
                <Text style={styles.colon}>:</Text>
                <View style={styles.timeBox}>
                  <Text style={styles.timeValue}>
                    {timer.timeLeft.minutes.toString().padStart(2, '0')}
                  </Text>
                  <Text style={styles.timeLabel}>Minutes</Text>
                </View>
                <Text style={styles.colon}>:</Text>
                <View style={styles.timeBox}>
                  <Text style={styles.timeValue}>
                    {timer.timeLeft.seconds.toString().padStart(2, '0')}
                  </Text>
                  <Text style={styles.timeLabel}>Seconds</Text>
                </View>
              </View>
              <Text style={styles.endTime}>
                Ends at: {convertTo12HourFormat(timer.endTime)}
              </Text>
            </>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.white,
    padding: 16,
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: '#ddd',
    marginBlock: 10,
    marginBottom: 40,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: globalColors.darkBlue,
    marginBottom: 15,
    textAlign: 'center',
  },
  timerContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: globalColors.LightWhite,
    borderRadius: 8,
  },
  timerType: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-Bold',
    // alignSelf: 'center',
    color: globalColors.darkBlue,
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBox: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  timeValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: globalColors.primary,
  },
  timeLabel: {
    fontSize: 12,
    color: globalColors.grey,
    fontFamily: 'Poppins-Medium',
  },
  colon: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: globalColors.primary,
    marginHorizontal: 8,
    marginBottom: 20,
  },
  endTime: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: globalColors.grey,
    marginTop: 8,
    textAlign: 'center',
  },
  closedContainer: {
    alignItems: 'center',
    padding: 10,
  },
  closedText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: 'red',
    marginBottom: 5,
  },
  nextDayText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: globalColors.grey,
    textAlign: 'center',
  },
});

export default MarketCountdown;
