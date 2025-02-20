import React, { useState } from "react";
import TaskContext from "./taskContext";
import { encryptMessage } from "../../components/Utils/Encryption";

const TaskState = (props)=> {
    const host = process.env.REACT_APP_BASE_URL
    const tasksInitial = []
    const [tasks, setTasks] = useState(tasksInitial);

    const foldersInitial = [];
    const [folders, setFolders] = useState(foldersInitial);

    const fetchTasks = async (src)=> {
        try {
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
                setTasks(json.tasks);
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
            props.setLoader({ showLoader: true, msg: "Adding task"});
            const response = await fetch(`${host}/tasks/addtask`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
                body: JSON.stringify({
                    src: encryptMessage(src),
                    taskDesc: encryptMessage(taskDesc)
                })
            });
            const json = await response.json();
            if(json.errors && json.errors.length) {
                props.showAlert(json.errors[0].msg, 'info', 10122);
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
                props.showAlert(json.error, 'info', 10124);
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
            props.setLoader({ showLoader: true, msg: "Updating Task"});
            const response = await fetch(`${host}/tasks/updatetask/${id}`, {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
                body: JSON.stringify({
                    src: encryptMessage(src),
                    taskDesc: encryptMessage(taskDesc)
                }),
            });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'info', 10126);
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
                props.showAlert(json.error, 'info', 10306);
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
                props.showAlert(json.error, 'info', 10122);
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
                props.showAlert(json.error, 'info', 10122);
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
                props.showAlert(json.error, 'info', 10122);
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


    return (
        <TaskContext.Provider value={{tasks, fetchTasks, addTask, deleteTask, updateTask, updateTaskStatus, folders, fetchFolders, addFolder, updateFolder, deleteFolder}}>
            {props.children}
        </TaskContext.Provider>
    )
}

export default TaskState;