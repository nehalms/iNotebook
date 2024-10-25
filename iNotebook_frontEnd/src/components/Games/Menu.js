import React from 'react'
import { history } from '../History';
import { useNavigate } from 'react-router-dom';

export default function Menu(props) {
    history.navigate = useNavigate();

    return (
    <div>
      <div className='row my-2'>
        <div className='col-lg-3'>
          <div className="card shadow-lg my-3 SaveNotes__left-right" onClick={() => {history.navigate('/games/tictactoe')}}>
            <div className="card-body">
                <h5 className='text-center'>Tic-Tac-Toe</h5>
            </div>
          </div>
        </div>
        <div className='col-lg-3'>
          <div className="card shadow-lg my-3 ImagesEdit__left-right" onClick={() => {props.showAlert("Under development", 'info')}}>
            <div className="card-body">
                <h5 className='text-center'>4 in a row</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
