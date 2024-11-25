import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../../context/notes/noteContext';
import NoteItem from './NoteItem';
import Addnote from './Addnote';
import { jwtDecode } from 'jwt-decode';
import { history } from '../History';

const Notes = (props) => {
    const context = useContext(noteContext);
    const { notes, fetchNotes, updateNote } = context;
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });

    const modalStyle = {
        background: '#f7f5f9',
        borderRadius: '15px',
    };

    const modalHeaderStyle = {
        backgroundColor: '#e1bee7',
        color: '#4a148c',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
    };

    const formLabelStyle = {
        fontSize: '1rem',
        color: '#4a148c',
    };

    const formControlStyle = {
        borderRadius: '10px',
        border: '1px solid #ddd',
        padding: '12px',
        fontSize: '1rem',
    };

    const modalFooterStyle = {
        justifyContent: 'space-between',
        padding: '15px 25px',
    };

    const modalButtonSecondaryStyle = {
        backgroundColor: '#f1f1f1',
        color: '#6a4c93',
        borderRadius: '30px',
    };

    const modalButtonPrimaryStyle = {
        backgroundColor: '#6a4c93',
        color: 'white',
        borderRadius: '30px',
    };

    const modalButtonPrimaryDisabledStyle = {
        backgroundColor: '#d1c9e5',
        color: '#888',
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            if (jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
                props.showAlert("Session expired Login again", 'danger', 10109);
                history.navigate("/login");
            } else {
                fetchNotes(props);
            }
        }
        else {
            history.navigate("/login");
        }
    }, [])

    const editNote = (currentNote) => {
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
    }

    const ref = useRef(null);
    const refClose = useRef(null);

    const handleClick = async (e) => {
        e.preventDefault();
        if (jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
            props.showAlert("Session expired Login again", 'danger', 10110);
            history.navigate("/login");
            return;
        }
        await updateNote(note.id, note.etitle, note.edescription, note.etag);
        props.showAlert("Notes updated successfully", "success", 10111);
        refClose.current.click();
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    return (
        <>
            <Addnote showAlert={props.showAlert} />
            <button type="button" className="btn" ref={ref} hidden={true} data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content" style={modalStyle}>
                        <div className="modal-header" style={modalHeaderStyle}>
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label" style={formLabelStyle}>Title</label>
                                    <input
                                        type="text"
                                        value={note.etitle}
                                        className="form-control"
                                        id="etitle"
                                        name="etitle"
                                        onChange={onChange}
                                        style={formControlStyle}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label" style={formLabelStyle}>Description</label>
                                    <input
                                        type="text"
                                        value={note.edescription}
                                        className="form-control"
                                        id="edescription"
                                        name="edescription"
                                        onChange={onChange}
                                        style={formControlStyle}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label" style={formLabelStyle}>Tag</label>
                                    <input
                                        type="text"
                                        value={note.etag}
                                        className="form-control"
                                        id="etag"
                                        name="etag"
                                        onChange={onChange}
                                        style={formControlStyle}
                                    />
                                </div>
                                <div className="modal-footer" style={modalFooterStyle}>
                                    <button type="button" className="btn btn-secondary" ref={refClose} data-bs-dismiss="modal" style={modalButtonSecondaryStyle}>Close</button>
                                    <button type="submit" disabled={note.etitle.length < 5 || note.edescription.length < 5} onClick={handleClick} className="btn btn-primary" style={note.etitle.length < 5 || note.edescription.length < 5 ? modalButtonPrimaryDisabledStyle : modalButtonPrimaryStyle}>Update Note</button>
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
                {notes.length > 0 && notes.map((note) => {
                    return (
                        <NoteItem showAlert={props.showAlert} key={note.id} editNote={editNote} note={note}/>
                    );
                })}
            </div>
        </>
    );
}

export default Notes;
