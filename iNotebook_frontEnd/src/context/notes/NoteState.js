import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props)=> {
    const host = process.env.REACT_APP_BASE_URL
    const notesInitital = []
    const [notes, setNotes] = useState(notesInitital)


    //get all notes
    const fetchNotes = async ()=> {
        const response = await fetch(`${host}/notes/fetchallnotes`, {
            method: "GET", 
            headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        console.log(json);
        setNotes(json);
    }


    //Add a note
    const addNote = async (title, description, tag)=> {

        const response = await fetch(`${host}/notes/addnote`, {
            method: "POST", 
            headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag}), // body data type must match "Content-Type" header
        });
        
        const json = response.json();
        console.log(json);
        fetchNotes();

        // const note = {
        //     "_id": "655dc7c322037a12484024ef",
        //     "user": "655c7e526b2e8dfff2fedd52",
        //     "title": title,
        //     "description": description,
        //     "tag": tag,
        //     "date": "2023-11-22T09:20:03.092Z",
        //     "__v": 0
        // }
        // setNotes(notes.concat(note))
    }


    //Delete a note
    const deleteNote = async (id)=> {

        const response = await fetch(`${host}/notes/deletenote/${id}`, {
            method: "PUT", 
            headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
            },
        });
        console.log(response.json());
        fetchNotes();
        // const newNotes = notes.filter((note) => {return note._id !== id});
        // setNotes(newNotes);
    }


    //Edit a note
    const updateNote = async (id, title, description, tag)=> {
        console.log("Got a request")
        const response = await fetch(`${host}/notes/updatenote/${id}`, {
            method: "PUT", 
            headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag}), // body data type must match "Content-Type" header
        });
        fetchNotes();
    }


    return (
        <NoteContext.Provider value={{notes, fetchNotes, addNote, deleteNote, updateNote}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;