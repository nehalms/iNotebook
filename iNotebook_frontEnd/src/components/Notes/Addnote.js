import React, { useContext, useState, useRef } from 'react'
import noteContext from '../../context/notes/noteContext';
import { jwtDecode } from 'jwt-decode';
import { history } from '../History';

const Addnote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context;
    const [note, setNote] = useState({ title: "", description: "", tag: "" });
    const addNoteRefClose = useRef(null);

    const modalStyle = {
        borderRadius: '15px',
        backgroundColor: '#f9f9f9',
    };

    const modalHeaderStyle = {
        backgroundColor: '#3498db',
        color: 'white',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
        padding: '15px',
    };

    const formLabelStyle = {
        fontSize: '1rem',
        color: '#111',
    };

    const formControlStyle = {
        borderRadius: '8px',
        border: '1px solid #ddd',
        padding: '12px',
        fontSize: '1rem',
        marginBottom: '10px',
    };

    const modalFooterStyle = {
        justifyContent: 'space-between',
        padding: '15px 25px',
    };

    const modalButtonSecondaryStyle = {
        backgroundColor: '#f1f1f1',
        color: '#3498db',
        borderRadius: '30px',
    };

    const modalButtonPrimaryStyle = {
        backgroundColor: '#3498db',
        color: 'white',
        borderRadius: '30px',
        border: '1px solid black',
        padding: '6px 12px',
    };

    const modalButtonPrimaryDisabledStyle = {
        backgroundColor: '#3498db',
        color: '#fff',
        borderRadius: '30px',
        border: '1px solid black',
        padding: '6px 12px',
    };

    const handleClick = async (e) => {
        e.preventDefault();
        if (jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
            props.showAlert("Session expired Login again", 'danger');
            history.navigate("/login");
            return;
        }
        await addNote(note.title, note.description, note.tag);
        props.showAlert("Note added successfully", 'success');
        setNote({ title: "", description: "", tag: "" });
        addNoteRefClose.current.click();
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    return (
        <div>
            <button
                className="bg-success p-3 text-white border rounded-pill"
                type="button"
                style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1 }}
                data-bs-toggle="modal"
                data-bs-target="#addNoteModal"
            >
                <i className="fa-solid fa-plus me-2"></i> Add Note
            </button>

            <div className="modal fade" id="addNoteModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content" style={modalStyle}>
                        <div className="modal-header" style={modalHeaderStyle}>
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label" style={formLabelStyle}>Title</label>
                                    <input
                                        type="text"
                                        value={note.title}
                                        className="form-control"
                                        id="title"
                                        name="title"
                                        onChange={onChange}
                                        placeholder="At least 5 characters"
                                        style={formControlStyle}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label" style={formLabelStyle}>Description</label>
                                    <input
                                        type="text"
                                        value={note.description}
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        onChange={onChange}
                                        placeholder="At least 5 characters"
                                        style={formControlStyle}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label" style={formLabelStyle}>Tag</label>
                                    <input
                                        type="text"
                                        value={note.tag}
                                        className="form-control"
                                        id="tag"
                                        name="tag"
                                        onChange={onChange}
                                        style={formControlStyle}
                                    />
                                </div>
                                <div className="modal-footer" style={modalFooterStyle}>
                                    <button type="button" className="btn btn-secondary" ref={addNoteRefClose} data-bs-dismiss="modal" style={modalButtonSecondaryStyle}>Close</button>
                                    <button
                                        type="submit"
                                        disabled={note.title.length < 5 || note.description.length < 5}
                                        onClick={handleClick}
                                        className="btn btn-primary"
                                        style={note.title.length < 5 || note.description.length < 5 ? modalButtonPrimaryDisabledStyle : modalButtonPrimaryStyle}
                                    >
                                        <i className="fa-solid fa-plus me-2"></i>Add Note
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Addnote;
