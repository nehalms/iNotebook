import React from 'react'
import Notes from './Notes';
import { useNavigate } from 'react-router-dom';
import { history } from '../History';

const Home = (props) => {

  history.navigate = useNavigate();

  return (
    <div>
      <Notes showAlert={props.showAlert} setLoader={props.setLoader}/>
    </div>
  )
}

export default Home;
