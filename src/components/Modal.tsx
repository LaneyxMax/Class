interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        {children}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-pink-200 hover:bg-pink-300 transition-colors rounded-xl py-2"
        >
          关闭
        </button>
      </div>
    </div>
  );
}