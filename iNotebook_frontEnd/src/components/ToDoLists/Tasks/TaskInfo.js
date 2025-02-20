import React, { useEffect, useRef } from 'react'
import moment from 'moment'

function TaskInfo(props) {
    const { task, showInfo } = props;
    const showTaskInfo = useRef();

    const modalStyle = {
        borderRadius: '15px',
        backgroundColor: '#fff',
    };
    
    const modalHeaderStyle = {
        backgroundColor: '#000',
        color: 'white',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
        padding: '15px',
    };
    
    const modalFooterStyle = {
        justifyContent: 'center',
        padding: '15px 25px 5px 25px',
    };
    
    const modalButtonSecondaryStyle = {
        backgroundColor: '#000',
        color: '#fff',
        borderRadius: '30px',
    };  

    const rowData = {
        padding: '4px',
        textAlign: 'left'
    }

    useEffect(() => {
        showTaskInfo.current.click();
    }, [])

  return (
    <div>
        <button type="button" className="btn" ref={showTaskInfo} hidden={true} data-bs-toggle="modal" data-bs-target="#taskInfoModal">
            Launch demo modal
        </button>
        <div className="modal fade" id="taskInfoModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={modalStyle}>
                    <div className="modal-header" style={modalHeaderStyle}>
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Task Information</h1>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td style={rowData}><strong>Description:</strong></td>
                                            <td style={rowData}>{task.taskDesc}</td>
                                        </tr>
                                        <tr>
                                            <td style={rowData}><strong>Created Date:</strong></td>
                                            <td style={rowData}>{moment(new Date(task.createdDate)).format('LLL')}</td>
                                        </tr>
                                        <tr>
                                            <td style={rowData}><strong>Folder Name:</strong></td>
                                            <td style={rowData}>{task.src}</td>
                                        </tr>
                                        <tr>
                                            <td style={rowData}><strong>Task Status:</strong></td>
                                            <td style={rowData}>{task.completed ? <span className='border rounded bg-success px-1 text-white text-center'>Completed</span> : <span className='border rounded bg-danger px-1 text-white text-center'>In Complete</span>}</td>
                                        </tr>
                                        { task.completed &&
                                            <tr>
                                                <td style={rowData}><strong>Completed Date:</strong></td>
                                                <td style={rowData}>{moment(new Date(task.completedDate)).format('LLL')}</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer" style={modalFooterStyle}>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" style={modalButtonSecondaryStyle} onClick={() => {showInfo(false, null)}}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TaskInfo
