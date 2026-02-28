import { Eye, Pencil, Trash2 } from "lucide-react";

const ActionButtons = ({ 
  onView, 
  onEdit, 
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true
}) => {
  return (
    <div className="flex justify-center gap-2">
      {showView && onView && (
        <button
          onClick={onView}
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
      {showEdit && onEdit && (
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          title="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}
      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
