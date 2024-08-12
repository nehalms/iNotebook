import React,{ useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/notes/noteContext';
import NoteItem from './NoteItem';
import Addnote from './Addnote';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { history } from '../History';

const Notes = (props) => {
    let navigate = useNavigate();
    const context = useContext(noteContext);
    const {notes, fetchNotes, updateNote} = context;
    const [note, setNote] = useState({id:"", etitle: "", edescription: "", etag: ""})

    useEffect(() => {
        if(localStorage.getItem('token')){
            if(jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
                props.showAlert("Session expired Login again", 'danger');
                history.navigate("/login");
            } else {
                fetchNotes(props);
            }
        }
        else {
            history.navigate("/login");
        }
    }, [])

    const editNote = (currentNote)=>{
        ref.current.click();
        setNote({id:currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag});
    }
    const ref = useRef(null);
    const refClose = useRef(null);

    const handleClick = async (e)=> {
        e.preventDefault();
        if(jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
            props.showAlert("Session expired Login again", 'danger');
            history.navigate("/login");
            return;
        }
        await updateNote(note.id, note.etitle, note.edescription, note.etag);
        props.showAlert("Notes updated successfully", "success");
        refClose.current.click();
    }

    const onChange = (e)=> {
        setNote({...note, [e.target.name]: e.target.value}) //helps to keep data in note as same and append the new values being typed
    }
    
    return (
        <>
            <Addnote showAlert={props.showAlert}/>  
            <button type="button" className="btn btn-primary" ref={ref} hidden={true} data-bs-toggle="modal" data-bs-target="#exampleModal">
            Launch demo modal</button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text"  value={note.etitle} className="form-control" id="etitle" name="etitle" onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" value={note.edescription} className="form-control" id="edescription" name="edescription" onChange={onChange}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" value={note.etag} className="form-control" id="etag" name="etag" onChange={onChange}/>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" ref = {refClose} data-bs-dismiss="modal">Close</button>
                                    <button type="submit" disabled={note.etitle.length < 5 || note.edescription.length < 5} onClick={handleClick} className="btn btn-primary">Update Note</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-5">
                <h2>Your Notes</h2> 
                <div className='container mx-2'>
                {notes.length === 0 && "No Notes to display"}
                </div>
                {notes.length > 0 && notes.map((note)=> {
                    return <NoteItem showAlert={props.showAlert} key={note.id} editNote={editNote} note={note}/>
                })}
            </div>
        </>
    )
}

export default Notes
