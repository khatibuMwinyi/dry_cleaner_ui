import { CheckCircle, XCircle, Eye, CreditCard, Send, Receipt } from "lucide-react";

const InvoiceTable = ({ 
  invoices, 
  onPreview, 
  onMarkPaid, 
  onSendWhatsapp, 
  onSendReceipt,
  showActions = true 
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-center text-xs font-bold uppercase w-12">#</th>
              <th className="px-4 py-2 text-left text-xs font-bold uppercase">
                Invoice #
              </th>
              <th className="px-4 py-2 text-left text-xs font-bold uppercase">
                Customer
              </th>
              <th className="px-4 py-2 text-left text-xs font-bold uppercase">
                Submitted
              </th>
              <th className="px-4 py-2 text-right text-xs font-bold uppercase">
                Total (TSh)
              </th>
              <th className="px-4 py-2 text-center text-xs font-bold uppercase">
                Status
              </th>
              {showActions && (
                <th className="px-4 py-2 text-center text-xs font-bold uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice, index) => (
              <tr key={invoice._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-center text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-4 py-2 text-gray-900">
                  {invoice.invoiceNumber || `#${invoice._id.slice(-6)}`}
                </td>
                <td className="px-4 py-2 text-gray-900">
                  {invoice.customerId?.name || "N/A"}
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {invoice.createdAt
                    ? new Date(invoice.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-2 text-right">
                  {invoice.total?.toLocaleString() || 0}
                </td>
                <td className="px-4 py-2 text-center">
                  {invoice.paymentStatus === "PAID" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" /> Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                      <XCircle className="w-3 h-3 mr-1" /> Pending
                    </span>
                  )}
                </td>
                {showActions && (
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onPreview(invoice)}
                        className="p-1 text-gray-700 hover:bg-gray-100 rounded-lg"
                        title="Preview Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {invoice.paymentStatus === "PAID" ? (
                        <button
                          onClick={() => onSendReceipt(invoice._id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Send Receipt via WhatsApp"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => onMarkPaid(invoice._id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Mark as Paid"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onSendWhatsapp(invoice._id)}
                            className="p-1 text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="Send Invoice via WhatsApp"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;
