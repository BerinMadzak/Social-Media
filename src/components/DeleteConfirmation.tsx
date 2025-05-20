interface Props {
  isOpen: boolean;
  isPost: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmation({ isOpen, isPost, onCancel, onConfirm }: Props) {
  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-120 p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Are you sure you want to delete this {isPost ? "post" : "comment"}?</h3>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
