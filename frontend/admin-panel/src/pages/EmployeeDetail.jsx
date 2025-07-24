// frontend/admin-panel/src/pages/EmployeeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import EmployeeDetailModal from '../components/EmployeeDetailModal';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();              // ← grab passed state

  const initialEmployee = state?.employee || null;

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <EmployeeDetailModal
      empId={id}
      onClose={handleClose}
      initialData={initialEmployee}             // ← hand it off
    />
  );
}
