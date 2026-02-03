import { useState } from 'react';
import { toast } from 'react-toastify';
import { Calendar, Download, Loader2 } from 'lucide-react';
import { generateMonthlyReport } from '../api/reportApi';

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!selectedDate) {
      toast.error('Please select a month and year');
      return;
    }

    setIsGenerating(true);
    try {
      const date = new Date(selectedDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // JavaScript months are 0-based

      await generateMonthlyReport(year, month);
      toast.success('Monthly report generated and downloaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  // Get current date for max attribute (can't select future months)
  const today = new Date();
  const maxDate = today.toISOString().slice(0, 7); // YYYY-MM format

  // Set default to previous month
  const getDefaultDate = () => {
    const defaultDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return defaultDate.toISOString().slice(0, 7);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">Generate and download monthly financial reports</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Monthly Revenue vs Expenses Report
          </h2>
          <p className="text-gray-600 mb-6">
            Generate a comprehensive PDF report showing detailed breakdown of revenue and expenses for a specific month.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Month
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="month"
                  id="month-select"
                  value={selectedDate || getDefaultDate()}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={maxDate}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Select month and year"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Select the month you want to generate the report for.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating || !selectedDate}
                className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isGenerating || !selectedDate
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                } transition-colors duration-200`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Download className="-ml-1 mr-3 h-5 w-5" />
                    Generate Monthly Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Report Contents</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Total revenue and expenses summary
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Revenue breakdown by customer
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Expense breakdown by category
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Visual charts and graphs
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Detailed invoice and expense listings
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Profit/loss analysis and margins
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;