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