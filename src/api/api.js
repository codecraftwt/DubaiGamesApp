import api from '../utils/Api';

export const getChartData = async (token) => {
  try {
    const response = await api.get('/results-till-yesterday', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const json = response.data;

    return {
      items: json.result ?? [],
      excludedFrom: json.date_filter?.excluded_from ?? null,
    };
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};
