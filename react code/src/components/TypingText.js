import React from 'react'

function TypingText({text,currentIndex,isError,textRef}) {
  return (
    <div 
      className='w3-padding-medium w3-xlarge' 
      style={{paddingBlock:"15px",wordWrap:"break-word"}}>

        {text.map((item,index)=>(
          <span 
            key={index} 
            className={`${currentIndex===index?isError?"errorHighlight":"highlight":""}`}
            ref={(el)=>{textRef.current[index]=el}}>
            {item}
          </span>
        ))}
        
    </div>
  )
}

export default TypingText

