import { CheckCircle, XCircle, Clock, Package, Circle } from "lucide-react";

const StatusBadge = ({ status, type = 'payment' }) => {
  const getStatusConfig = () => {
    if (type === 'payment') {
      switch (status?.toUpperCase()) {
        case 'PAID':
          return { bg: 'bg-green-100', text: 'text-green-800', icon: 'check', label: 'Paid' };
        case 'UNPAID':
          return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'x', label: 'Pending' };
        default:
          return { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'x', label: status || 'Unknown' };
      }
    }
    
    if (type === 'job') {
      switch (status?.toLowerCase()) {
        case 'waiting':
          return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'clock', label: 'Waiting' };
        case 'received':
          return { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'package', label: 'Received' };
        case 'complete':
          return { bg: 'bg-purple-100', text: 'text-purple-800', icon: 'check', label: 'Complete' };
        case 'success':
          return { bg: 'bg-green-100', text: 'text-green-800', icon: 'check', label: 'Success' };
        case 'denied-admin':
        case 'denied-cleaner':
          return { bg: 'bg-red-100', text: 'text-red-800', icon: 'x', label: 'Denied' };
        default:
          return { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'clock', label: status || 'Unknown' };
      }
    }

    return { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'circle', label: status || 'Unknown' };
  };

  const config = getStatusConfig();

  const getIcon = () => {
    switch (config.icon) {
      case 'check':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'x':
        return <XCircle className="w-4 h-4 mr-1" />;
      case 'clock':
        return <Clock className="w-4 h-4 mr-1" />;
      case 'package':
        return <Package className="w-4 h-4 mr-1" />;
      default:
        return <Circle className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {getIcon()}
      {config.label}
    </span>
  );
};

export default StatusBadge;
