import React, { useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client";
import { socket_ } from '../Socket';
socket_.connection = io(process.env.REACT_APP_BASE_URL.substring(0, process.env.REACT_APP_BASE_URL.length - 4));

export default function Tic_tac_toe(props) {  
  const [socket, setSocket] = useState(socket_.connection);
  const detailsDiv = useRef();
  const [height, setHeight] = useState();
  const [currTurn, setTurn] = useState('X')
  const [connected, setconnect] = useState(false);
  const [player, setPlayer] = useState('');
  const [board, setBoard] = useState(Array(10).fill(null));
  const [gameComp, setComp] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [roomDetails, setRoomDetails] = useState({
    id: '',
    joined: false,
  })
  const [userstats, setStats] = useState({
    name: '',
    played: 0, 
    won: 0,
    lost: 0,
  });
  const [oppStats, setOppStats] = useState({
    name: "Searching...",
    played: 0,
  });

  useEffect(() => {
    if (!detailsDiv.current) return;
    getPlayer();

    socket.on("connect", () => {
      props.showAlert("Connect to server", 'success');
      setconnect(true);
    });

    socket.on("playerName", (data) => {
      props.showAlert(`you are player ${data.player}`, 'success');
      setPlayer(data.player);
      setRoomDetails({
        id: data.id,
        joined: true,
      });
      if(data.board) {
        setBoard(data.board);
      }
      if(data.currTurn && data.currTurn !== '') {
        setTurn(data.currTurn);
      }
    });

    socket.on("opponent", (data) => {
      setOppStats({
        name: data.name,
        played: data.played,
      });
    });

    socket.on("msg", (msg) => {
      props.showAlert(msg, 'info');
    });

    socket.on("moveMade", (data) => {
      setBoard(data.board);
      setTurn(data.currTurn);
    });

    socket.on("gameOver", (data) => {
      setComp(data.comp);
      saveGameData(data.nums[0]);
      document.getElementById(data.nums[0]+1).style.backgroundColor = '#96fa7d';
      document.getElementById(data.nums[1]+1).style.backgroundColor = '#96fa7d';
      document.getElementById(data.nums[2]+1).style.backgroundColor = '#96fa7d';
    });

    socket.on("gameReset", (data) => {
      setBoard(data.newGame);
      setTurn('X');
      setComp(false);
      for(let i=1; i<=9; i++) {
        document.getElementById(i).style.backgroundColor = 'white';
      }
    });
    
    socket.on("error", (error) => {
      props.showAlert(error, 'danger');
      console.error("WebSocket connection error:", error);
    });

    socket.on("disconnect", () => {
      setconnect(false);
    });

    const resizeObserver = new ResizeObserver(() => {
      setHeight(detailsDiv.current.offsetHeight);
    });
    resizeObserver.observe(detailsDiv.current);
    return () => {
      socket.off("moveMade");
      socket.off("gameReset");
      socket.off("gameOver");
      socket.off("error");
      socket.off("disconnect");
      resizeObserver.disconnect();
    };
  }, []);

  const getPlayer = async () => {
    try { 
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/game/tictactoe`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
      });
      const data = await response.json();
      if(data && data.tttStats) {
        setStats({
          name: data.userName,
          played: data.tttStats.played,
          won: data.tttStats.won,
          loss: data.tttStats.lost,
        })
      }
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log('Error** ', err);
      props.showAlert("Some Error Occured", "danger");
    }
  }

  const saveGameData = async (idx) => {
    try { 
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/game/tttsave?won=${board[idx] === player}`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
      });
      const data = await response.json();
      if(data) {
        getPlayer();
      }
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log('Error** ', err);
      props.showAlert("Some Error Occured", "danger");
    }
  }

  const handleClick = (e) => {
    if(gameComp) {
      return;
    }
    if(player != currTurn) {
      props.showAlert("Opponent player turn", 'warning');
      return;
    }
    if(!e.target.id) {
      return;
    }
    if(board[e.target.id-1] == null) {
      let board_ = board;
      board_.splice(e.target.id-1, 1, currTurn);
      setBoard(board_);
      calculateWinner();
      setTurn(player == 'X' ? 'O' : 'X');
      let updatedGame = {
        id: roomDetails.joined ? roomDetails.id : '',
        board: board,
        currTurn: player == 'X' ? 'O' : 'X',
      }
      socket.emit("makeMove", updatedGame );
    }
    return;
  }

  const calculateWinner = () => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setComp(true);
        saveGameData(a);
        document.getElementById(a+1).style.backgroundColor = '#96fa7d';
        document.getElementById(b+1).style.backgroundColor = '#96fa7d';
        document.getElementById(c+1).style.backgroundColor = '#96fa7d';
        let data = {
          id: roomDetails.joined ? roomDetails.id : '',
          comp: true,
          nums: [a, b, c],  
        }
        socket.emit("gameOver", data);
        break;
      }
    }
  };

  const handleReset = () => {
    const newGame = Array(9).fill(null);
    let data = {
      newGame: newGame,
      id: roomDetails.joined ? roomDetails.id : '',
    }
    socket.emit("resetGame", data);
  }

  const handleJoin = () => {
    if(roomId == "" || roomId.length < 4) {
      props.showAlert("Room id should be atleast 4 digits", 'danger');
      return;
    }
    if(socket) {
      setconnect(true);
    }
    let userInfo = {
      id: roomId,
      name: userstats.name,
      played: userstats.played,
    }
    socket.emit("joinRoom", userInfo);
  }

  return (
    <div className="row">
      <div className="col-lg-5 my-1 p-3 text-center">
        <div className="card shadow-lg py-3 px-2 d-flex flex-row align-items-center justify-content-center">
          <div>
            <label htmlFor="roomId">Room Id:</label>
            <input className='p-1 mx-2' type="number" name="roomId" id="roomId" style={{display: 'inline', maxWidth: '150px'}} onChange={(e) => {setRoomId(e.target.value)}} autoComplete='none'/>
          </div>
          <button role='button' className="btn btn-success p-1 px-3 ms-4" onClick={handleJoin}>Join</button>
        </div>
      </div>
      <div className="col-lg-7 my-1 p-3 text-center">
        <div className="card shadow-lg p-3 d-flex flex-column">
          <h3>Tic - Tac - Toe</h3>
        </div>
      </div>

      <div className='col-lg-5 my-1'>
        <div className="card shadow-lg p-3 d-flex flex-column" ref={detailsDiv}>
          <p><i className="fa-solid fa-circle mx-2" style={{color: connected ? "#63E6BE" : "#e66565"}}></i>{connected ? `Connected to server (${roomDetails.joined ? `Room ID: ${roomDetails.id}` : 'join a room to play with friend'})` : "No connection to server"}</p>
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
        <div className="card shadow-lg p-3 bg-secondary-subtle" style={{height: height}} >
          <div className='border rounded text-center bg-secondary-subtle is-disabled'>
            {player && player !== '' && <h4 className='m-0'>You are player {player}</h4>}
            {player && player !== '' ? <><div className="pt-2 d-flex align-items-center justify-content-evenly" style={{height: height/3-(player && player !== '' ? 20 : 10)}}>
              <div id='1' className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                <p className='m-0' style={{fontSize: '80px'}}>{board.at(0)}</p>
              </div>
              <div id='2' className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                <p className='m-0' style={{fontSize: '80px'}}>{board.at(1)}</p>
              </div>
              <div id='3' className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                <p className='m-0' style={{fontSize: '80px'}}>{board.at(2)}</p>
              </div>
            </div>
            <div className="pt-2 d-flex align-items-center justify-content-evenly" style={{height: height/3-(player && player !== '' ? 20 : 10)}}>
              <div id='4' className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                <p className='m-0' style={{fontSize: '80px'}}>{board.at(3)}</p>
              </div>
              <div id='5' className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                <p className='m-0' style={{fontSize: '80px'}}>{board.at(4)}</p>
              </div>
              <div id='6' className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                <p className='m-0' style={{fontSize: '80px'}}>{board.at(5)}</p>
              </div>
            </div>
            <div className="pt-2 d-flex align-items-center justify-content-evenly" style={{height: height/3-(player && player !== '' ? 20 : 10)}}>
              <div id='7' className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                <p className='m-0' style={{fontSize: '80px'}}>{board.at(6)}</p>
              </div>
              <div id='8' className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                <p className='m-0' style={{fontSize: '80px'}}>{board.at(7)}</p>
              </div>
              <div id='9' className="shadow-lg btn m-1 border rounded text-center d-flex align-items-center justify-content-center" onClick={handleClick} style={{width: ((height/3)-10), height: '100%', backgroundColor: 'white'}}>
                <p className='m-0' style={{fontSize: '80px'}}>{board.at(8)}</p>
              </div>
            </div></>: <div className='p-3 m-0 bg-white rounded border'><h4>Both the players enter the same room id(randomly) to connect and play together</h4></div>}
          </div>
        </div>
      </div>
    </div>
  )
}

