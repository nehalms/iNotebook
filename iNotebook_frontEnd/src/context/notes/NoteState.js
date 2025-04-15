import React, { useState } from "react";
import NoteContext from "./noteContext";
import CryptoJS from 'crypto-js';
import useSession from '../../components/SessionState/useSession';

const NoteState = (props)=> {
    const host = process.env.REACT_APP_BASE_URL;
    const [sortType, setSortType] = useState('NONE');
    const [serachStr, setSearchStr] = useState('');
    const notesInitital = []
    const [initNotes, setInitNotes] = useState(notesInitital);
    const [notes, setNotes] = useState(notesInitital);
    const { secretKey } = useSession();
    
    //get all notes
    const fetchNotes = async ()=> {
        try {
            props.setLoader({ showLoader: true, msg: "Fetching Notes"});
            const response = await fetch(`${host}/notes/fetchallnotes`, {
                method: "GET", 
                headers: {
                "Content-Type": "application/json",
                },
                credentials: 'include',
            });
            props.setLoader({ showLoader: false });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'danger', 10120);
                return;
            }
            // console.log(json);
            let decryptedNote = [];
            json.map((note) => {
                note = {
                    ...note,
                    title: CryptoJS.AES.decrypt(note.title, secretKey).toString(CryptoJS.enc.Utf8),
                    description: CryptoJS.AES.decrypt(note.description, secretKey).toString(CryptoJS.enc.Utf8),
                    tag: CryptoJS.AES.decrypt(note.tag, secretKey).toString(CryptoJS.enc.Utf8),
                }
                decryptedNote.push(note);
            });
            setNotes(decryptedNote);
            setInitNotes(decryptedNote);
            sort(sortType, decryptedNote);
            searchNote(serachStr, decryptedNote);
        } catch (err) {
            props.setLoader({ showLoader: false });
            console.log("Error**", err);
            props.showAlert("Error in fetching notes", 'danger', 10121);
        }
    }


    //Add a note
    const addNote = async (title, description, tag)=> {
        try {
            title = CryptoJS.AES.encrypt(title, secretKey).toString();
            description = CryptoJS.AES.encrypt(description, secretKey).toString();
            tag = CryptoJS.AES.encrypt(tag, secretKey).toString();
            props.setLoader({ showLoader: true, msg: "Adding Notes"});
            const response = await fetch(`${host}/notes/addnote`, {
                method: "POST", 
                headers: {
                "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({title, description, tag}), // body data type must match "Content-Type" header
            });
            props.setLoader({ showLoader: false });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'danger', 10122);
                return;
            }
            props.showAlert("Note added successfully", 'success', 10106);
            fetchNotes();
        } catch (err) {
            props.setLoader({ showLoader: false });
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10123);
        }
    }


    //Delete a note
    const deleteNote = async (id)=> {
        try { 
            props.setLoader({ showLoader: true, msg: "Deleting Notes"});
            const response = await fetch(`${host}/notes/deletenote/${id}`, {
                method: "PUT", 
                headers: {
                "Content-Type": "application/json",
                },
                credentials: 'include',
            });
            props.setLoader({ showLoader: false });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'danger', 10124);
                return;
            }
            props.showAlert("Note deleted successfully", 'success', 10108);
            fetchNotes();
        } catch (err) {
            props.setLoader({ showLoader: false });
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10125);
        }
        // const newNotes = notes.filter((note) => {return note._id !== id});
        // setNotes(newNotes);
    }


    //Edit a note
    const updateNote = async (id, title, description, tag)=> {
        try {
            title = CryptoJS.AES.encrypt(title, secretKey).toString();
            description = CryptoJS.AES.encrypt(description, secretKey).toString();
            tag = CryptoJS.AES.encrypt(tag, secretKey).toString();
            props.setLoader({ showLoader: true, msg: "Updating Notes"});
            const response = await fetch(`${host}/notes/updatenote/${id}`, {
                method: "PUT", 
                headers: {
                "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({title, description, tag}), // body data type must match "Content-Type" header
            });
            props.setLoader({ showLoader: false });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'danger', 10126);
                return;
            }
            props.showAlert("Notes updated successfully", "success", 10111);
            fetchNotes();
        } catch (err) {
            props.setLoader({ showLoader: false });
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10127);
        }
    }

    const searchNote = (str, currNote=null) => {
        try {
            props.setLoader({ showLoader: true, msg: "Searching notes"});
            str = str.trim();
            setSearchStr(str);
            if(str === '') {
                setNotes(currNote ? currNote : initNotes)
                sort(sortType, currNote ? currNote : initNotes);
                return;
            }
            let tempNotes = currNote ? [...currNote] : [...initNotes];
            tempNotes = tempNotes.filter((note) => {
                return (
                    note.title && note.title.toString().toLowerCase().includes(str.toLowerCase()) ||
                    note.description && note.description.toString().toLowerCase().includes(str.toLowerCase()) ||
                    note.tag && note.tag.toString().toLowerCase().includes(str.toLowerCase())
                ); 
                
            });            
            setNotes(tempNotes);
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10123);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }

    const sort = (type, currNote = null) => {
        try {
            let tempNotes = currNote ? [...currNote] : [...notes];
            if(type === 'NONE') {
                setSortType('NONE');
                setNotes(currNote ? currNote : initNotes);
            } else if (type === 'T_ASCE') {
                setSortType('T_ASCE');
                tempNotes.sort((n1, n2) => {
                    return n1.title.toLowerCase() > n2.title.toLowerCase() ? 1 : -1;
                })
                setNotes(tempNotes);
            } else if (type === 'T_DESC') {
                setSortType('T_DESC');
                tempNotes.sort((n1, n2) => {
                    return n1.title.toLowerCase() < n2.title.toLowerCase() ? 1 : -1;
                })
                setNotes(tempNotes);
            } else if (type === 'D_ASCE') {
                setSortType('D_ASCE');
                tempNotes.sort((n1, n2) => {
                    return n1.description.toLowerCase() > n2.description.toLowerCase() ? 1 : -1;
                })
                setNotes(tempNotes);
            } else if (type === 'D_DESC') {
                setSortType('D_DESC');
                tempNotes.sort((n1, n2) => {
                    return n1.description.toLowerCase() < n2.description.toLowerCase() ? 1 : -1;
                })
                setNotes(tempNotes);
            }  else if (type === 'TG_ASCE') {
                setSortType('TG_ASCE');
                tempNotes.sort((n1, n2) => {
                    return n1.tag.toLowerCase() > n2.tag.toLowerCase() ? 1 : -1;
                })
                setNotes(tempNotes);
            } else if (type === 'TG_DESC') {
                setSortType('TG_DESC');
                tempNotes.sort((n1, n2) => {
                    return n1.tag.toLowerCase() < n2.tag.toLowerCase() ? 1 : -1;
                })
                setNotes(tempNotes);
            } else if (type === 'DATE_ASCE') {
                setSortType('DATE_ASCE');
                tempNotes.sort((n1, n2) => {
                    return n1.date < n2.date ? -1 : 1;
                })
                setNotes(tempNotes);
            } else if (type === 'DATE_DESC') {
                setSortType('DATE_DESC');
                tempNotes.sort((n1, n2) => {
                    return n1.date < n2.date ? 1 : -1;
                })
                setNotes(tempNotes);
            } else if (type === 'LEN') {
                setSortType('LEN');
                tempNotes.sort((n1, n2) => {
                    return n1.title.length + n1.description.length + n1.tag.length > n2.title.length + n2.description.length + n2.tag.length ? 1 : -1;
                })
                setNotes(tempNotes);
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10123);
        }
    }


    return (
        <NoteContext.Provider value={{notes, fetchNotes, addNote, deleteNote, updateNote, sort, searchNote}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;