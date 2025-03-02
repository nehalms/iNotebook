import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Confirmation(props) {
  return (
    <Dialog sx={{}} open={props.open} onClose={props.onClose}>
        <DialogTitle className='text-center'><i className="fas fa-question-circle mx-2" style={{color: '#74C0FC'}}></i>{props.title}</DialogTitle>
        <DialogContent>
            <DialogContentText className='text-dark'>
                Are you sure you want to perform this action?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button className='border' onClick={props.onClose}>Cancel</Button>
            <Button className={`bg-${props.color ? props.color : 'danger'} text-light`} onClick={props.onConfirm} >
                Confirm
            </Button>
        </DialogActions>
    </Dialog>
  )
}
