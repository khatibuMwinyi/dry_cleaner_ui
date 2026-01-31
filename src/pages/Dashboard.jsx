import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { toast } from "react-toastify";
import { analyticsAPI } from "../api/api";
import Loader from "../components/Loader";
import FinancialSummary from "../components/Dashboard/FinancialSummary";

const Charts = lazy(() => import("../components/Dashboard/Charts"));
const TopCustomers = lazy(() =>
  import("../components/Dashboard/TopCustomers")
);

const Dashboard = () => {
  const [financialData, setFinancialData] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const financial = await analyticsAPI.getFinancial({ period: "year" });
        setFinancialData(financial.data);
      } catch (error) {
        console.error("Error fetching financial data:", error);
        toast.error("Failed to load financial data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const [daily, monthly, topCust] = await Promise.all([
          analyticsAPI.getDaily(),
          analyticsAPI.getMonthly(),
          analyticsAPI.getTopCustomers(5),
        ]);

        setDailyData(daily.data);
        setMonthlyData(monthly.data);
        setTopCustomers(topCust.data);
      } catch (error) {
        console.error("Error fetching additional dashboard data:", error);
        toast.error("Failed to load some dashboard components.");
      }
    };

    if (financialData) {
      fetchAdditionalData();
    }
  }, [financialData]);

  const formattedDailyData = useMemo(() => {
    return dailyData.map((item) => {
      const date = new Date(item.date);
      const monthName = date.toLocaleString("default", { month: "short" });
      const dayNumber = date.getDate();
      return {
        ...item,
        dayLabel: `${dayNumber} ${monthName}`,
        monthLabel: date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
      };
    });
  }, [dailyData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 flex flex-col items-center justify-center">
          <Loader />
          Loading dashboard data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 bg-[#DDE1E8] -mx-8 -mt-8 px-8 pt-6 pb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-1">
          Financial analytics and business insights
        </p>
      </div>
      <hr className="w-full h-1 bg-gray-200" />

      <FinancialSummary data={financialData} />

      <Suspense fallback={<Loader />}>
        <Charts dailyData={formattedDailyData} monthlyData={monthlyData} />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <TopCustomers data={topCustomers} />
      </Suspense>
    </div>
  );
};

export default Dashboard;
