import Loader from "./Loader";
import EmptyState from "./EmptyState";

const TableContainer = ({ 
  loading, 
  data = [], 
  emptyMessage = "No data found",
  children,
  maxHeight = "calc(100vh - 320px)"
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-y-auto" style={{ maxHeight }}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        ) : data.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            {children}
          </table>
        )}
      </div>
    </div>
  );
};

export default TableContainer;
