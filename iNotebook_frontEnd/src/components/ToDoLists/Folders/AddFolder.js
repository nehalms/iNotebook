import React, { useRef, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import { history } from '../../History';

function AddFolder(props) {
    const { addFolder } = props
    const crtFolRefClose = useRef();
    const [folderName, setFolderName] = useState('');

    const modalStyle = {
        borderRadius: '15px',
        backgroundColor: '#fff',
    };
    
    const modalHeaderStyle = {
        backgroundColor: '#ffad60',
        color: '#4d3319',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
        padding: '15px',
    };
    
    const formLabelStyle = {
        fontSize: '1rem',
        color: '#6b3e26',
    };
    
    const formControlStyle = {
        borderRadius: '8px',
        border: '1px solid rgb(0, 0, 0)',
        padding: '12px',
        fontSize: '1rem',
        marginBottom: '10px',
        backgroundColor: '#fff',
        color: '#6b3e26',
    };
    
    const modalFooterStyle = {
        justifyContent: 'space-between',
        padding: '15px 25px',
    };
    
    const modalButtonSecondaryStyle = {
        backgroundColor: '#ffb677',
        color: '#6b3e26',
        borderRadius: '30px',
    };
    
    const modalButtonPrimaryStyle = {
        backgroundColor: '#ff924c',
        color: '#fff8f0',
        borderRadius: '30px',
        border: '1px solid rgb(236, 149, 68)',
        padding: '6px 12px',
    };
    
    const modalButtonPrimaryDisabledStyle = {
        backgroundColor: '#ffcc99',
        color: '#fff8f0',
        borderRadius: '30px',
        border: '1px solid rgb(239, 154, 69)',
        padding: '6px 12px',
    };         

    const onChange = (e) => {
        setFolderName(e.target.value);
    }

    const handleClick = async (e) => {
        e.preventDefault();
        if (jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
            props.showAlert("Session expired Login again", 'danger', 10105);
            history.navigate("/login");
            return;
        }
        addFolder(folderName);
        setFolderName("");
        crtFolRefClose.current.click();
    }

  return (
    <div>
        <button
            className="p-3 text-white border rounded-pill"
            type="button"
            style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1, backgroundColor: '#fc9003' }}
            data-bs-toggle="modal"
            data-bs-target="#newfolderModal"
        >
            <i className="fa-solid fa-plus me-2"></i>New Folder
        </button>
        <div className="modal fade" id="newfolderModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={modalStyle}>
                    <div className="modal-header" style={modalHeaderStyle}>
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Create Folder</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label" style={formLabelStyle}>Name</label>
                                <input
                                    type="text"
                                    value={folderName}
                                    className="form-control"
                                    id="title"
                                    name="title"
                                    onChange={onChange}
                                    placeholder="At least 3 characters"
                                    style={formControlStyle}
                                />
                            </div>
                            <div className="modal-footer" style={modalFooterStyle}>
                                <button type="button" className="btn btn-secondary" ref={crtFolRefClose} data-bs-dismiss="modal" style={modalButtonSecondaryStyle}>Close</button>
                                <button
                                    type="submit"
                                    disabled={folderName.length < 3}
                                    onClick={handleClick}
                                    className="btn btn-primary"
                                    style={folderName.length < 3 ? modalButtonPrimaryDisabledStyle : modalButtonPrimaryStyle}
                                >
                                    <i className="fa-solid fa-plus me-2"></i>Create folder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddFolder
