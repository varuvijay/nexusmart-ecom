import React from 'react';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`px-2 py-1 flex items-center justify-center rounded-full text-xs font-medium ${statusStyles[status.toLowerCase()] || "bg-gray-100"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;