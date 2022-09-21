import { useEffect, useRef,useState } from "react"

function Form({input,handleKeyDown,isFinished}) {
  const inputRef = useRef();
  useEffect(()=>{
    inputRef.current.focus();
  },[isFinished])
  return (
    <div 
      className='w3-padding-large w3-xlarge' 
      style={{display:"flex",justifyContent:"space-around"}}>
        <input type="text" 
          readOnly={isFinished}
          ref={inputRef}
          style={{width:"70%"}} 
          onChange={handleKeyDown} 
          value={input} 
          className='w3-input w3-border'/>
        <button 
          onClick={()=>document.location.reload()} 
          className='w3-button w3-round-large w3-border w3-green w3-hover-dark-green'>
            New Game
        </button>
        {/* <TypingTimer /> */}
    </div>
  )
}

const TypingTimer = () => {
  const [counter, setCounter] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=>{
      setCounter(prev=>prev+1);
    },1000);
    if(counter===30){
        clearInterval(t);
    }
    return ()=>{
      clearInterval(t);
    }
  },[counter]);
  return <button className="w3-btn w3-border w3-hover-none" style={{cursor:"default"}}>
          {counter}  
        </button>;
}

export default Form