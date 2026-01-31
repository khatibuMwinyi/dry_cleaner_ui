import { DollarSign, TrendingUp, TrendingDown, Users } from "lucide-react";
import { formatCurrency } from "../../utils/formatNumber";

const FinancialSummary = ({ data }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-[#F8F8F9] p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-[#0F172A] mt-1">
              {formatCurrency(data?.revenue?.total || 0)}
            </p>
          </div>
          <DollarSign className="w-5 h-10 text-green-500" />
        </div>
      </div>

      <div className="bg-[#F8F8F9] p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-[#0F172A] mt-1">
              {formatCurrency(data?.expenses?.total || 0)}
            </p>
          </div>
          <TrendingDown className="w-5 h-10 text-red-500" />
        </div>
      </div>

      <div className="bg-[#F8F8F9] p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Net Profit</p>
            <p className="text-2xl font-bold text-[#0F172A] mt-1">
              {formatCurrency(data?.profit || 0)}
            </p>
          </div>
          <TrendingUp className="w-5 h-10 text-blue-500" />
        </div>
      </div>

      <div className="bg-[#F8F8F9] p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Profit Margin</p>
            <p className="text-2xl font-bold text-[#0F172A] mt-1">
              {data?.profitMargin || "0"}%
            </p>
          </div>
          <Users className="w-5 h-10 text-purple-500" />
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
