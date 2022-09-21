import React,{useContext, useEffect, useState} from 'react'
import Player from "./Players";
import FormTyping from "./FormTyping";
import { socketContext } from '..';
import Swal from 'sweetalert2';
import { quotesArray} from './data';


function TypingBoard({username,otherUsername,otherId,textIndex}) {
  const socket = useContext(socketContext);
  const [playerValue, setPlayerValue] = useState(0);
  const [otherPlayerValue, setOtherPlayerValue] = useState(0);
  const [isFinished, setIsFinished] = useState(true);
  const [winner, setWinner] = useState("");

  const [text, setText] = useState(quotesArray[textIndex].quote.split(" "));
  const [textLength, setTextLength] = useState(quotesArray[textIndex].length);

  useEffect(()=>{
    // update the other player value
    socket.on('play',(res)=>{
        setOtherPlayerValue(res);
    })
    return () => {
        socket.off('play');
    }
  },[])
 
  // if any one player reaches the end of the word,
  // wins the game
  useEffect(()=>{
    if(playerValue===textLength){
        setIsFinished(true)
        setWinner(username);
        Swal.fire({title:username+" wins",icon:"success"});
    }else if(otherPlayerValue===textLength){
        setIsFinished(true)
        setWinner(otherUsername);
        Swal.fire({title:otherUsername+" wins",icon:"success"});
    }
  },[otherPlayerValue,playerValue,otherUsername,username])

  return (
    <>
        <ScreenTimer setIsFinished={setIsFinished}/>
        {/* current player */}
        <Player 
          username={username} 
          playerValue={playerValue}
          color="w3-green" 
          textLength={textLength}/>
        {/* other player */}
        <Player 
          username={otherUsername} 
          playerValue={otherPlayerValue} 
          color="w3-red"
          textLength={textLength}/>
        {/* form typing */}
        <FormTyping 
          winner={winner} 
          isFinished={isFinished} 
          text={text} 
          textLength={textLength}
          playerValue={playerValue} 
          otherId={otherId} 
          setPlayerValue={setPlayerValue}/>
    </>
  )
}

const ScreenTimer = ({setIsFinished}) => {
  const [counter, setCounter] = useState(5);
  const [hide, setHide] = useState("grid");
  useEffect(()=>{
    const t = setInterval(()=>{
      setCounter(prev=>prev-1);
    },1000);
    if(counter===0){
        setIsFinished(false);
        setHide("none");
        clearInterval(t);
    }
    return ()=>{
      clearInterval(t);
    }
  },[counter]);
  return (
    <div className='screen_timer' style={{display:hide}}>
    <p> Match starts in {counter}</p>
    </div>
  );
}

export default TypingBoard