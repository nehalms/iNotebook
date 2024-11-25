import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Alert(props) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showToast = (type, msg, id) => {
    if (!toast.isActive(id)) {
      if (type === 'success') {
        toast.success(msg, {
          theme: "dark",
          position: "bottom-left",
          toastId: id
        });
      } else if (type === 'danger') {
        toast.error(msg, {
          theme: "dark",
          position: "bottom-left",
          toastId: id
        });
      } else if (type === 'warning') {
        toast.warning(msg, {
          theme: "dark",
          position: "bottom-left",
          toastId: id
        });
      } else if (type === 'info') {
        toast.info(msg, {
          theme: "dark",
          position: "bottom-left",
          toastId: id
        });
      } else {
        toast(msg, {
          theme: "dark",
          position: "bottom-left",
          toastId: id
        });
      }
    }
  };

  return (
    <div style={{
      height: '50px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '10px'
    }}>
      {props.alert && showToast(props.alert.type, props.alert.msg, props.alert.id)}
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