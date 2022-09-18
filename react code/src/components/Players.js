import React from 'react'

function Player({playerValue,username,color,textLength}) {
  return (
    <div style={{paddingBlock:"15px"}}>
          <p className='textCapital'><b>{username}</b> </p>
          <div className="w3-white w3-border w3-round-xlarge">
            <div 
              className={`w3-container ${color} w3-center w3-round-xlarge`}
              style={{width:parseInt((playerValue*100)/textLength)+"%"}}>
                {parseInt((playerValue*100)/textLength)}%
            </div>
          </div>
    </div>
  )
}

export default Player