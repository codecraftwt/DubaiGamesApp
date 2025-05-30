// utils/marketTime.js
import { parse, format } from 'date-fns';

export const getMarketTimeStatus = (marketData, selectedMarket) => {
    if (!marketData || marketData.length === 0) return null;

    const market = marketData.find(m => m.market.toLowerCase() === selectedMarket.toLowerCase());
    if (!market) return null;

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const startTime = new Date(`${today}T${market.start_time}`);
    const endTime = new Date(`${today}T${market.end_time}`);

    let timeRemaining = '';
    let isActive = false;
    let isMarketOpen = false;

    if (now < startTime) {
        // Market hasn't started yet
        const diffMs = startTime - now;
        timeRemaining = formatTime(diffMs);
        isMarketOpen = false;
    } else if (now < endTime) {
        // Market is active
        const diffMs = endTime - now;
        timeRemaining = formatTime(diffMs);
        isActive = true;
        isMarketOpen = true;
    } else {
        // Market has closed
        timeRemaining = 'Closed';
        isMarketOpen = false;
    }

    return {
        timeRemaining,
        isActive,
        isMarketOpen,
        startTime: market.start_time,
        endTime: market.end_time
    };
};

const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
};

// Function for check time is exceed or not
export const isTimeExceeded = (endTime, currentTime) => {
  if (!endTime) return false;

  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const [currentHours, currentMinutes] = currentTime.split(':').map(Number);

  if (currentHours > endHours) return true;
  if (currentHours === endHours && currentMinutes > endMinutes) return true;

  return false;
};


export const convertTo12HourFormat = (timeStr) => {
    const parsedTime = parse(timeStr, 'HH:mm', new Date());
    return format(parsedTime, 'h:mm a').toLowerCase();
};