import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

export default function EditConfirmation({ isOpen, onClose, onConfirm, itemName = 'this item' }) {
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (confirmText !== 'EDIT THIS POST') {
      setError('Please type "EDIT THIS POST" to confirm editing.');
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
      title="Confirm Edit"
      confirmText={confirmText}
      setConfirmText={setConfirmText}
      confirmationText="Type 'EDIT THIS POST' to confirm"
      confirmButtonText="Edit"
      confirmButtonVariant="primary"
      error={error}
    >
      <p className="mb-4">Are you sure you want to edit {itemName}?</p>
    </ConfirmationModal>
  );
}
