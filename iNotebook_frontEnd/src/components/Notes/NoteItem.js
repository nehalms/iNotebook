import React, { useContext, useState } from 'react'
import noteContext from '../../context/notes/noteContext';
import {jwtDecode} from 'jwt-decode';
import Popup from '../Utils/Popup';
import { history } from '../History';

const NoteItem = (props) => {
    const context = useContext(noteContext);
    const {note, editNote, draggable} = props;
    const [position, setPosition] = useState({x: note.xPos, y: note.yPos});
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const {deleteNote, fetchNotes} = context;
    const [showPopup, setShowPopup] = useState(false);

    const onCancel = () => {
        setShowPopup(false);
        return;
    }

    const handleDragStart = (e) => {
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleDrag = (e) => {
        setPosition({
            x: e.clientX < 40 ? 40 : e.clientX - offset.x,
            y: e.clientY < 100 ? 100 : e.clientY - offset.y,
        });
    };

    const handleDragEnd = (e) => {
        let x = e.clientX < 40 ? 40 : e.clientX - offset.x
        let y = e.clientY < 150 ? 150 : e.clientY - offset.y
        setPosition({x: x, y: y});
        saveCordinates(x, y, e.target.id);
    };

    const saveCordinates = (x, y, id) => {
        try {
            fetch(`${process.env.REACT_APP_BASE_URL}/notes/saveCord/${id}/${x}/${y}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: 'include',
            });
            fetchNotes();
            return;
        } catch (err) {
            console.log("Error**", err);
        }
    }

    const onConfirm = async () => {
        setShowPopup(false);
        await deleteNote(note._id); 
        return;
    }

    return (
        <div className='col-md-4'
            id={note._id}
            draggable={draggable}
            onDragStart={handleDragStart}
            onDrag={handleDrag} 
            onDragEnd={handleDragEnd}
            style={ draggable ? {
                position: 'absolute',
                left: position.x < 40 ? 40 : position.x,
                top: position.y < 150 ? 150 : position.y,
                cursor: "move",
                userSelect: "none",
            } : undefined }
        >
            <div className="card shadow-lg my-3">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between my-1">
                        <h5 className="card-title my-0">{note.title}</h5>
                        { showPopup && 
                            <div>
                                <Popup onCancel={onCancel} onConfirm={onConfirm}/>
                            </div>
                        }
                        { !showPopup && 
                            <div>
                                <i className="fa-regular fa-pen-to-square mx-2 text-secondary" onClick={() => {editNote(note)}}></i>
                                <i className="fa-solid fa-trash mx-2 text-danger" onClick={() => {setShowPopup(true)}}></i>
                            </div>
                        }
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
