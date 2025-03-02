import React, { useEffect, useContext } from 'react'
import { history } from '../History';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth_state/authContext';

export default function Menu(props) {
    history.navigate = useNavigate();
    const { userState } = useContext(AuthContext);

    const features = [
        { name: 'Tic-Tac-Toe', route: '/games/tictactoe', icon: 'fa-gamepad', color: '#4CAF50' },
        { name: 'Four in a Row (Connect4)', route: '/games/frinrow', icon: 'fa-gamepad', color: '#FF9800' },
    ];

    useEffect(() => {
      if (!userState.loggedIn) {
        history.navigate("/");
        return;
      }
    }, [])

    return (
        <div className='container my-4'>
          <div className="feature-grid">
            {
              features && features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                style={{ backgroundColor: feature.color }}
                onClick={() => history.navigate(feature.route)}
              >
                <i className={`fa ${feature.icon} feature-icon`}></i>
                <h5 className="feature-name">{feature.name}</h5>
              </div>
            ))}
          </div>
        </div>
    );
}
