import React, { useState, useRef, useEffect, useContext} from 'react'
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './FrInRow.css'
import connect4 from './images/connect4.png'
import { history } from '../History';
import AuthContext from '../../context/auth_state/authContext';

const ROWS = 7;
const COLS = 7;

export default function FrInRow(props) {

  const socket = new SockJS(process.env.REACT_APP_C4_SOCKET_URL);
  const [board, setBoard] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
  const detailsDiv = useRef();
  const [height, setHeight] = useState();
  const [copied, setCopied] = useState(false);
  const [connected, setconnect] = useState(false);
  const [player, setPlayer] = useState('');
  const [currTurn, setTurn] = useState('X')
  const [gameComp, setComp] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [secondClk, setSecondClk] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const { userState, handleSessionExpiry } = useContext(AuthContext);
  const [gameToken, setToken] = useState("");
  const [roomDetails, setRoomDetails] = useState({
    id: '',
    joined: false,
  })
  const [userstats, setStats] = useState({
    id: '',
    name: '',
    played: 0, 
    won: 0,
    lost: 0,
  });
  const [oppStats, setOppStats] = useState({
    id: '',
    name: "Searching...",
    played: 0,
  });
  
useEffect(() => {
    if (!userState.loggedIn) {
      history.navigate("/");
      return;
    }
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      
      stompClient.subscribe(`/topic/oppPlayerDetails/${roomDetails.id}`, (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          let player = userstats.id === data.player1.userId ? data.player2 : data.player1
          props.showAlert(`${player.name} joined the game`, 'info', 10068) 
          setOppStats({
            id: player.userId,
            name: player.name,
            played: player.gamesPlayed,
          });
          setBoard(data.board);
        }
      });

      stompClient.subscribe(`/topic/updatedGame/${roomDetails.id}`, (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          setBoard(data.board);
          setTurn(data.turn);
          if(data.status === "FINISHED") {
            saveGameData(data);
            getPlayerData();
          }
        }
      });

      stompClient.subscribe(`/topic/resetGame/${roomDetails.id}`, (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          if(data && data.board && data.player1 && data.player2){
            setBoard(data.board);
            setTurn(data.turn);
            setComp(false);
            setPlayer(userstats.id === data.userIdX ? 'X' : 'O');
            if(userstats.id === data.userIdX && sessionStorage.getItem('color') === 'yellow') {  
              setSelectedColor('red');
              sessionStorage.setItem('color', 'red');
            } else if(userstats.id === data.userIdO && sessionStorage.getItem('color') === 'red') {
              setSelectedColor('yellow');
              sessionStorage.setItem('color', 'yellow');
            } 
            sessionStorage.getItem('color') && setSelectedColor(sessionStorage.getItem('color'));
            let player = userstats.id === data.player1.userId ? data.player2 : data.player1
            setOppStats({
              id: player.userId,
              name: player.name,
              played: player.gamesPlayed,
            });
          }
        }
      });
    });

    if (!detailsDiv.current) return;
    getPlayerData();

    const resizeObserver = new ResizeObserver(() => {
      detailsDiv && setHeight(detailsDiv.current.offsetHeight);
    });
    resizeObserver.observe(detailsDiv.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [roomDetails.id, player, userState]); 

  const getPlayerData = async () => {
    try { 
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/game/getStats`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });
      const json = await response.json();
      setToken(json.authToken);
      const data = json.stats;
      if(data && data.frnRowStats) {
        setStats({
          id: data.userId,
          name: data.userName,
          played: data.frnRowStats.played,
          won: data.frnRowStats.won,
          loss: data.frnRowStats.lost,
        });
        if(sessionStorage.getItem('roomId')) {
          await getGameStatus(data, json.authToken);
        }
      }
      if(!data.success){
        handleSessionExpiry(data);
        props.showAlert(data.error, 'danger', 10069);
      }
    } catch (err) {
      console.log('Error** ', err);
      props.showAlert("Some Error Occured", "danger", 10070);
    }
  }

  const getGameStatus = async (user, token = null) => {
    try { 
      if(!sessionStorage.getItem('roomId') || connected) {
        return;
      }
      props.setLoader({ showLoader: true, msg: "Checking for the previous game..."});
      const response = await fetch(`${process.env.REACT_APP_C4_BOOTSTRAP_URL}/game/getStatus?gameId=${sessionStorage.getItem('roomId')}`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "authToken": token ? token : gameToken,
        },
        body: JSON.stringify({
          userId: user.userId,
          name: user.userName,
          gamesPlayed: user.frnRowStats.played,
        })
      });
      const data = await response.json();
      if(data.statusCode == 400 || data.statusCode == 500) {
        return;
      }
      if(data) {
        setconnect(true);
        setRoomDetails({id: data.gameId, joined: true});
        setBoard(data.board);
        setTurn(data.turn);
        setComp(false);
        setSelectedColor(sessionStorage.getItem('color'));
        setPlayer(user.userId === data.userIdX ? 'X' : 'O');
        let player = user.userId === data.player1.userId ? data.player2 : data.player1
        if(player) {
          setOppStats({
            id: player.userId,
            name: player.name,
            played: player.gamesPlayed,
          });
        }
        props.showAlert("Status Restored", 'success', 10089);
        sessionStorage.setItem('roomId', data.gameId);
      }
    } catch (err) {
      console.log('Error** ', err);
      props.showAlert("Some Error Occured", "danger", 10087);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }
  
  const handleCreateRoom = async () => {
    try {
      props.setLoader({ showLoader: true, msg: "Creating room"});
      let response = await fetch(`${process.env.REACT_APP_C4_BOOTSTRAP_URL}/game/start`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "authToken": gameToken,
        },
        body: JSON.stringify({
          userId: userstats.id,
          name: userstats.name,
          gamesPlayed: userstats.played,
        })
      });
      let data = await response.json();
      if(data.statusCode == 400) {
        props.showAlert(data.message, 'info', 10071);
        return;
      }
      if(data) {
        setconnect(true);
        setRoomDetails({id: data.gameId, joined: true});
        setPlayer('X');
        setSelectedColor('red');
        sessionStorage.setItem('color', 'red');
        props.showAlert("Room created", 'success', 10072);
        sessionStorage.setItem('roomId', data.gameId);
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger', 10073);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }

  const handleJoinRoom = async () => {
    try {
      props.setLoader({ showLoader: true, msg: "Joining room"});
      let response = await fetch(`${process.env.REACT_APP_C4_BOOTSTRAP_URL}/game/connect?gameId=${roomId}`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "authToken": gameToken,
        },
        body: JSON.stringify({
          userId: userstats.id,
          name: userstats.name,
          gamesPlayed: userstats.played,
        })
      });
      let data = await response.json();
      if(data.statusCode == 400) {
        props.showAlert(data.message, 'info', 10074);
        return;
      }
      if(data) {
        setconnect(true);
        setBoard(data.board);
        setRoomDetails({id: data.gameId, joined: true});
        setPlayer('O');
        setSelectedColor('yellow');
        sessionStorage.setItem('color', 'yellow');
        props.showAlert(`Joined ${data.player1.name} 's room`, 'success', 10075);
        sessionStorage.setItem('roomId', data.gameId);
        setOppStats({
          id: data.player1.userId,
          name: data.player1.name,
          played: data.player1.gamesPlayed,
        });
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger', 10076);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }

  const handleClick = async (col) => {
    if(gameComp) {
      return;
    }
    if(player != currTurn) {
      props.showAlert("Opponent player turn", 'warning', 10077);
      return;
    }
    if(secondClk === true) {
      return;
    }
    
    let row_;
    let col_;
    setSecondClk(true);
    const newBoard = board.map(row => [...row]);
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = currTurn === 'X' ? 1 : currTurn === 'O' ? 2 : 0;
        row_ = row;
        col_ = col;
        setBoard(newBoard);
        break;
      }
    }
    
    try {
      let response = await fetch(`${process.env.REACT_APP_C4_BOOTSTRAP_URL}/game/gameplay`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "authToken": gameToken,
        },
        body: JSON.stringify({
          type: player,
          gameId: roomDetails.id,
          coordinateX: row_,
          coordinateY: col_,
        })
      });
      let data = await response.json();
      if(data.statusCode == 400) {
        props.showAlert(data.message, 'info', 10078);
        return;
      }
      if(data) {
        // setBoard(data.board);
        setTurn(data.turn);
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger', 10079);
    } finally {
      setSecondClk(false);
      props.setLoader({ showLoader: false });
    }
    return;
  };

  const saveGameData = async (data) => {
    try { 
      setComp(true);
      if(data.winner != 'DRAW') {
        let idxs = data.winnerIdxs
        const newBoard = data.board;
        idxs.map((idx) => {
          let val = idx.split(":");
          newBoard[parseInt(val[0])][parseInt(val[1])] = data.board[parseInt(val[0])][parseInt(val[1])] === 1 ? 10 : 20;
          setBoard(newBoard);
        });
        if((data.winner === 'X' && data.userIdX === userstats.id) || (data.winner === 'O' && data.userIdO === userstats.id)) {
          props.showAlert("You won the game", 'success', 10080);
        } else {
          props.showAlert("You lost the game", 'danger', 10081);
        }
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger', 10082);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }

  const handleReset = async () => {
    try {
      let response = await fetch(`${process.env.REACT_APP_C4_BOOTSTRAP_URL}/game/reset?gameId=${roomDetails.id}`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "authToken": gameToken,
        },
      });
      let data = await response.json();
      if(data.statusCode == 400) {
        props.showAlert(data.message, 'info', 10083);
        return;
      }
      if(data) {
        setBoard(data.board);
        setTurn(data.turn);
        setComp(false);
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger', 10084);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }

  const renderSquare = (row, col) => {
    const isFilled = board[row][col];
    const color =
      isFilled === 1
        ? ( player === 'X' ? selectedColor : 'red')
        : isFilled === 2
        ? ( player === 'O' ? selectedColor : 'yellow')
        : isFilled === 10
        ? `repeating-linear-gradient(45deg, ${( player === 'X' ? selectedColor : 'red')}, ${( player === 'X' ? selectedColor : 'red')} 10px, #ccc 5px, #fff 15px)`
        : isFilled === 20
        ? `repeating-linear-gradient(45deg, ${( player === 'O' ? selectedColor : 'yellow')}, ${( player === 'O' ? selectedColor : 'yellow')} 10px, #ccc 5px, #fff 15px)`
        : 'white' ;
  
    return (
      <div
        className="_square_"
        onClick={() => handleClick(col)}
        style={{ background: 'white' }}
      >
        {isFilled ? (
          <div
            className="_pawn_"
            style={{ background: color }}
          ></div>
        ) : ''}
      </div>
    );
  };

  return (
    <div className="row">
      <div className="col-lg-5 my-1 p-3 text-center">
        <div className="card shadow-lg p-3 d-flex flex-column ">
          <h3>Four in a Row (Connect 4)</h3>
        </div>
      </div>
      <div className="col-lg-7 my-1 p-3 text-center">
        <div className="card shadow-lg py-3 px-2 d-flex flex-row align-items-center justify-content-center">
          <div style={{width: '75%'}}>
            <label htmlFor="roomId">Room Id:</label>
            <input className='p-1 mx-2' type="text" name="roomId" id="roomId" style={{display: 'inline', width: '65%'}} onChange={(e) => {setRoomId(e.target.value)}} autoComplete='none'/>
          </div>
          <button role='button' className="btn btn-info p-1 px-3 ms-1" onClick={handleJoinRoom}>Join</button>
        </div>
      </div>

      <div className='col-lg-5 my-1'>
        <div className="card shadow-lg p-3 d-flex flex-column" ref={detailsDiv}>
          <p className="p-1" style={{WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}><i className="fa-solid fa-circle mx-2" style={{color: connected ? "#63E6BE" : "#e66565"}}></i>{connected ? <span>Connected to server (Room id: <strong>{roomDetails.id}</strong>) <p className='ms-1 p-1 border rounded' style={{display: 'inline'}} onClick={() => {setCopied(true); navigator.clipboard.writeText(roomDetails.id);}}>{copied ? <>copied<i className="mx-1 fa-solid fa-check"></i></> : <>copy<i className="mx-1 fa-regular fa-copy"></i></>}</p></span>  : <span>Not connected to server</span>}</p>
          <div className='text-center bg-danger-subtle p-2 border rounded'><h4 className='m-0'>Opponent stats</h4></div>
          <div className="p-2 border rounded mt-1 d-flex flex-column">
            <div className="mt-1 d-flex align-items-center justify-content-between">
              <div className="p-2 me-1">
                <h6 className="m-0 p-1">Player Name : </h6>
              </div>
              <div className="p-2 border rounded">
                <h6 className="m-0 p-1">{oppStats.name}</h6>
              </div>
            </div>
            <div className="mt-1 d-flex justify-content-between">
              <div className="p-2 me-1">
                <h6 className="m-0 p-1">Games Played : </h6>
              </div>
              <div className="p-2 border rounded">
                <h6 className="m-0 p-1">{oppStats.played}</h6>
              </div>
            </div>
          </div>
          <div className='text-center bg-info-subtle p-2 mt-3 border rounded'><h4 className='m-0'>{`Games stats${userstats && userstats.name != "" ? " (" + userstats.name + ")" : ""}`}</h4></div>
          <div className="p-2 border rounded mt-1 d-flex flex-column">
            <div className="mt-1 d-flex align-items-center justify-content-between">
              <div className="p-2 me-1">
                <h6 className="m-0 p-1">Games Played : </h6>
              </div>
              <div className="p-2 border rounded">
                <h6 className="m-0 p-1">{userstats.played}</h6>
              </div>
            </div>
            <div className="mt-1 d-flex justify-content-between">
              <div className="p-2 me-1">
                <h6 className="m-0 p-1">Games Won : </h6>
              </div>
              <div className="p-2 border rounded">
                <h6 className="m-0 p-1">{userstats.won}</h6>
              </div>
            </div>
            <div className="mt-1 d-flex align-items-center justify-content-between">
              <div className="p-2 me-1">
                <h6 className="m-0 p-1">Games Lost : </h6>
              </div>
              <div className="p-2 border rounded">
                <h6 className="m-0 p-1">{userstats.loss}</h6>
              </div>
            </div>
          </div>
          <button role='button' className="btn btn-warning mt-3" onClick={handleReset}>New Game<i className="fa-regular fa-window-restore mx-1"></i></button>
        </div>
      </div>
      <div className="col-lg-7 my-1">
        <div className="card shadow-lg p-3 bg-black" style={{height: 'auto'}} >
          <div className='text-center bg-black'>
            { player && player != '' ? 
             <>
              <div className="_board_">
                {board && board.map((row, rowIndex) => (
                  <div key={rowIndex} className="_row_">
                    {row.map((_, colIndex) => renderSquare(rowIndex, colIndex))}
                  </div>
                ))}
              </div> 
             </> :
              <div className='p-3 m-0 bg-white rounded border'>
                <img src={connect4} alt="Connnect 4" style={{ width: '50%', height: '50%'}}/>
                <h5 className='m-0 my-3'>The goal of the game Four in a Row, also known as Connect 4, is to be the first player to connect four of their colored discs in a row, either horizontally, vertically, or diagonally</h5>
                <button className="btn btn-success py-2 m-1" style={{width: '80%'}} onClick={handleCreateRoom} disabled={gameToken == ""}>Create Room</button>
              </div>
            }
          </div>
        </div>
      </div>
      <div className="col-lg my-1">
        <div className="card shadow-lg p-3" style={{height: 'auto'}} >
          <div className='d-flex flex-wrap align-items-center justify-content-around'>
            <h4 className='p-3 m-0 border rounded bg-warning-subtle'>Choose your color</h4>
            <div className='m-3 mb-0 d-flex flex-wrap align-items-center justify-content-center'>
              { player &&  
                (
                  player === 'X' ?
                  <div className='m-1 _selColor_' style={{backgroundColor: 'red', borderRadius: '50%'}} onClick={() => {setSelectedColor('red'); sessionStorage.setItem('color', 'red');}}></div> :
                  <div className='m-1 _selColor_' style={{backgroundColor: 'yellow', borderRadius: '50%'}} onClick={() => {setSelectedColor('yellow'); sessionStorage.setItem('color', 'yellow');}}></div>
                )
              }
              <div className='m-1 _selColor_' style={{backgroundColor: 'green', borderRadius: '50%'}} onClick={() => {setSelectedColor('green'); sessionStorage.setItem('color', 'green');}}></div>
              <div className='m-1 _selColor_' style={{backgroundColor: 'blue', borderRadius: '50%'}} onClick={() => {setSelectedColor('blue'); sessionStorage.setItem('color', 'blue');}}></div>
              <div className='m-1 _selColor_' style={{backgroundColor: 'orange', borderRadius: '50%'}} onClick={() => {setSelectedColor('orange'); sessionStorage.setItem('color', 'orange');}}></div>
              <div className='m-1 _selColor_' style={{backgroundColor: 'cyan', borderRadius: '50%'}} onClick={() => {setSelectedColor('cyan'); sessionStorage.setItem('color', 'cyan');}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
