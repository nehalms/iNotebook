import React, { useContext, useState } from 'react'
import Popup from '../../Utils/Popup';
import taskContext from '../../../context/tasks/taskContext';
import { jwtDecode } from 'jwt-decode';
import { history } from '../../History';

const FolderItem = (props) => {
    const { name, editFolderName, handleFolderClick } = props;
    const content = useContext(taskContext);
    const {deleteFolder} = content
    const [showPopup, setShowPopup] = useState(false);

    const boxStyle = {
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        MsUserSelect: 'none',
    }

    const onConfirm = async () => {
        setShowPopup(false);
        if(jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
            props.showAlert("Session expired Login again", 'danger', 10107);
            history.navigate("/login");
            return;
        }
        await deleteFolder(name);
        return;
    }

    const onCancel = () => {
        setShowPopup(false);
        return;
    }

  return (
    <div className='col-md-4' id={name}>
        <div className="card shadow-lg my-3">
            <div className="card-body p-1">
                <div className="d-flex align-items-center justify-content-end my-1">
                    { showPopup && 
                        <div>
                            <Popup onCancel={onCancel} onConfirm={onConfirm}/>
                        </div>
                    }
                    { !showPopup && 
                        <div>
                            <i className="fa-regular fa-pen-to-square mx-2 text-secondary" onClick={() => {editFolderName(name, "")}}></i>
                            <i className="fa-solid fa-trash mx-2 text-danger" onClick={() => {setShowPopup(true)}}></i>
                        </div>
                    }
                </div>
                <div style={boxStyle} onClick={() => {handleFolderClick(name)}}>
                    <h4 className="card-text text-center m-0 p-1"><i className="m-0 mx-2 p-0 fa-regular fa-folder"></i>{name}</h4>
                </div>
                <br />
            </div>
        </div>
    </div>
  )
}

export default FolderItem
