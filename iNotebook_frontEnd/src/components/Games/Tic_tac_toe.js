import React, { useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import tictactoe from './images/tic-tac-toe.jpg'

export default function Tic_tac_toe(props) {  
  const socket = new SockJS(process.env.REACT_APP_SOCKET_URL);
  const detailsDiv = useRef();
  const [height, setHeight] = useState();
  const [copied, setCopied] = useState(false);
  const [connected, setconnect] = useState(false);
  const [board, setBoard] = useState(Array(10).fill(null));
  const [player, setPlayer] = useState('');
  const [currTurn, setTurn] = useState('X')
  const [gameComp, setComp] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [secondClk, setSecondClk] = useState(false);
  const [vsBot, setVsBot] = useState(false);
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
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      
      stompClient.subscribe(`/topic/oppPlayerDetails/${roomDetails.id}`, (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          let player = userstats.id === data.player1.userId ? data.player2 : data.player1
          props.showAlert(`${player.name} joined the game`, 'info', 10085) 
          setOppStats({
            id: player.userId,
            name: player.name,
            played: player.gamesPlayed,
          });
          setBoardFunc(data.board);
        }
      });

      stompClient.subscribe(`/topic/updatedGame/${roomDetails.id}`, (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          setBoardFunc(data.board);
          setTurn(data.turn);
          if(data.status === "FINISHED") {
            saveGameData(data);
            getPlayerData();
          }
        }
      });

      stompClient.subscribe(`/topic/resetGame/${roomDetails.id}`, (message) => {
        if (message.body) {
          for(let i=1; i<=9; i++) {
            document.getElementById(i).style.backgroundColor = 'white';
          }
          const data = JSON.parse(message.body);
          if(data && data.board && data.player1 && data.player2){
            setBoardFunc(data.board);
            setTurn(data.turn);
            setComp(false);
            setPlayer(userstats.id === data.userIdX ? 'X' : 'O');
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
      setHeight(detailsDiv.current.offsetHeight);
    });
    resizeObserver.observe(detailsDiv.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [roomDetails.id, player]);

  const getPlayerData = async () => {
    try { 
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/game/getStats`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
      });
      const data = await response.json();
      if(data && data.tttStats) {
        setStats({
          id: data.userId,
          name: data.userName,
          played: data.tttStats.played,
          won: data.tttStats.won,
          loss: data.tttStats.lost,
        });
        if(sessionStorage.getItem('roomId')) {
          await getGameStatus(data);
        }
      }
      if(!data.success){
        props.showAlert(data.error, 'danger', 10086);
      }
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log('Error** ', err);
      props.showAlert("Some Error Occured", "danger", 10087);
    }
  }

  const getGameStatus = async (user) => {
    try { 
      if(!sessionStorage.getItem('roomId') || connected) {
        return;
      }
      const response = await fetch(`${process.env.REACT_APP_BOOTSTRAP_URL}/game/getStatus?gameId=${sessionStorage.getItem('roomId')}`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
        body: JSON.stringify({
          userId: user.userId,
          name: user.userName,
          gamesPlayed: user.tttStats.played,
        })
      });
      const data = await response.json();
      if(data.statusCode == 400) {
        return;
      }
      if(data) {
        setconnect(true);
        setRoomDetails({id: data.gameId, joined: true});
        setBoardFunc(data.board);
        setTurn(data.turn);
        setComp(false);
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
      props.setLoader({ showLoader: false });
      console.log('Error** ', err);
      props.showAlert("Some Error Occured", "danger", 10087);
    }
  }

  const handleCreateRoom = async () => {
    setVsBot(false);
    try {
      props.setLoader({ showLoader: true, msg: "Creating room"});
      let response = await fetch(`${process.env.REACT_APP_BOOTSTRAP_URL}/game/start`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
        body: JSON.stringify({
          userId: userstats.id,
          name: userstats.name,
          gamesPlayed: userstats.played,
        })
      });
      let data = await response.json();
      if(data.statusCode == 400) {
        props.showAlert(data.message, 'info', 10088);
        return;
      }
      if(data) {
        setconnect(true);
        setRoomDetails({id: data.gameId, joined: true});
        setPlayer('X');
        props.showAlert("Room created", 'success', 10089);
        sessionStorage.setItem('roomId', data.gameId);
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger', 10090);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }

  const handleJoinRoom = async () => {
    setVsBot(false);
    try {
      props.setLoader({ showLoader: true, msg: "Joining room"});
      let response = await fetch(`${process.env.REACT_APP_BOOTSTRAP_URL}/game/connect?gameId=${roomId}`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
        body: JSON.stringify({
          userId: userstats.id,
          name: userstats.name,
          gamesPlayed: userstats.played,
        })
      });
      let data = await response.json();
      if(data.statusCode == 400) {
        props.showAlert(data.message, 'info', 10091);
        return;
      }
      if(data) {
        setconnect(true);
        setBoardFunc(data.board);
        setRoomDetails({id: data.gameId, joined: true});
        setPlayer('O');
        props.showAlert(`Joined ${data.player1.name} 's room`, 'success', 10092);
        sessionStorage.setItem('roomId', data.gameId);
        setOppStats({
          id: data.player1.userId,
          name: data.player1.name,
          played: data.player1.gamesPlayed,
        });
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger', 10093);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }

  const handleClick = async (e) => {
    if(gameComp) {
      return;
    }
    if(player != currTurn) {
      props.showAlert("Opponent player turn", 'warning', 10094);
      return;
    }
    if(secondClk === true) {
      return;
    }
    if(!e.target.id) {
      return;
    }
    if(board[e.target.id-1] != null) {
      return;
    }
    setSecondClk(true);
    let row = e.target.getAttribute('row');
    let col = e.target.getAttribute('col');
    let newBoard = board;
    newBoard[3 * parseInt(row) + parseInt(col)] = currTurn;
    setBoard(newBoard);
    try {
      let response = await fetch(`${process.env.REACT_APP_BOOTSTRAP_URL}/game/gameplay${vsBot ? '/bot' : ''}`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
        body: JSON.stringify({
          type: player,
          gameId: roomDetails.id,
          coordinateX: row,
          coordinateY: col,
        })
      });
      let data = await response.json();
      if(data.statusCode == 400) {
        props.showAlert(data.message, 'info', 10095);
        return;
      }
      if(data) {
        // setBoardFunc(data.board);
        setTurn(data.turn);
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger', 10096);
    } finally {
      props.setLoader({ showLoader: false });
      setSecondClk(false);
    }
    return;
  }

  const saveGameData = async (data) => {
    try { 
      setComp(true);
      if(data.winner != 'DRAW')
      {
        let idxs = data.winnerIdxs
        document.getElementById(idxs[0]+1).style.backgroundColor = '#96fa7d';
        document.getElementById(idxs[1]+1).style.backgroundColor = '#96fa7d';
        document.getElementById(idxs[2]+1).style.backgroundColor = '#96fa7d';
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger', 10097);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }

  const handleReset = async () => {
    try {
      let response = await fetch(`${process.env.REACT_APP_BOOTSTRAP_URL}/game/reset?gameId=${roomDetails.id}`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
      });
      let data = await response.json();
      if(data.statusCode == 400) {
        props.showAlert(data.message, 'info', 10098);
        return;
      }
      if(data) {
        setBoardFunc(data.board);
        setTurn(data.turn);
        setComp(false);
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger', 10099);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }

  const handlePlayvsBot = async () => {
    setVsBot(true);
    try {
      props.setLoader({ showLoader: true, msg: "Creating room"});
      let response = await fetch(`${process.env.REACT_APP_BOOTSTRAP_URL}/game/create/bot`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
        body: JSON.stringify({
          userId: userstats.id,
          name: userstats.name,
          gamesPlayed: userstats.played,
        })
      });
      let data = await response.json();
      console.log(data);
      if(data.statusCode == 400) {
        props.showAlert(data.message, 'info', 10088);
        return;
      }
      if(data) {
        setPlayer('O');
        setconnect(true);
        setRoomDetails({id: data.gameId, joined: true});
        setTurn(data.turn);
        setBoardFunc(data.board);
        props.showAlert("Room created", 'success', 10089);
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger', 10090);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }

  const setBoardFunc = (board) => {
    let resBoard = [];
    for(let i=0; i<3; i++) {
      for(let j=0; j<3; j++) {
        resBoard.push(
          board[i][j] == 1 ? 'X'
            :board[i][j] == 2 ? 'O' 
            : null
        );
      }
    }
    setBoard(resBoard);
  }

  return (
    <div className="row">
      <div className="col-lg-5 my-1 p-3 text-center">
        <div className="card shadow-lg p-3 d-flex flex-column ">
          <h3>Tic - Tac - Toe</h3>
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
        <div className="card shadow-lg p-3 bg-secondary-subtle" style={{height: roomDetails.id ? height : 'auto'}} >
          <div className='border rounded text-center bg-secondary-subtle is-disabled'>
            {player && player !== '' && <h4 className='m-0'>You are player {player}</h4>}
            {player && player !== '' ? 
            <>
              <div className="pt-2 d-flex align-items-center justify-content-evenly" style={{height: height/3-(player && player !== '' ? 20 : 10)}}>
                <div id='1' row={0} col={0} className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                  <p className='m-0' style={{fontSize: '80px'}}>{board.at(0)}</p>
                </div>
                <div id='2' row={0} col={1} className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                  <p className='m-0' style={{fontSize: '80px'}}>{board.at(1)}</p>
                </div>
                <div id='3' row={0} col={2} className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                  <p className='m-0' style={{fontSize: '80px'}}>{board.at(2)}</p>
                </div>
              </div>
              <div className="pt-2 d-flex align-items-center justify-content-evenly" style={{height: height/3-(player && player !== '' ? 20 : 10)}}>
                <div id='4' row={1} col={0} className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                  <p className='m-0' style={{fontSize: '80px'}}>{board.at(3)}</p>
                </div>
                <div id='5' row={1} col={1} className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                  <p className='m-0' style={{fontSize: '80px'}}>{board.at(4)}</p>
                </div>
                <div id='6' row={1} col={2} className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                  <p className='m-0' style={{fontSize: '80px'}}>{board.at(5)}</p>
                </div>
              </div>
              <div className="pt-2 d-flex align-items-center justify-content-evenly" style={{height: height/3-(player && player !== '' ? 20 : 10)}}>
                <div id='7' row={2} col={0} className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                  <p className='m-0' style={{fontSize: '80px'}}>{board.at(6)}</p>
                </div>
                <div id='8' row={2} col={1} className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                  <p className='m-0' style={{fontSize: '80px'}}>{board.at(7)}</p>
                </div>
                <div id='9' row={2} col={2} className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                  <p className='m-0' style={{fontSize: '80px'}}>{board.at(8)}</p>
                </div>
              </div>
            </> : 
              <div className='p-3 m-0 bg-white rounded border'>
                <img src={tictactoe} alt="Connnect 4" style={{ width: '50%', height: '50%'}}/>
                <h5 className='m-0 my-5'>The objective of the game of tic-tac-toe is to be the first player to get three of their marks in a row, either horizontally, vertically, or diagonally</h5>
                <div className="d-flex align-items-center justify-content-around">
                  <button className="btn btn-success py-2 m-1" style={{width: '50%'}} onClick={handleCreateRoom}>Create Room</button>
                  <button className="btn btn-danger py-2 m-1" style={{width: '50%'}} onClick={handlePlayvsBot}>vs Computer</button>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

