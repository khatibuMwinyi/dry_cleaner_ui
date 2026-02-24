import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { jobApi } from "../api/jobApi.js";
import { useAuth } from "../auth/AuthContext.jsx";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Play,
  Eye,
  X,
  Package,
  Check,
  AlertTriangle,
} from "lucide-react";
import Loader from "../components/Loader";

const JobTracking = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [clothCount, setClothCount] = useState("");
  const [denyReason, setDenyReason] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("success");
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isCleaner = user?.role === "CLEANER";

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobApi.getJobs();
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReceive = async () => {
    try {
      await jobApi.receiveJob(selectedJob._id, parseInt(clothCount) || 0);
      toast.success("Job marked as received!");
      setShowReceiveModal(false);
      setClothCount("");
      fetchJobs();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to receive job"
      );
    }
  };

  const handleExecute = async (jobId) => {
    try {
      await jobApi.executeJob(jobId);
      toast.success("Job executed successfully!");
      fetchJobs();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to execute job"
      );
    }
  };

  const handleVerify = async () => {
    try {
      await jobApi.verifyJob(selectedJob._id, verifyStatus, denyReason);
      toast.success(
        verifyStatus === "success"
          ? "Job verified successfully!"
          : "Job denied by admin!"
      );
      setShowVerifyModal(false);
      setDenyReason("");
      fetchJobs();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to verify job"
      );
    }
  };

  const handleDeny = async () => {
    try {
      await jobApi.denyJob(selectedJob._id, denyReason);
      toast.success("Job denied!");
      setShowDenyModal(false);
      setDenyReason("");
      fetchJobs();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to deny job"
      );
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      waiting: {
        label: "Waiting",
        class: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-4 h-4 mr-1" />,
      },
      received: {
        label: "Received",
        class: "bg-blue-100 text-blue-800",
        icon: <Package className="w-4 h-4 mr-1" />,
      },
      complete: {
        label: "Complete",
        class: "bg-purple-100 text-purple-800",
        icon: <CheckCircle className="w-4 h-4 mr-1" />,
      },
      success: {
        label: "Success",
        class: "bg-green-100 text-green-800",
        icon: <Check className="w-4 h-4 mr-1" />,
      },
      "denied-admin": {
        label: "Denied (Admin)",
        class: "bg-red-100 text-red-800",
        icon: <XCircle className="w-4 h-4 mr-1" />,
      },
      "denied-cleaner": {
        label: "Denied (Cleaner)",
        class: "bg-red-100 text-red-800",
        icon: <XCircle className="w-4 h-4 mr-1" />,
      },
    };

    const config = statusConfig[status] || statusConfig.waiting;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const openReceiveModal = (job) => {
    setSelectedJob(job);
    setClothCount(job.notedClothCount?.toString() || "");
    setShowReceiveModal(true);
  };

  const openVerifyModal = (job) => {
    setSelectedJob(job);
    setVerifyStatus("success");
    setDenyReason("");
    setShowVerifyModal(true);
  };

  const openDenyModal = (job) => {
    setSelectedJob(job);
    setDenyReason("");
    setShowDenyModal(true);
  };

  const getActions = (job) => {
    const actions = [];

    actions.push(
      <button
        key="view"
        onClick={() => {
          setSelectedJob(job);
          setShowViewModal(true);
        }}
        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
        title="View Details"
      >
        <Eye className="w-5 h-5" />
      </button>
    );

    if (isCleaner && job.status === "waiting") {
      actions.push(
        <button
          key="receive"
          onClick={() => openReceiveModal(job)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          title="Mark as Received"
        >
          <Package className="w-5 h-5" />
        </button>
      );
    }

    if (isCleaner && job.status === "received") {
      actions.push(
        <button
          key="execute"
          onClick={() => handleExecute(job._id)}
          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
          title="Execute (Complete)"
        >
          <Play className="w-5 h-5" />
        </button>
      );
    }

    if (isAdmin && job.status === "complete") {
      actions.push(
        <button
          key="verify"
          onClick={() => openVerifyModal(job)}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
          title="Verify"
        >
          <CheckCircle className="w-5 h-5" />
        </button>
      );
    }

    if ((isAdmin || isCleaner) && !["success", "denied-admin", "denied-cleaner"].includes(job.status)) {
      actions.push(
        <button
          key="deny"
          onClick={() => openDenyModal(job)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          title="Deny"
        >
          <XCircle className="w-5 h-5" />
        </button>
      );
    }

    return actions;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="sticky top-0 z-20 bg-[#DDE1E8] -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 pt-4 md:pt-6 pb-3 md:pb-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
            Job Tracking
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Track and manage cleaning jobs from start to finish
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="flex flex-col items-center">
              <Loader />
              <span className="mt-2">Loading...</span>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Submitted Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Cloth Count
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{job.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {job.customerName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {job.customerPhone || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {job.submittedDate
                      ? new Date(job.submittedDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {job.actualClothCount > 0
                      ? `${job.actualClothCount} (noted: ${job.notedClothCount})`
                      : job.notedClothCount || "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(job.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {getActions(job)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showReceiveModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Receive Job</h2>
              <button
                onClick={() => setShowReceiveModal(false)}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Invoice #{selectedJob.invoiceNumber} - {selectedJob.customerName}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Noted cloth count: {selectedJob.notedClothCount}
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Cloth Count *
              </label>
              <input
                type="number"
                min="0"
                value={clothCount}
                onChange={(e) => setClothCount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none border-b-2"
                placeholder="Enter actual cloth count"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReceive}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                Confirm Received
              </button>
              <button
                onClick={() => setShowReceiveModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showVerifyModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Verify Job</h2>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Invoice #{selectedJob.invoiceNumber} - {selectedJob.customerName}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Cloth count: {selectedJob.actualClothCount} (noted: {selectedJob.notedClothCount})
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Status *
              </label>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="verifyStatus"
                    value="success"
                    checked={verifyStatus === "success"}
                    onChange={(e) => setVerifyStatus(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-green-600 font-medium">Success</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="verifyStatus"
                    value="denied"
                    checked={verifyStatus === "denied"}
                    onChange={(e) => setVerifyStatus(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-red-600 font-medium">Deny</span>
                </label>
              </div>

              {verifyStatus === "denied" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for denial *
                  </label>
                  <textarea
                    value={denyReason}
                    onChange={(e) => setDenyReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none border-b-2"
                    rows="3"
                    placeholder="Enter reason for denial"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerify}
                className={`flex-1 py-2 rounded-lg ${
                  verifyStatus === "success"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {verifyStatus === "success" ? "Confirm Success" : "Deny Job"}
              </button>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDenyModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">
                {isAdmin ? "Deny as Admin" : "Deny as Cleaner"}
              </h2>
              <button
                onClick={() => setShowDenyModal(false)}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Invoice #{selectedJob.invoiceNumber} - {selectedJob.customerName}
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for denial *
              </label>
              <textarea
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none border-b-2"
                rows="3"
                placeholder="Enter reason for denial"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeny}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
              >
                Confirm Denial
              </button>
              <button
                onClick={() => setShowDenyModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Job Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Invoice Number</h3>
                  <p className="text-gray-900">#{selectedJob.invoiceNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <div className="mt-1">{getStatusBadge(selectedJob.status)}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Customer Name</h3>
                <p className="text-gray-900">{selectedJob.customerName}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="text-gray-900">{selectedJob.customerPhone || "-"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Submitted Date</h3>
                  <p className="text-gray-900">
                    {selectedJob.submittedDate
                      ? new Date(selectedJob.submittedDate).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Cloth Count</h3>
                  <p className="text-gray-900">
                    {selectedJob.actualClothCount > 0
                      ? `${selectedJob.actualClothCount} (noted: ${selectedJob.notedClothCount})`
                      : selectedJob.notedClothCount || "-"}
                  </p>
                </div>
              </div>

              {selectedJob.receivedDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Received Date</h3>
                  <p className="text-gray-900">
                    {new Date(selectedJob.receivedDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedJob.completedDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Completed Date</h3>
                  <p className="text-gray-900">
                    {new Date(selectedJob.completedDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedJob.verifiedDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Verified Date</h3>
                  <p className="text-gray-900">
                    {new Date(selectedJob.verifiedDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {["denied-admin", "denied-cleaner"].includes(selectedJob.status) && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <h3 className="text-sm font-medium text-red-600">Denied By</h3>
                      <p className="text-gray-900 capitalize">
                        {selectedJob.deniedBy || "-"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-red-600">Denial Reason</h3>
                      <p className="text-gray-900">{selectedJob.deniedReason || "-"}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function Clock({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default JobTracking;
