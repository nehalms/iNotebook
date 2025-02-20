import React, { useContext, useEffect, useRef, useState } from 'react'
import taskContext from '../../../context/tasks/taskContext';
import { jwtDecode } from 'jwt-decode';
import { history } from '../../History';
import TaskItem from './TaskItem';
import AddTask from './AddTask';
import TaskInfo from './TaskInfo';

function Tasks(props) {
	const { src, showAlert } = props;
    const [showTaskInfo, setTaskInfo] = useState({
        show: false,
        task: null,
    });
	const [task, setTask] = useState({
		id: '',
		src: '',
		taskDesc: '',
	});
	const context = useContext(taskContext);
	const crtFolRefClose = useRef();
	const editTaskRef = useRef();
	const {tasks, fetchTasks, addTask, updateTask, deleteTask, updateTaskStatus} = context;

	const modalStyle = {
        borderRadius: '15px',
        backgroundColor: '#f0f8ff',
    };
    
    const modalHeaderStyle = {
        backgroundColor: '#0077b6',
        color: '#f1faff',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
        padding: '15px',
    };
    
    const formLabelStyle = {
        fontSize: '1rem',
        color: '#023e8a',
    };
    
    const formControlStyle = {
        borderRadius: '8px',
        border: '1px solid #0077b6',
        padding: '12px',
        fontSize: '1rem',
        marginBottom: '10px',
        backgroundColor: '#f1faff',
        color: '#023e8a',
    };
    
    const modalFooterStyle = {
        justifyContent: 'space-between',
        padding: '15px 25px',
    };
    
    const modalButtonSecondaryStyle = {
        backgroundColor: '#48cae4',
        color: '#023e8a',
        borderRadius: '30px',
    };
    
    const modalButtonPrimaryStyle = {
        backgroundColor: '#00b4d8',
        color: '#ffffff',
        borderRadius: '30px',
        border: '1px solid #0096c7',
        padding: '6px 12px',
    };
    
    const modalButtonPrimaryDisabledStyle = {
        backgroundColor: '#90e0ef',
        color: '#ffffff',
        borderRadius: '30px',
        border: '1px solid #00b4d8',
        padding: '6px 12px',
    };        
	
	useEffect(() => {
		if (localStorage.getItem('token')) {
			if (jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
				showAlert("Session expired Login again", 'danger', 10109);
				history.navigate("/login");
			} else {
				fetchTasks(src);
			}
		}
		else {
			history.navigate("/login");
		}
	}, []);

	const onChange = (e) => {
        setTask({...task, [e.target.name]: e.target.value});
    }

	const handleClick = (e) => {
		e.preventDefault();
		if (jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
			props.showAlert("Session expired Login again", 'danger', 10105);
			history.navigate("/login");
			return;
		}
		updateTask(task.id, task.src, task.taskDesc);
		crtFolRefClose.current.click();
	}

	const addTaskInt = (task) => {
		if(!task || !src) {
			props.showAlert(`${!src ? 'Folder name' : 'Task description'} missing`, 'danger', 10310);
			return;
		}
		addTask(src, task);
		return;
	}

	const editTask = (task) => {
		setTask({
			id: task._id,
			src: task.src,
			taskDesc: task.taskDesc,
		});
		editTaskRef.current.click();
	}

	const updateStatus = (e, task) => {
		updateTaskStatus(task._id, e.target.checked);
		return;
	}

    const showInfo = (show, task) => {
        setTaskInfo({
            show: show,
            task: task,
        })
    }

  return (
    <div>
		<button type="button" className="btn" ref={editTaskRef} hidden={true} data-bs-toggle="modal" data-bs-target="#edittaskModal">
            Launch demo modal
        </button>
        <div className="modal fade" id="edittaskModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={modalStyle}>
                    <div className="modal-header" style={modalHeaderStyle}>
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Update Task</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label" style={formLabelStyle}>Description</label>
                                <input
                                    type="text"
                                    value={task.taskDesc}
                                    className="form-control"
                                    id="taskDesc"
                                    name="taskDesc"
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
                                    <i className="fa-solid fa-plus me-2"></i>Update Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        {showTaskInfo.show && <TaskInfo task={showTaskInfo.task} showInfo={showInfo}/>}

		<AddTask addTaskInt={addTaskInt}/>
		<div className="row my-1">
			<div className='container mx-2'>
				{tasks.length === 0 && "No Tasks to display"}
			</div>
			{tasks.length > 0 && tasks.map((task) => {
				return (
					<TaskItem showAlert={props.showAlert} key={task._id} task={task} deleteTask={deleteTask} editTask={editTask} updateStatus={updateStatus} showInfo={showInfo}/>
				);
			})}
		</div>
    </div>
  )
}

export default Tasks
