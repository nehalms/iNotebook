import React, { useRef, useState } from 'react'

function AddTask(props) {

    const { addTaskInt } = props
    const crtFolRefClose = useRef();
    const [task, setTask] = useState('');

    const modalStyle = {
        borderRadius: '15px',
        backgroundColor: '#faeaea',
    };
    
    const modalHeaderStyle = {
        backgroundColor: '#ff7878',
        color: '#f1faee',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
        padding: '15px',
    };
    
    const formLabelStyle = {
        fontSize: '1rem',
        color: '#1b4332',
    };
    
    const formControlStyle = {
        borderRadius: '8px',
        border: '1px solidrgb(223, 255, 241)',
        padding: '12px',
        fontSize: '1rem',
        marginBottom: '10px',
        backgroundColor: '#fff',
        color: '#1b4332',
    };
    
    const modalFooterStyle = {
        justifyContent: 'space-between',
        padding: '15px 25px',
    };
    
    const modalButtonSecondaryStyle = {
        backgroundColor: '#fc7979',
        color: '#081c15',
        borderRadius: '30px',
    };
    
    const modalButtonPrimaryStyle = {
        backgroundColor: '#fa6464',
        color: '#f1faee',
        borderRadius: '30px',
        border: '1px solid rgb(145, 64, 64)',
        padding: '6px 12px',
    };
    
    const modalButtonPrimaryDisabledStyle = {
        backgroundColor: '#d47b7b',
        color: '#f1faee',
        borderRadius: '30px',
        border: '1px solid rgb(183, 82, 82)',
        padding: '6px 12px',
    };     

    const onChange = (e) => {
        setTask(e.target.value);
    }

    const handleClick = async (e) => {
        e.preventDefault();
        addTaskInt(task.toString().trim());
        setTask("");
        crtFolRefClose.current.click();
    }

    return (
      <div>
          <button
              className="p-3 text-white border rounded-pill"
              type="button"
              style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 1, backgroundColor: '#f54287' }}
              data-bs-toggle="modal"
              data-bs-target="#newTaskModal"
          >
              <i className="fa-solid fa-plus me-2"></i>Add Task
          </button>
          <div className="modal fade" id="newTaskModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content" style={modalStyle}>
                      <div className="modal-header" style={modalHeaderStyle}>
                          <h1 className="modal-title fs-5" id="exampleModalLabel">New Task</h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                          <form>
                              <div className="mb-3">
                                  <label htmlFor="title" className="form-label" style={formLabelStyle}>Description</label>
                                  <input
                                      type="text"
                                      value={task}
                                      className="form-control"
                                      id="task"
                                      name="task"
                                      onChange={onChange}
                                      placeholder="At least 5 characters"
                                      style={formControlStyle}
                                  />
                              </div>
                              <div className="modal-footer" style={modalFooterStyle}>
                                  <button type="button" className="btn btn-secondary" ref={crtFolRefClose} data-bs-dismiss="modal" style={modalButtonSecondaryStyle}>Close</button>
                                  <button
                                      type="submit"
                                      disabled={task.toString().trim().length < 5}
                                      onClick={handleClick}
                                      className="btn btn-primary"
                                      style={task.toString().trim().length < 5 ? modalButtonPrimaryDisabledStyle : modalButtonPrimaryStyle}
                                  >
                                      <i className="fa-solid fa-plus me-2"></i>Create task
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

export default AddTask
