import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Alert({ alert }) {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (alert) {
      showToast(alert.type, alert.msg, alert.id);
    }
  }, [alert]);

  const showToast = (type, msg, id) => {
    if (!toast.isActive(id)) {
      const options = {
        theme: "dark",
        position: "bottom-left",
        toastId: id
      };

      if (type === 'success') toast.success(msg, options);
      else if (type === 'danger') toast.error(msg, options);
      else if (type === 'warning') toast.warning(msg, options);
      else if (type === 'info') toast.info(msg, options);
      else toast(msg, options);
    }
  };

  // useEffect(() => {
  //   const handleSessionExpiry = (event) => {
  //     if (event.detail && event.detail.sessionexpired) {
  //       showToast('danger', event.detail.message || 'Session expired, please log in again', 90000);
  //     }
  //   };
  //   window.addEventListener('sessionExpiry', handleSessionExpiry);
  //   return () => window.removeEventListener('sessionExpiry', handleSessionExpiry);
  // }, []);

  return (
    <div style={{
      height: '50px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '10px'
    }}>
      <ToastContainer
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
        style={{
          fontSize: '0.9rem',
          borderRadius: '8px',
          width: width !== 0 && width < 490 && '70%',
        }}
      />
    </div>
  );
}
