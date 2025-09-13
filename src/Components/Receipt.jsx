import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Receipt = () => {
  const location = useLocation();

  // Extract appointmentId from the URL path
  const pathParts = location.pathname.split('/');
  const appointmentId = pathParts[pathParts.length - 1];
  console.log("id-->", appointmentId);

  const downloadReceipt = async () => {
    try {
      if (!appointmentId) {
        alert('No appointment information found');
        return;
      }

      const token = sessionStorage.getItem('token') || localStorage.getItem('token');

      const response = await axios.get(
        `http://localhost:4000/api/generate-receipt/${appointmentId}`,
        {
          headers: { token },
          responseType: 'blob',
          validateStatus: (status) => status < 500, // handle 4xx as normal
        }
      );

      const contentType = response.headers['content-type'];

      if (contentType && contentType.includes('application/pdf')) {
        // ✅ Download PDF
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = `pawderma-receipt-${appointmentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // ❌ Not a PDF → read as text
        const text = await response.data.text();
        alert(`Error: ${text}`);
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Failed to download receipt. Please try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow-lg p-5 w-75 receipt-card">
        <div className="text-center">
          <i className="bi bi-check-circle-fill text-success display-1"></i>
          <h3 className="mt-3">Payment Successful</h3>
          <p className="text-muted">Your booking has been confirmed successfully.</p>
          <p className="text-muted">Appointment ID: {appointmentId}</p>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button
            className="btn btn-outline-danger download-btn"
            onClick={downloadReceipt}
          >
            <i className="bi bi-download me-2"></i>Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
