import React from 'react';

const Popup = (props) => {
    return (
        <div className='m-0 ms-2' style={styles.popup}>
            <div className='d-flex align-items-center justify-content between'>
                <p className='m-0'>Are you sure?</p>
                <div className='d-flex align-items-center justify-content between ms-3'>
                    <i className="fa-solid fa-circle-xmark" style={styles.icon_wrong} onClick={props.onCancel}></i>
                    <i className="fa-solid fa-square-check" style={styles.icon_tick} onClick={props.onConfirm}></i>
                </div>
            </div>
        </div>
    );
};

const styles = {
    popup: {
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: '8px',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
    },
    icon_tick: {
        fontSize: '24px',
        margin: '0 5px',
        cursor: 'pointer',
        color: '#6edb00'
    },
    icon_wrong: {
        fontSize: '24px',
        margin: '0 5px',
        cursor: 'pointer',
        color: '#ff0000'
    },
};

export default Popup;
