import React, { useState } from "react";
import TaskContext from "./taskContext";
import CryptoJS from 'crypto-js';
import { getSecretKey } from "../../components/Requests/getSecretKey";
import { encryptMessage } from "../../components/Utils/Encryption";

const TaskState = (props)=> {
    const host = process.env.REACT_APP_BASE_URL
    const tasksInitial = []
    const [sortType, setSortType] = useState('NONE');
    const [serachStr, setSearchStr] = useState('');
    const [tasks, setTasks] = useState(tasksInitial);

    const foldersInitial = [];
    const [initTasks, setInitTasks] = useState(foldersInitial);
    const [folders, setFolders] = useState(foldersInitial);

    const fetchTasks = async (src)=> {
        try {
            const secretKey = await getSecretKey();
            props.setLoader({ showLoader: true, msg: "Fetching tasks"});
            const response = await fetch(`${host}/tasks?src=${src}`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                }
            });
            const json = await response.json();
            if(json.status === 1) {
                let decryptedTasks = [];
                json.tasks.map((task) => {
                    task = {
                        ...task,
                        taskDesc: CryptoJS.AES.decrypt(task.taskDesc, secretKey).toString(CryptoJS.enc.Utf8),
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


    const addTask = async (src, taskDesc)=> {
        try {
            const secretKey = await getSecretKey();
            props.setLoader({ showLoader: true, msg: "Adding task"});
            const response = await fetch(`${host}/tasks/addtask`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
                body: JSON.stringify({
                    src: encryptMessage(src),
                    taskDesc: encryptMessage(CryptoJS.AES.encrypt(taskDesc, secretKey).toString())
                })
            });
            const json = await response.json();
            if(json.errors && json.errors.length) {
                props.showAlert(json.errors[0].msg, 'warning', 10122);
                return;
            }
            if(json.status === 1) {
                props.showAlert(json.msg, 'success', 10301);
                fetchTasks(json.task.src);
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10123);
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
                    "auth-token": localStorage.getItem('token')
                },
            });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'warning', 10124);
                return;
            }
            if(json.status === 1) {
                props.showAlert(json.msg, 'success', 10302);
                fetchTasks(json.task.src);
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10125);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }


    const updateTask = async (id, src, taskDesc)=> {
        try {
            const secretKey = await getSecretKey();
            props.setLoader({ showLoader: true, msg: "Updating Task"});
            const response = await fetch(`${host}/tasks/updatetask/${id}`, {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
                body: JSON.stringify({
                    src: encryptMessage(src),
                    taskDesc: encryptMessage(CryptoJS.AES.encrypt(taskDesc, secretKey).toString())
                }),
            });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'warning', 10126);
                return;
            }
            if(json.status === 1) {
                props.showAlert(json.msg, 'success', 10303);
                fetchTasks(json.task.src);
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10127);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }

    const updateTaskStatus = async (id, completed)=> {
        try {
            props.setLoader({ showLoader: true, msg: "Updating task status"});
            const response = await fetch(`${host}/tasks/updatestatus/${id}?comp=${completed}`, {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
            });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'warning', 10306);
                return;
            }
            if(json.status === 1) {
                props.showAlert(json.msg, 'success', 10307);
                fetchTasks(json.task.src);
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10308);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }





    const fetchFolders = async ()=> {
        try {
            props.setLoader({ showLoader: true, msg: "Fetching folders"});
            const response = await fetch(`${host}/tasks/folders`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                }
            });
            const json = await response.json();
            if(json.error) {
                return;
            }
            if(json.status === 1) {
                setFolders(json.folders);
                if(json.folders.length) {
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


    const addFolder = async (src)=> {
        try {
            props.setLoader({ showLoader: true, msg: "Adding folder"});
            const response = await fetch(`${host}/tasks/addfolder?src=${src}`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
            });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'warning', 10122);
                return;
            }
            if(json.status === 1) {
                props.showAlert(json.msg, 'success', 10301);
                fetchFolders();
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10123);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }


    const updateFolder = async (src, dest)=> {
        try {
            props.setLoader({ showLoader: true, msg: "Updating folder"});
            const response = await fetch(`${host}/tasks/updatefolder?src=${src}&dest=${dest}`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
            });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'warning', 10122);
                return;
            }
            if(json.status === 1) {
                props.showAlert(json.msg, 'success', 10301);
                fetchFolders();
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10123);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }

    
    const deleteFolder = async (src)=> {
        try {
            props.setLoader({ showLoader: true, msg: "Deleting folder"});
            const response = await fetch(`${host}/tasks/rmvfolder?src=${src}`, {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
            });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'warning', 10122);
                return;
            }
            if(json.status === 1) {
                props.showAlert(json.msg, 'success', 10301);
                fetchFolders();
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10123);
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
                return task.taskDesc && task.taskDesc.toString().toLowerCase().includes(str.toLowerCase());
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
            let tempTasks = currTask ? [...currTask] : [...tasks];
            if(type === 'NONE') {
                setSortType('NONE');
                setTasks(currTask ? currTask : initTasks);
            } else if (type === 'ASCE') {
                setSortType('ASCE');
                tempTasks.sort((t1, t2) => {
                    return t1.taskDesc.toLowerCase() > t2.taskDesc.toLowerCase() ? 1 : -1;
                })
                setTasks(tempTasks);
            } else if (type === 'DESC') {
                setSortType('DESC');
                tempTasks.sort((t1, t2) => {
                    return t1.taskDesc.toLowerCase() < t2.taskDesc.toLowerCase() ? 1 : -1;
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
            } else if (type === 'COMP_ASCE') {
                setSortType('COMP_ASCE');
                tempTasks.sort((t1, t2) => {
                    return t1.completed < t2.completed ? 1 : -1;
                })
                setTasks(tempTasks);
            } else if (type === 'COMP_DESC') {
                setSortType('COMP_DESC');
                tempTasks.sort((t1, t2) => {
                    return t1.completed > t2.completed ? 1 : -1;
                })
                setTasks(tempTasks);
            } else if (type === 'LEN') {
                setSortType('LEN');
                tempTasks.sort((t1, t2) => {
                    return t1.taskDesc.length > t2.taskDesc.length ? 1 : -1;
                })
                setTasks(tempTasks);
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10123);
        }
    }

    return (
        <TaskContext.Provider value={{tasks, fetchTasks, addTask, deleteTask, updateTask, updateTaskStatus, folders, fetchFolders, addFolder, updateFolder, deleteFolder, sort, searchTask}}>
            {props.children}
        </TaskContext.Provider>
    )
}

export default TaskState;