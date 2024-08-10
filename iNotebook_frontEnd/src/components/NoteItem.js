import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const NoteItem = (props) => {
    let navigate = useNavigate();
    const context = useContext(noteContext);
    const {deleteNote} = context;
    const {note, editNote} = props;
    return (
        <div className='col-md-4'>
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between my-1">
                        <h5 className="card-title my-0">{note.title}</h5>
                        <div>
                            <i className="fa-regular fa-pen-to-square mx-2" onClick={() => {editNote(note)}}></i>
                            <i className="fa-solid fa-trash mx-2" onClick={async () => { 
                                if(jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
                                    props.showAlert("Session expired Login again", 'danger');
                                    navigate("/login");
                                    return;
                                }
                                await deleteNote(note._id); 
                                props.showAlert("Note deleted successfully", 'success');
                            }}></i>
                        </div>
                    </div>
                    <p className="card-text">{note.description}</p>
                    <p className="card-text">{note.tag}</p>
                    <p className="card-text text-primary" >{new Date(note.date).toGMTString()}</p>
                </div>
            </div>
        </div>
    )
}

export default NoteItem
