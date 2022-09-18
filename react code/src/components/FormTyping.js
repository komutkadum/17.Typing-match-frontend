import React,{useContext, useRef, useState} from 'react'
import { socketContext } from '..';
import Form from './Form'
import TypingText from './TypingText'

function FormTyping({setPlayerValue,playerValue,otherId,isFinished,winner,text}) {
  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isError, setIsError] = useState(false);
  // storing all the reference
  const textRef = useRef([]);
  // get the context of the socket
  const socket = useContext(socketContext);
  // when a user type the word correctly
  // turn it into green else red to the current word
  const setTextComplete = (id,complete) => {
    if(complete){
      textRef.current[id].style.color = "#2ecc71";
      return;
    }
    textRef.current[id].style.color = "#e74c3c";
  }
  
  const handleKeyDown = (e) => {
    let tempPlayerValue = playerValue;
    let tempCurrentIndex = currentIndex;
    // copying the whole sentence
    const tempText = [...text];
    // for the value of the input
    let {value} = e.target;
    // for getting the current character type
    const {data} = e.nativeEvent;
    // temporary current text
    let tempCurrentText = tempText[tempCurrentIndex];
    
    // if a user press space
    if(data===' '){
      // when a user type the word correctly
      // turn it into green else red to the current word
      if(tempCurrentText===input){
        setTextComplete(tempCurrentIndex,true);
        // cheat program
        navigator.clipboard.writeText(tempText[tempCurrentIndex+1]);
        // increase the progress bar to complete the race
        setPlayerValue(prev=>prev+1);
        // after a space,go to next index word
        setCurrentIndex(prev=>prev+1);
        // send the value to user
        socket.emit('play',{otherId, value : tempPlayerValue+1});
      }
      // clear the input
      e.target.value = "";
    }else {
      // change input
      setInput(value);
      // create highlight if the word type till now is correct
      // red for wrong, green for correct
      tempCurrentText.slice(0,value.length)!==value?setIsError(true):setIsError(false);
    }  
  }

  return (
    <div className='w3-border w3-margin-top w3-white w3-round-xlarge w3-padding-small'>
        {
          (!isFinished||winner==="")&&<TypingText 
          text={text} 
          textRef={textRef} 
          isError={isError} 
          currentIndex={currentIndex}/>
        }
        {
          (isFinished&&winner!=="")&&
          <div className='w3-padding-large w3-pale-green w3-center textCapital'>
            <b>{winner}</b> wins the duel typing match.
          </div>
        }
        <Form 
          isFinished={isFinished} 
          handleKeyDown={handleKeyDown}/>
    </div>
  )
}



export default FormTyping