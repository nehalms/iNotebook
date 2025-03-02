import React, { useContext, useEffect, useRef, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import { Tooltip } from "react-tooltip";
import { history } from '../../History';
import taskContext from '../../../context/tasks/taskContext';
import FolderItem from './FolderItem';
import AddFolder from './AddFolder';
import Tasks from '../Tasks/Tasks';
import SortNSerh from '../../Utils/SortNSearch/SortNSerh';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/auth_state/authContext';

export default function Folder(props) {
    history.navigate = useNavigate();
    const { userState } = useContext(AuthContext);
    const content = useContext(taskContext);
    const {folders, fetchFolders, addFolder, updateFolder, sort, searchTask} = content
    const editFoldNameRef = useRef();
    const crtFolRefClose = useRef();
    const [showTasks, setShowTasks] = useState(false);
    const [currSrc, setCurrSrc] = useState(null);
    const [updFold, setUpdFold] = useState({
        src: "",
        dest: ""
    })

    const sortingList = [
        { name: 'None', nested: [{name: 'None', type: 'NONE'}] },
        { name: 'Name', nested: [{ name: 'A-Z', type: 'ASCE'}, { name: 'Z-A', type: 'DESC'}] },
        { name: 'Date', nested: [{ name: 'Older', type: 'DATE_ASCE'}, { name: 'Latest', type: 'DATE_DESC'}] },
        { name: 'Status', nested: [{ name: 'Completed', type: 'COMP_ASCE'}, { name: 'Incomplete', type: 'COMP_DESC'}] },
        { name: 'Length', nested: [{ name: 'Length', type: 'LEN'},] },
    ];

    const modalStyle = {
        borderRadius: '15px',
        backgroundColor: '#fff',
    };
    
    const modalHeaderStyle = {
        backgroundColor: 'rgb(196, 181, 167)',
        color: 'black',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
        padding: '15px',
    };
    
    const formLabelStyle = {
        fontSize: '1rem',
        color: 'black',
    };
    
    const formControlStyle = {
        borderRadius: '8px',
        border: '1px solid rgb(0, 0, 0)',
        padding: '12px',
        fontSize: '1rem',
        marginBottom: '10px',
        backgroundColor: '#fff',
        color: '#rgb(0, 0, 0)',
    };
    
    const modalFooterStyle = {
        justifyContent: 'space-between',
        padding: '15px 25px',
    };
    
    const modalButtonSecondaryStyle = {
        backgroundColor: '#fff',
        color: '#6b3e26',
        borderRadius: '30px',
    };
    
    const modalButtonPrimaryStyle = {
        backgroundColor: 'rgb(205, 188, 171)',
        color: 'rgb(0, 0, 0)',
        borderRadius: '30px',
        border: '1px solid rgb(0, 0, 0)',
        padding: '6px 12px',
    };
    
    const modalButtonPrimaryDisabledStyle = {
        backgroundColor: 'rgb(153, 153, 153)',
        color: 'rgb(255, 255, 255)',
        borderRadius: '30px',
        border: '1px solid rgb(0, 0, 0)',
        padding: '6px 12px',
    };

    useEffect(() => {
        if (!userState.loggedIn) {
            history.navigate("/");
            return;
        } else {
            fetchFolders();
        }
        
    }, []);


    const editFolderName = (src, dest) => {
        setUpdFold({
            src: src,
            dest: dest,
        })
        editFoldNameRef.current.click();
    }

    const onChange = (e) => {
        setUpdFold({...updFold, [e.target.name]: e.target.value});
    }

    const handleClick = (e) => {
        e.preventDefault();
        updateFolder(updFold.src, updFold.dest);
        setUpdFold({
            src: '',
            dest: ''
        })
        editFoldNameRef.current.click();
    }

    const handleFolderClick = (src) => {
        setShowTasks(!showTasks);
        setCurrSrc(src);
        return;
    }

    const boxStyle = {
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        MsUserSelect: 'none',
    }

  return (
    <div className='my-5'> 
        {!showTasks && <AddFolder addFolder={addFolder}/>}
        <button type="button" className="btn" ref={editFoldNameRef} hidden={true} data-bs-toggle="modal" data-bs-target="#editfolderModal">
            Launch demo modal
        </button>
        <div className="modal fade" id="editfolderModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={modalStyle}>
                    <div className="modal-header" style={modalHeaderStyle}>
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Update Folder Name</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label" style={formLabelStyle}>Current Name</label>
                                <input
                                    type="text"
                                    value={updFold.src}
                                    className="form-control"
                                    id="src"
                                    name="src"
                                    onChange={onChange}
                                    placeholder="At least 3 characters"
                                    style={formControlStyle}
                                    disabled
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label" style={formLabelStyle}>New Name</label>
                                <input
                                    type="text"
                                    value={updFold.dest}
                                    className="form-control"
                                    id="dest"
                                    name="dest"
                                    onChange={onChange}
                                    placeholder="At least 3 characters"
                                    style={formControlStyle}
                                />
                            </div>
                            <div className="modal-footer" style={modalFooterStyle}>
                                <button type="button" className="btn btn-secondary" ref={crtFolRefClose} data-bs-dismiss="modal" style={modalButtonSecondaryStyle}>Close</button>
                                <button
                                    type="submit"
                                    disabled={updFold.dest.length < 3}
                                    onClick={handleClick}
                                    className="btn btn-primary"
                                    style={updFold.dest.length < 3 ? modalButtonPrimaryDisabledStyle : modalButtonPrimaryStyle}
                                >
                                    <i className="fa-solid fa-plus me-2"></i>Update Name
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>


        <div className="row mt-5">
            <div className='col-md-6 my-1 p-1 d-flex align-items-center justify-content-start'>
                <h2 className='mx-1 my-0 text-left'>{showTasks ? <><i className="m-0 me-2 p-0 fa-regular fa-folder"></i>{currSrc}</> : 'Your Tasks'}</h2>
                {  showTasks &&
                    <div id="back" className='p-2 mx-2 border rounded text-center' style={boxStyle} onClick={() => {handleFolderClick(null)}}>
                        <p className='m-0'><i className="m-0 fa-solid fa-arrow-left"></i><i className="ms-3 p-0 fa-regular fa-folder"></i> Folders</p>
                        <Tooltip anchorId="back" style={{zIndex: '10'}} content={`Go back to folders`} place="right" />
                    </div>
                }
            </div>
            {   
                showTasks &&
                <SortNSerh sortingList={sortingList} sort={sort} search={searchTask} />
            }
        </div>
        { !showTasks ?
            <div className="row my-1">
                <div className='container mx-2'>
                    {folders.length === 0 && "No Folder to display"}
                </div>
                {folders.length > 0 && folders.map((folder) => {
                    return (
                        <FolderItem showAlert={props.showAlert} key={folder} name={folder} editFolderName={editFolderName} handleFolderClick={handleFolderClick}/>
                    );
                })}
            </div> :
            <Tasks src={currSrc}/>
        }
    </div>
  )
}
