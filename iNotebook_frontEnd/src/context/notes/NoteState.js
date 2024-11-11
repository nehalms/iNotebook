import React, { useState } from "react";
import NoteContext from "./noteContext";
import CryptoJS from 'crypto-js';

function decrypt() {
    if( !sessionStorage.getItem('AesKey') ) {
        return;
    }
    let decryptKey = ''
    Array.from(sessionStorage.getItem('AesKey')).forEach(char => {
        decryptKey += String.fromCharCode(char.charCodeAt(0) / 541);
    });
    return decryptKey;
}

const NoteState = (props)=> {
    const host = process.env.REACT_APP_BASE_URL
    const notesInitital = []
    const [notes, setNotes] = useState(notesInitital);
    const secretKey = decrypt();

    //get all notes
    const fetchNotes = async ()=> {
        try {
            props.setLoader({ showLoader: true, msg: "Fetching Notes"});
            const response = await fetch(`${host}/notes/fetchallnotes`, {
                method: "GET", 
                headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
                }
            });
            props.setLoader({ showLoader: false });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'danger');
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
        } catch (err) {
            props.setLoader({ showLoader: false });
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger');
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
                "auth-token": localStorage.getItem('token')
                },
                body: JSON.stringify({title, description, tag}), // body data type must match "Content-Type" header
            });
            props.setLoader({ showLoader: false });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'danger');
                return;
            }
            // console.log(json);
            fetchNotes();
        } catch (err) {
            props.setLoader({ showLoader: false });
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger');
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
                "auth-token": localStorage.getItem('token')
                },
            });
            props.setLoader({ showLoader: false });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'danger');
                return;
            }
            // console.log(json);
            fetchNotes();
        } catch (err) {
            props.setLoader({ showLoader: false });
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger');
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
                "auth-token": localStorage.getItem('token')
                },
                body: JSON.stringify({title, description, tag}), // body data type must match "Content-Type" header
            });
            props.setLoader({ showLoader: false });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'danger');
                return;
            }
            fetchNotes();
        } catch (err) {
            props.setLoader({ showLoader: false });
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger');
        }
    }


    return (
        <NoteContext.Provider value={{notes, fetchNotes, addNote, deleteNote, updateNote}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;