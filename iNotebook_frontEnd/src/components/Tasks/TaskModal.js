import { useState, useEffect, useRef, useContext } from 'react';
import moment from 'moment';
import taskContext from '../../context/tasks/taskContext';
import { Tooltip } from "react-tooltip";

const TaskDetailsModal = ({ task_, type }) => {
  const [task, setTask] = useState(JSON.parse(JSON.stringify(task_)));
  const closeBtnRef = useRef();
  const [msg, setMsg] = useState('');
  const content = useContext(taskContext);
  const {addTask, updateTask, deleteTask} = content;

  useEffect(() => {
    setMsg('');
    setTask(JSON.parse(JSON.stringify(task_)));
  }, [task_]);

  const handleTitleChange = (e) => {
    setMsg('');
    setTask({ ...task, title: e.target.value });
  };

  const handlePriorityChange = (e) => {
    setMsg('');
    setTask({ ...task, priority: e.target.value });
  };

  const handleSubtaskChange = (index, field, value) => {
    setMsg('');
    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[index][field] = value;
    setTask({ ...task, subtasks: updatedSubtasks });
  };

  const handleAddSubtask = (e) => {
    setMsg('');
    e.preventDefault();
    setTask({
      ...task,
      subtasks: [...task.subtasks, { name: '', description: '', completed: false }],
    });
  };

  const handleDeleteSubtask = (index) => {
    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks.splice(index, 1);
    setTask({ ...task, subtasks: updatedSubtasks });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if(!task.title || !task.priority || task.subtasks.some(subtask => !subtask.name) || task.subtasks.some(subtask => !subtask.description)) {
      setMsg("Please fill all the fields");
      return;
    }
    if(!task.subtasks.length) {
      setMsg("Add atleast one subtask");
      return;
    }
    if (type == 'new') {
      addTask(task);
    } else {
      updateTask(task);
    }
    closeBtnRef.current.click();
  };

  const handleDeleteTask = (e) => {
    deleteTask(task._id);
    closeBtnRef.current.click();
  }

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

  const rowData = {
    padding: '4px',
    textAlign: 'left',
  };

  return (
    <div>
      <div
        className="modal fade"
        id="TaskDetailsModal"
        tabIndex="-1"
        data-bs-backdrop="static"
        data-bs-keyboard="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content" style={modalStyle}>
            <div className="modal-header" style={modalHeaderStyle}>
              <h1 className="modal-title fs-5">
                Edit Task
              </h1>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <table style={{width: '100%'}}>
                    <tbody>
                      <tr>
                        <td style={rowData}>
                          <strong>Title:</strong>
                        </td>
                        <td style={rowData}>
                          <input type="text" className="form-control" value={task.title} onChange={handleTitleChange} placeholder='Enter the title' />
                        </td>
                      </tr>
                      <tr>
                        <td style={rowData}>
                          <strong>Priority:</strong>
                        </td>
                        <td style={rowData}>
                          <select className="form-select" value={task.priority} onChange={handlePriorityChange} placeholder='Select the priority'>
                            <option value="" disabled hidden>
                              Select the priority
                            </option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </td>
                      </tr>
                      {type != 'new' &&
                        <tr>
                          <td style={rowData}>
                            <strong>Created Date:</strong>
                          </td>
                          <td className='p-2' style={rowData}>
                            {moment(new Date(task.createdDate || new Date())).format('LLL')}
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <p className="fw-semibold mb-3">Sub Tasks:</p>
                  {task.subtasks.map((subtask, index) => (
                    <div key={index} className="d-flex align-items-center gap-2 mb-2"                    >
                      <input type="text" className="form-control" placeholder="Name" disabled={subtask.completed} value={subtask.name} onChange={(e) => handleSubtaskChange(index, 'name', e.target.value)}/>
                      <input type="text" className="form-control" placeholder="Description" disabled={subtask.completed} value={subtask.description} onChange={(e) => handleSubtaskChange(index, 'description', e.target.value)}/>
                      <div className='d-flex align-items-center gap-2 py-2'>
                        { type != 'new' &&
                          <div>
                            <input className="form-check-input" type="checkbox" value="" id={`flexCheck${task._id}`} style={{border: '1px solid black', height: '25px', width: '25px'}} checked={subtask.completed} onChange={(e) =>handleSubtaskChange(index, 'completed', e.target.checked)} />
                            <Tooltip anchorId={`flexCheck${task._id}`} content={`Mark as ${subtask.completed ? 'incomplete': 'complete'}`} place="top" />
                          </div>
                        }
                        { (index > 0 || type != 'new') &&
                          <div onClick={(e) => {e.preventDefault(); handleDeleteSubtask(index);}}>
                            <i id='delST' className="fa-lg fa-solid fa-trash text-danger"></i>
                            <Tooltip anchorId="delST" content={`Delete subtask`} place="top" />
                          </div>
                        }
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-success mt-3" onClick={handleAddSubtask} style={{ borderRadius: '8px' }}>
                    + Add Subtask
                  </button>
                </div>
                <div className='text-center mt-4'>
                  {msg != '' && msg.length && <h6 className="text-danger">{msg}</h6>}
                </div>
              </form>
            </div>
            <div className="modal-footer py-3 d-flex justify-content-end" style={modalFooterStyle}>
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                {type == 'new' ? 'Save' : 'Update'}
              </button> 
              { type != 'new' &&
                <button type="button" className="btn btn-danger" onClick={handleDeleteTask}>
                  Delete
                </button>
              }
              <button type="button" className="btn btn-secondary" ref={closeBtnRef} data-bs-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;