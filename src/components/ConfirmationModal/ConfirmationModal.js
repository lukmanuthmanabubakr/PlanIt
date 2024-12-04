import React from "react";
import "./ConfirmationModal.css";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="confirmModal">
      <div className="modal-box">
        <h2 className="modal-title">Confirmation</h2>
        <p className="modal-message">{message || "Are you sure you want to proceed?"}</p>
        <div className="modal-actions">
          <button className="button confirm-btn" onClick={onConfirm}>
            Yes, Confirm
          </button>
          <button className="button cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
