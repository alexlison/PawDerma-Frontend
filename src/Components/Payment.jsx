import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [amount] = useState(250); // Fixed amount for general/skin
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const RAZORPAY_KEY = "rzp_test_RGywSXNw2dqMO2";

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    setProcessing(true);
    setError("");

    try {
      let token = sessionStorage.getItem("token") || localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing. Please log in again.");

      const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!sdkLoaded) throw new Error("Razorpay SDK failed to load");

      // Create order
      const orderResponse = await axios.post(
        "http://localhost:4000/create-order",
        { amount, appointment_id: appointmentId },
        { headers: { token } }
      );

      if (orderResponse.data.Status === "AlreadyPaid" || orderResponse.data.Status === "AlreadyConfirmed") {
        
        alert("Already Done Payment");
         navigate(`/home/receipt/${appointmentId}`);
      }
      if (orderResponse.data.Status === "PaymentFailed") {
         throw new Error("Payment failed");

      }

      const { order, payment_id, booking_type } = orderResponse.data;
      const razorpayOrderId = order.id;

      // Setup Razorpay options
      const options = {
        key: RAZORPAY_KEY,
        amount: amount * 100,
        currency: "INR",
        name: "PawDerma",
        description: `${booking_type} Appointment Payment`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            const sigRes = await axios.post(
              "http://localhost:4000/generate-test-signature",
              {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
              },
              { headers: { token } }
            );

            if (sigRes.data.generated_signature !== response.razorpay_signature) {
              throw new Error("Signature mismatch! Payment not verified.");
            }

            // Verify payment
            await axios.post(
              "http://localhost:4000/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                payment_id,
              },
              { headers: { token } }
            );

           navigate(`/home/receipt/${appointmentId}`);
          } catch (err) {
            console.error("Payment verification failed:", err);
            setError("Payment verification failed");
          }
        },
        prefill: {
          name: "Cat Owner",
          email: "owner@example.com",
          contact: "9999999999",
        },
        theme: { color: "#a91830ff" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      setError("Payment initiation failed: " + err.message);
    }

    setProcessing(false);
  };

  return (
    <div className="container my-5 mt-3 pb-5"  style={{ maxWidth: "900px" }}>
      <div className="row justify-content-center p-3">
        <div className="col-12 col-md-6">
          <div className="card shadow-lg border-0 p-4">
            <div className="card-header my-color8 border-0 text-dark text-center">
              <h4 className="mb-1 fs-5 p-2"> Payment Gateway</h4>
            </div>
            <div className="card-body mt-2">
              <div className="mb-3 text-center">
                <h5 className="text-secondary">Amount to Pay</h5>
                <p className="display-6 fs-4 fw-bold">₹ {amount}</p>
              </div>

              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  {error}
                </div>
              )}

              <button
                onClick={displayRazorpay}
                disabled={processing}
                className="btn  w-100 btn-lg my-btn"
              >
                {processing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2 " role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (

                 <span className="fs-6">Pay Now</span> 
                )}
              </button>
            </div>
            <div className="card-footer text-center  text-muted small">
             <span className="px-2">Secure payment powered by Razorpay</span> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
