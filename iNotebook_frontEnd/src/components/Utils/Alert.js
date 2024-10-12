import { React } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

export default function Alert(props) {

    const showToast = (type, msg, id) => {
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
        })
      }
    }

  return (
    <div style={{height: '50px'}}> 
      {/* {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
          <strong>{capitalize(props.alert.type)}</strong> : {props.alert.msg}
      </div>}  */}
      {props.alert && showToast(props.alert.type, props.alert.msg, props.alert.id)}
      <ToastContainer autoClose={1500}/>
    </div>
  )
}

