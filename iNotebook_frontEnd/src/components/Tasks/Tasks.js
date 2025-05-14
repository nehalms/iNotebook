import { useEffect, useRef, useState, useContext } from 'react';
import Security from '../SecurityPin/Security';
import useSession from '../SessionState/useSession';
import TaskCard from './TaskCard';
import TaskDetailsModal from './TaskModal';
import { history } from '../History'
import SortNSerh from '../Utils/SortNSearch/SortNSerh';
import taskContext from '../../context/tasks/taskContext';

const sortingList = [
    { name: 'None', nested: [{name: 'None', type: 'NONE'}] },
    { name: 'Title', nested: [{ name: 'A-Z', type: 'ASCE'}, { name: 'Z-A', type: 'DESC'}] },
    { name: 'Date', nested: [{ name: 'Older', type: 'DATE_ASCE'}, { name: 'Latest', type: 'DATE_DESC'}] },
    { name: 'Priority', nested: [{ name: 'High-Low', type: 'PRT_DESC'}, { name: 'Low-High', type: 'PRT_ASCE'}] },
    { name: 'Tasks Size', nested: [{ name: 'Less-More', type: 'SL_ASCE'}, { name: 'More-Less', type: 'SL_DESC'}] },
];

const getInitTask = () => ({
  title: '',
  priority: '',
  subtasks: [{ name: '', description: '', completed: false }],
});

const Tasks = (props)=> {
    const { isLoggedIn, isPinSet, isPinVerified } = useSession();
    const [type, setType] = useState('new');
    const [selectedTask, setSelectedTask] = useState();
    const btnRef = useRef();
    const content = useContext(taskContext);
    const {tasks, fetchTasks, sort, searchTask} = content;

    useEffect(() => {
        if (!isLoggedIn) {
            history.navigate("/");
            return;
        } else {
            fetchTasks();
        }
    }, [isLoggedIn, isPinVerified]);

    const handleAddTask = () => {
        setType('new');
        btnRef.current.click();
    }

    const handleViewDetails = (task) => {
        setType('exist');
        setSelectedTask(task);
        btnRef.current.click();
    }


  return (
    <div style={{position: 'relative'}}>
        <button type="button" className="btn" ref={btnRef} hidden={true} data-bs-toggle="modal" data-bs-target="#TaskDetailsModal">Launch demo modal</button>
        {
            isPinSet && isPinVerified && 
            <>
                <button
                    className="p-3 text-white border rounded-pill"
                    type="button"
                    style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 1, backgroundColor: '#fc9003' }}
                    onClick={handleAddTask}
                >
                    <i className="fa-solid fa-plus me-2"></i>Add Task
                </button>
                <TaskDetailsModal task_={type == 'new' ? getInitTask() : JSON.parse(JSON.stringify(selectedTask))} type={type}/>
            </>
        }
        <div className="row my-5">
            <div className='col-md-6'>
                <div className="d-flex align-items-center justify-content-start">
                    <h2 className=''>Your Tasks</h2>
                </div>
                <div className='container mx-2'>
                    {tasks.length === 0 && "No Tasks to display"}
                    {(!isPinSet || (isPinSet && !isPinVerified)) && <Security toVerify={isPinSet} showAlert={props.showAlert}/>}
                </div>
            </div>
            <SortNSerh sortingList={sortingList} sort={sort} search={searchTask} />
            {isPinVerified && tasks.length > 0 && tasks.map((task) => {
                return (
                    <div className='col-lg-4'>
                        <TaskCard key={task._id + task} task={task} handleViewDetails={handleViewDetails}/>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default Tasks
