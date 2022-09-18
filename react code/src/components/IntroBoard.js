import React, { useContext,useEffect, useRef, useState } from 'react'
import { socketContext } from '..'
import Swal from "sweetalert2";
import Loader from './Loader/Loader';

function IntroBoard({setUser,username,setUsername,setOtherUsername,setOtherId,join,setJoin,setTextIndex}) {

  const socket = useContext(socketContext);
  const [gameId,setGameId] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [joinGameLoading, setJoinGameLoading] = useState(false);
  const inputRef = useRef();

  useEffect(()=>{
    // check if the socket is connect, then move to other page
    socket.on("connect", () => {
        setJoinLoading(false);
        const transport = socket.io.engine.transport.name; // in most cases, "polling"
        socket.io.engine.on("upgrade", () => {
            const upgradedTransport = socket.io.engine.transport.name; // in most cases, "websocket"
        });
        console.log(transport);
        console.log('iam connected')
        setJoin(true);
    });
    socket.on('error',(res)=>{
        setJoinLoading(false);
        setJoinGameLoading(false);
        setCreateLoading(false);
        Swal.fire({
            title : "error",
            text : res.message,
            icon: "error"
        })
    })
    // create a game id
    socket.on('create',(res)=>{
        console.log(res);
        setCreateLoading(false);
        setGameId(res.gameId);
        setWaiting(true);
        setTextIndex(res.randomTextIndex);
        console.log(res.randomTextIndex);   
    });
    // join the game via the gameid
    socket.on('join',(res)=>{
        setJoinGameLoading(false);
        let index = res.players.indexOf(socket.id)===0?1:0;
        setTextIndex(res.textIndex);
        setOtherId(res.players[index])
        setOtherUsername(res.username[index]);
        setUser(true);
        console.log(res);
    })

    return ()=>{
      socket.off('connect');
      socket.off('create');
      socket.off('join');
      socket.off('error');
    };
  },[])

//  focus on the input after the page has loaded
  useEffect(()=>{
    inputRef.current.focus();
  },[join])


  const createGame = () => {
    setCreateLoading(true);
     socket.emit('create',{clientId : socket.id});
  }
  const joinGame = () => {
    setJoinGameLoading(true);
    const payload = {
        clientId : socket.id,
        gameId : gameId,
        username : username
    }
    socket.emit('join',payload);
  }

  //   connect to the server with username
  const joinServer = () => {
    if(username===""||username.length<5){
        Swal.fire({
            title:"Username empty or length less than 5 character",
            icon:"error"
        });
        return;
    }
    setJoinLoading(true);
    socket.auth = {username};
    socket.connect();
  }

  return (
    <div className='w3-center' style={{width:'90%',height:"80vh",display:"grid",placeItems:"center",marginInline:"auto"}}>
        {/* 
        if the player has created the game id, it is waiting for player to join the match 
        */}
        {   
            waiting&&<div>
                <UsernameConnected username={username}/>
                <WaitingPlayer setUser={setUser} gameId={gameId}/>
                </div>
        }
        {/* if the player has not created gameid yet, show username input and create game input */}
        {
            !waiting&&
            <>
            {
                // if the user has connected to the server via entering the username, 
                // show the create game screen
                join&&
                <div>
                    <UsernameConnected username={username}/>
                    <CreateGame 
                        gameId={gameId} 
                        inputRef={inputRef}
                        setGameId={setGameId} 
                        joinGame={joinGame} 
                        createLoading={createLoading}
                        joinGameLoading={joinGameLoading}
                        createGame={createGame}/>
                </div>
            }
            {
                // if the user has not connected to the server via entering the username
                // show the enter username input screen
                !join&&
                <JoinServer 
                    inputRef={inputRef}
                    joinServer={joinServer}
                    joinLoading={joinLoading}
                    username={username} 
                    setUsername={setUsername}/>
            }
            </>
        }
        
    </div>
  )
}

// when a player is waiting for another player after creating the gameid
// he can share the gameid to another user and play the match
const WaitingPlayer = ({gameId}) => {
    const [copyText, setCopyText] = useState("copy");
    const copyToClipboard = () => {
        navigator.clipboard.writeText(gameId);
        setCopyText("copied");
    }
    return (
        <div className='w3-panel w3-green w3-padding-large w3-margin-'>
            <h3>Waiting for player</h3>
            <div className='w3-margin-top w3-margin-bottom'>
                <Loader />
            </div>
            <p>GameID : <b className='w3-margin-right'>{gameId}</b> <button onClick={copyToClipboard} className="w3-button w3-white w3-round" style={{cursor:'pointer'}}>{copyText}</button></p>
            <h3>Share the GameID with a friend and challenge them for a typing match. Happy Typing😁</h3>
        </div>
    );
}

// get the username from the input and join the player into the server via socket.io
const JoinServer = ({username,setUsername,joinServer,inputRef,joinLoading}) => {
    return (
        <form onSubmit={(e)=>e.preventDefault()} style={{display:'grid'}}>
            <input ref={inputRef} type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder='Enter username' className=' w3-margin-top w3-input w3-border w3-border-black w3-round'/>
            <button onClick={joinServer} disabled={joinLoading} className='w3-button w3-green w3-hover-dark-green w3-round w3-margin-top'>{joinLoading?"joining...":"Join Server"}</button>
        </form>
    );
}

// create gameid or join to a game id after creating a username
const CreateGame = ({gameId,setGameId,createGame,joinGame,inputRef,createLoading,joinGameLoading}) => 
{
    const [joinButton, setJoinButton] = useState(true);
    const [createButton, setCreateButton] = useState(false);
    useEffect(()=>{
        setJoinButton(!(gameId!==""))
        setCreateButton((gameId!==""))
    },[gameId])
    return (
        <div>
            <input ref={inputRef} type="text" value={gameId} onChange={(e)=>setGameId(e.target.value)} placeholder="Enter game id" className='w3-margin-top w3-input w3-border w3-border-black w3-round'/>
            <div className='w3-margin-top'>
                <button 
                    onClick={createGame} 
                    className='w3-button w3-red w3-hover-dark-red w3-margin-right w3-round' 
                    disabled={createButton||createLoading}>
                    {createLoading?"creating...":"Create GameId"}
                </button>
                <button onClick={joinGame} className='w3-button w3-green w3-hover-dark-green w3-round' disabled={joinButton||joinGameLoading}>{joinGameLoading?"joining...":"Join Game"}</button>
            </div>
        </div>
    );
}

export const UsernameConnected = ({username}) => {
    return <div className='w3-padding-large w3-border w3-round w3-center w3-pale-green'>
    <b className='textCapital'>{username}</b> is connected
  </div>
}



export default IntroBoard