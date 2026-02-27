import { useState } from "react";
import { toast } from "react-toastify";
import { Calendar, Download, Loader2, FileText } from "lucide-react";
import {
  generateMonthlyReport,
  generateWeeklyReport,
  generateDailyReport,
} from "../api/reportApi";

const Reports = () => {
  const [reportType, setReportType] = useState("monthly");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const today = new Date();
  const maxDate = today.toISOString().slice(0, 7);

  const getDefaultDate = () => {
    const defaultDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return defaultDate.toISOString().slice(0, 7);
  };

  const handleGenerateReport = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    setIsGenerating(true);
    try {
      const date = new Date(selectedDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      if (reportType === "monthly") {
        await generateMonthlyReport(year, month);
        toast.success("Monthly report generated and downloaded successfully!");
      } else if (reportType === "weekly") {
        await generateWeeklyReport(year, month, selectedWeek);
        toast.success(
          `Week ${selectedWeek} report generated and downloaded successfully!`,
        );
      } else if (reportType === "daily") {
        const day = parseInt(selectedDate.split("-")[2]);
        await generateDailyReport(year, month, day);
        toast.success("Daily report generated and downloaded successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const getDaysInMonth = () => {
    if (!selectedDate) return 31;
    const date = new Date(selectedDate);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const reportTypes = [
    { id: "monthly", label: "Monthly" },
    { id: "weekly", label: "Weekly" },
    { id: "daily", label: "Daily" },
  ];

  const weeks = [
    { value: 1, label: "Week 1 (1-7)" },
    { value: 2, label: "Week 2 (8-14)" },
    { value: 3, label: "Week 3 (15-21)" },
    { value: 4, label: "Week 4 (22-End)" },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Reports
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Generate and download financial reports
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 max-w-2xl">
        <div className="mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            Financial Report Generator
          </h2>
          <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
            Generate a comprehensive PDF report showing detailed breakdown of
            revenue and expenses.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <div className="flex flex-wrap gap-2">
                {reportTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      reportType === type.id
                        ? "bg-[#2D3A58] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {reportType === "monthly" && (
              <div>
                <label
                  htmlFor="month-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
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
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Select the month you want to generate the report for.
                </p>
              </div>
            )}

            {reportType === "weekly" && (
              <>
                <div>
                  <label
                    htmlFor="week-month-select"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Month
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="month"
                      id="week-month-select"
                      value={selectedDate || getDefaultDate()}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      max={maxDate}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="week-select"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Week
                  </label>
                  <select
                    id="week-select"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {weeks.map((week) => (
                      <option key={week.value} value={week.value}>
                        {week.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Week 4 covers days 22 to end of month.
                  </p>
                </div>
              </>
            )}

            {reportType === "daily" && (
              <div>
                <label
                  htmlFor="day-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="day-select"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={today.toISOString().split("T")[0]}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Select a specific date to generate a daily report.
                </p>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating || !selectedDate}
                className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isGenerating || !selectedDate
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#2D3A58] hover:bg-[#0F172A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                    Generate{" "}
                    {reportType.charAt(0).toUpperCase() +
                      reportType.slice(1)}{" "}
                    Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
