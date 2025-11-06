import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

export default function DeleteConfirmation({ isOpen, onClose, onConfirm, itemName = 'this item' }) {
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (confirmText !== 'DELETE THIS POST') {
      setError('Please type "DELETE THIS POST" to confirm deletion.');
      return;
    }
    onConfirm();
    setConfirmText('');
    setError('');
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={() => {
        setConfirmText('');
        setError('');
        onClose();
      }}
      onConfirm={handleConfirm}
      title="Confirm Deletion"
      confirmText={confirmText}
      setConfirmText={setConfirmText}
      confirmationText="Type 'DELETE THIS POST' to confirm"
      confirmButtonText="Delete"
      confirmButtonVariant="danger"
      error={error}
    >
      <p className="mb-4">Are you sure you want to delete {itemName}? This action cannot be undone.</p>
    </ConfirmationModal>
  );
}
