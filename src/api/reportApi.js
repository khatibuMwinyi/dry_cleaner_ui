import api from './api';

export const generateMonthlyReport = async (year, month) => {
  try {
    const response = await api.post('/analytics/reports/monthly-pdf/download', {
      year,
      month
    }, {
      responseType: 'blob' // Important for file downloads
    });

    // Create download link
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Generate filename
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
    link.href = url;
    link.download = `Monthly-Report-${monthName}-${year}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return response;
  } catch (error) {
    // Handle blob response errors
    if (error.response?.data instanceof Blob) {
      const errorText = await error.response.data.text();
      const errorObj = JSON.parse(errorText);
      throw { response: { data: errorObj } };
    }
    throw error;
  }
};

export const getMonthlyReportData = async (year, month) => {
  const response = await api.post('/analytics/reports/monthly-pdf', {
    year,
    month
  });
  
  return response.data;
};

export const generateWeeklyReport = async (year, month, weekNumber) => {
  try {
    const response = await api.post('/analytics/reports/weekly-pdf/download', {
      year,
      month,
      weekNumber
    }, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
    link.href = url;
    link.download = `Weekly-Report-${monthName}-${year}-Week${weekNumber}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return response;
  } catch (error) {
    if (error.response?.data instanceof Blob) {
      const errorText = await error.response.data.text();
      const errorObj = JSON.parse(errorText);
      throw { response: { data: errorObj } };
    }
    throw error;
  }
};

export const getWeeklyReportData = async (year, month, weekNumber) => {
  const response = await api.post('/analytics/reports/weekly-pdf', {
    year,
    month,
    weekNumber
  });
  
  return response.data;
};

export const generateDailyReport = async (year, month, day) => {
  try {
    const response = await api.post('/analytics/reports/daily-pdf/download', {
      year,
      month,
      day
    }, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const dateStr = new Date(year, month - 1, day).toLocaleString('default', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).replace(/[\s,]/g, '-');
    link.href = url;
    link.download = `Daily-Report-${dateStr}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return response;
  } catch (error) {
    if (error.response?.data instanceof Blob) {
      const errorText = await error.response.data.text();
      const errorObj = JSON.parse(errorText);
      throw { response: { data: errorObj } };
    }
    throw error;
  }
};

export const getDailyReportData = async (year, month, day) => {
  const response = await api.post('/analytics/reports/daily-pdf', {
    year,
    month,
    day
  });
  
  return response.data;
};