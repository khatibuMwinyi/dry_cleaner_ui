import { formatCurrency } from "../../utils/formatNumber";

const TopCustomers = ({ data }) => {
  return (
    <div className="bg-[#F8F8F9] p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Top Customers</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-12">#</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Phone
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Total Spent
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                Invoices
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((customer, index) => (
              <tr key={customer.customerId}>
                <td className="px-4 py-2 text-center text-sm text-gray-500">{index + 1}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {customer.customerName}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {customer.customerPhone}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(customer.totalSpent)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                  {customer.invoiceCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopCustomers;
