import React, { useContext, useEffect, useRef, useState } from 'react'
import { Tooltip } from "react-tooltip";
import noteContext from '../../context/notes/noteContext';
import NoteItem from './NoteItem';
import Addnote from './Addnote';
import { history } from '../History';
import SortNSerh from '../Utils/SortNSearch/SortNSerh';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth_state/authContext';

const Notes = (props) => {
    history.navigate = useNavigate();
    const { userState } = useContext(AuthContext);
    const context = useContext(noteContext);
    const { notes, fetchNotes, updateNote, sort, searchNote } = context;
    const [draggable, setDraggable] = useState(false);
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });

    const sortingList = [
        { name: 'None', nested: [{name: 'None', type: 'NONE'}] },
        { name: 'Title', nested: [{ name: 'A-Z', type: 'T_ASCE'}, { name: 'Z-A', type: 'T_DESC'}] },
        { name: 'Description', nested: [{ name: 'A-Z', type: 'D_ASCE'}, { name: 'Z-A', type: 'D_DESC'}] },
        { name: 'Tag', nested: [{ name: 'A-Z', type: 'TG_ASCE'}, { name: 'Z-A', type: 'TG_DESC'}] },
        { name: 'Date', nested: [{ name: 'Older', type: 'DATE_ASCE'}, { name: 'Latest', type: 'DATE_DESC'}] },
        { name: 'Length', nested: [{ name: 'Length', type: 'LEN'},] },
    ];

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
        if (!userState.loggedIn) {
            history.navigate("/");
            return;
        } else {
            fetchNotes(props);
        }
    }, [userState])

    const editNote = (currentNote) => {
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
    }

    const ref = useRef(null);
    const refClose = useRef(null);

    const handleClick = async (e) => {
        e.preventDefault();
        await updateNote(note.id, note.etitle, note.edescription, note.etag);
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
                <div className='col-md-6'>
                    <div className="d-flex align-items-center justify-content-start">
                        <h2 className=''>Your Notes</h2>
                        <i className="fa-solid fa-grip mx-3" id='layout' onClick={() => {setDraggable(!draggable)}}></i>
                        {draggable && <p className='m-0 mx-3'>(Warning: Not works with mobile phones)</p>}
                        <Tooltip anchorId="layout" content={`Change layout to ${draggable ? 'Normal' : 'Draggable'}`} place="top" />
                    </div>
                    <div className='container mx-2'>
                        {notes.length === 0 && "No Notes to display"}
                    </div>
                </div>
                <SortNSerh sortingList={sortingList} sort={sort} search={searchNote}/>
                {notes.length > 0 && notes.map((note) => {
                    return (
                        <NoteItem showAlert={props.showAlert} key={note._id} editNote={editNote} note={note} draggable={draggable} />
                    );
                })}
            </div>
        </>
    );
}

export default Notes;
