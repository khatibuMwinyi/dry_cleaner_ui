import StatusBadge from "./StatusBadge";

const JobTable = ({ 
  jobs, 
  onView, 
  onReceive, 
  onExecute, 
  onVerify, 
  onDeny,
  onSendPickup,
  isClerk = false,
  isOperator = false 
}) => {
  const getStatusBadge = (status) => {
    return <StatusBadge status={status} type="job" />;
  };

  const renderActions = (job) => {
    const actions = [];

    actions.push(
      <button
        key="view"
        onClick={() => onView && onView(job)}
        className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        title="View Details"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
    );

    if (isOperator && job.status === "waiting") {
      actions.push(
        <button
          key="receive"
          onClick={() => onReceive && onReceive(job)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          title="Mark as Received"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </button>
      );
    }

    if (isOperator && job.status === "received") {
      actions.push(
        <button
          key="execute"
          onClick={() => onExecute && onExecute(job._id)}
          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
          title="Execute (Complete)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      );
    }

    if (isClerk && job.status === "complete") {
      actions.push(
        <button
          key="verify"
          onClick={() => onVerify && onVerify(job)}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
          title="Verify"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      );
    }

    if (isClerk && job.status === "success") {
      actions.push(
        <button
          key="notify"
          onClick={() => onSendPickup && onSendPickup(job._id)}
          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
          title="Send Pickup Notification"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      );
    }

    if ((isClerk || isOperator) && !["success", "denied-clerk", "denied-operator"].includes(job.status)) {
      actions.push(
        <button
          key="deny"
          onClick={() => onDeny && onDeny(job)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          title="Deny"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </button>
      );
    }

    return actions;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 380px)" }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-center text-xs font-bold uppercase w-12">#</th>
              <th className="px-4 py-2 text-left text-xs font-bold uppercase">Invoice #</th>
              <th className="px-4 py-2 text-left text-xs font-bold uppercase">Customer</th>
              <th className="px-4 py-2 text-left text-xs font-bold uppercase">Phone</th>
              <th className="px-4 py-2 text-left text-xs font-bold uppercase">Submitted</th>
              <th className="px-4 py-2 text-left text-xs font-bold uppercase">Cloth Count</th>
              <th className="px-4 py-2 text-center text-xs font-bold uppercase">Status</th>
              <th className="px-4 py-2 text-center text-xs font-bold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jobs.map((job, index) => (
              <tr key={job._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-center text-sm text-gray-500">{index + 1}</td>
                <td className="px-4 py-2 text-gray-900">#{job.invoiceNumber}</td>
                <td className="px-4 py-2 text-gray-900">{job.customerName}</td>
                <td className="px-4 py-2 text-gray-600">{job.customerPhone || "-"}</td>
                <td className="px-4 py-2 text-gray-600">
                  {job.submittedDate ? new Date(job.submittedDate).toLocaleDateString() : "-"}
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {job.actualClothCount || job.notedClothCount || "-"}
                </td>
                <td className="px-4 py-2 text-center">{getStatusBadge(job.status)}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">{renderActions(job)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobTable;
