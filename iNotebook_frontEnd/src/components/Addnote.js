import React, {useContext, useState} from 'react'
import noteContext from '../context/notes/noteContext';

const Addnote = (props) => {
    const context = useContext(noteContext);
    const {addNote} = context;
    const [note, setNote] = useState({title: "", description: "", tag: ""})

    const handleClick = (e)=> {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        props.showAlert("Note added successfully", 'success');
        setNote({title: "", description: "", tag: ""})
    }

    const onChange = (e)=> {
        setNote({...note, [e.target.name]: e.target.value}) //helps to keep data in note as same and append the new values being typed
    }

    return (
        <div>
            <div className="container my-2">
                <h2>Add Note</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" autoComplete='on' value={note.title} className="form-control" id="title" name="title" onChange={onChange} placeholder='Minimum 5 Characters' />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" autoComplete='on' value={note.description} className="form-control" id="description" name="description" onChange={onChange} placeholder='Minimum 5 Characters'/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" autoComplete='on' value={note.tag} className="form-control" id="tag" name="tag" onChange={onChange}/>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={note.title.length < 5 || note.description.length < 5} onClick={handleClick}>
                    <i className="fa-solid fa-plus me-2"></i>ADD</button>
                </form>
            </div>
        </div>
    )
}

export default Addnote
