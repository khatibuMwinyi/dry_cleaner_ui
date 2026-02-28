import { FileQuestion } from "lucide-react";

const EmptyState = ({ message = "No data found" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-500">
      <FileQuestion className="w-12 h-12 mb-2 opacity-50" />
      <span>{message}</span>
    </div>
  );
};

export default EmptyState;
