import React, { useState } from "react";
import TaskContext from "./taskContext";
import CryptoJS from 'crypto-js';
import useSession from '../../components/SessionState/useSession';

const TaskState = (props)=> {
    const host = process.env.REACT_APP_BASE_URL
    const tasksInitial = []
    const [sortType, setSortType] = useState('NONE');
    const [serachStr, setSearchStr] = useState('');
    const [tasks, setTasks] = useState(tasksInitial);
    const [initTasks, setInitTasks] = useState([]);
    const { secretKey, isPinSet, isPinVerified } = useSession();

    const fetchTasks = async ()=> {
        if(!isPinSet || !isPinVerified) {
            return;
        }
        try {
            props.setLoader({ showLoader: true, msg: "Fetching tasks"});
            const response = await fetch(`${host}/tasks`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'danger', 10120);
                return;
            }
            if(json.status === 1) {
                let decryptedTasks = [];
                json.tasks.map((task) => {
                    task = {
                        ...task,
                        title: CryptoJS.AES.decrypt(task.title, secretKey).toString(CryptoJS.enc.Utf8),
                        priority: CryptoJS.AES.decrypt(task.priority, secretKey).toString(CryptoJS.enc.Utf8),
                        subtasks: task.subtasks.map((subtask) => {
                            return {
                                ...subtask,
                                name: CryptoJS.AES.decrypt(subtask.name, secretKey).toString(CryptoJS.enc.Utf8),
                                description: CryptoJS.AES.decrypt(subtask.description, secretKey).toString(CryptoJS.enc.Utf8),
                            }
                        })
                    }
                    decryptedTasks.push(task);
                });
                setTasks(decryptedTasks);
                setInitTasks(decryptedTasks);
                sort(sortType, decryptedTasks);
                searchTask(serachStr, decryptedTasks);
                if(json.tasks.length) {
                    props.showAlert(json.msg, 'success', 10301);
                }
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Error in fetching notes", 'danger', 10121);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }


    const addTask = async (task)=> {
        try {
            props.setLoader({ showLoader: true, msg: "Adding task"});
            let encryptedTask = {
                title: CryptoJS.AES.encrypt(task.title, secretKey).toString(),
                priority: CryptoJS.AES.encrypt(task.priority, secretKey).toString(),
                subtasks: task.subtasks.map(subtask => ({
                    ...subtask,
                    name: CryptoJS.AES.encrypt(subtask.name, secretKey).toString(),
                    description: CryptoJS.AES.encrypt(subtask.description, secretKey).toString(),
                }))
            }
            const response = await fetch(`${host}/tasks/addtask`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({data: encryptedTask}),
            });
            const json = await response.json();
            if(json.errors && json.errors.length) {
                props.showAlert(json.errors[0].msg, 'warning', 10122);
                return;
            }
            if(json.status === 1) {
                props.showAlert(json.msg, 'success', 10301);
                fetchTasks();
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10123);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }

    const updateTask = async (task)=> {
        try {
            props.setLoader({ showLoader: true, msg: "Updating Task"});
            let encryptedTask = {
                title: CryptoJS.AES.encrypt(task.title, secretKey).toString(),
                priority: CryptoJS.AES.encrypt(task.priority, secretKey).toString(),
                subtasks: task.subtasks.map(subtask => ({
                    ...subtask,
                    name: CryptoJS.AES.encrypt(subtask.name, secretKey).toString(),
                    description: CryptoJS.AES.encrypt(subtask.description, secretKey).toString(),
                }))
            }
            const response = await fetch(`${host}/tasks/updatetask/${task._id}`, {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({data: encryptedTask}),

            });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'warning', 10126);
                return;
            }
            if(json.status === 1) {
                props.showAlert(json.msg, 'success', 10303);
                fetchTasks();
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10127);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }

    const deleteTask = async (id)=> {
        try { 
            props.setLoader({ showLoader: true, msg: "Deleting task"});
            const response = await fetch(`${host}/tasks/deletetask/${id}`, {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'warning', 10124);
                return;
            }
            if(json.status === 1) {
                props.showAlert(json.msg, 'success', 10302);
                fetchTasks();
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10125);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }
    
    // sorting and searching function
    const searchTask = (str, currTask=null) => {
        try {
            props.setLoader({ showLoader: true, msg: "Searching tasks"});
            str = str.trim();
            setSearchStr(str);
            if(str === '') {
                setTasks(currTask ? currTask : initTasks)
                sort(sortType, currTask ? currTask : initTasks);
                return;
            }
            let tempTasks = currTask ? [...currTask] : [...initTasks];
            tempTasks = tempTasks.filter((task) => {
                return task.title && task.title.toString().toLowerCase().includes(str.toLowerCase())
                    || task.subtasks.some((subtask) => {
                        return subtask.name && subtask.name.toString().toLowerCase().includes(str.toLowerCase())
                        || subtask.description && subtask.description.toString().toLowerCase().includes(str.toLowerCase())
                    });
            });            
            setTasks(tempTasks);
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10123);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }

    const sort = (type, currTask = null) => {
        try {
            const priorityOrder = {
                'Low': 1,
                'Medium': 2,
                'High': 3
            };
            let tempTasks = currTask ? [...currTask] : [...tasks];
            if(type === 'NONE') {
                setSortType('NONE');
                setTasks(currTask ? currTask : initTasks);
            } else if (type === 'ASCE') {
                setSortType('ASCE');
                tempTasks.sort((t1, t2) => {
                    return t1.title.toLowerCase() > t2.title.toLowerCase() ? 1 : -1;
                })
                setTasks(tempTasks);
            } else if (type === 'DESC') {
                setSortType('DESC');
                tempTasks.sort((t1, t2) => {
                    return t1.title.toLowerCase() < t2.title.toLowerCase() ? 1 : -1;
                })
                setTasks(tempTasks);
            } else if (type === 'DATE_ASCE') {
                setSortType('DATE_ASCE');
                tempTasks.sort((t1, t2) => {
                    return t1.createdDate < t2.createdDate ? -1 : 1;
                })
                setTasks(tempTasks);
            } else if (type === 'DATE_DESC') {
                setSortType('DATE_DESC');
                tempTasks.sort((t1, t2) => {
                    return t1.createdDate < t2.createdDate ? 1 : -1;
                })
                setTasks(tempTasks);
            } else if (type === 'PRT_ASCE') {
                setSortType('PRT_ASCE');
                tempTasks.sort((t1, t2) => {
                    return priorityOrder[t1.priority] - priorityOrder[t2.priority];
                })
                setTasks(tempTasks);
            } else if (type === 'PRT_DESC') {
                setSortType('PRT_DESC');
                tempTasks.sort((t1, t2) => {
                    return priorityOrder[t2.priority] - priorityOrder[t1.priority];
                })
                setTasks(tempTasks);
            } else if (type === 'SL_ASCE') {
                setSortType('SL_ASCE');
                tempTasks.sort((t1, t2) => {
                    return t1.subtasks.length - t2.subtasks.length;
                })
                setTasks(tempTasks);
            } else if (type === 'SL_DESC') {
                setSortType('SL_DESC');
                tempTasks.sort((t1, t2) => {
                    return t2.subtasks.length - t1.subtasks.length;
                })
                setTasks(tempTasks);
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10123);
        }
    }

    return (
        <TaskContext.Provider value={{tasks, fetchTasks, addTask, updateTask, deleteTask, sort, searchTask}}>
            {props.children}
        </TaskContext.Provider>
    )
}

export default TaskState;