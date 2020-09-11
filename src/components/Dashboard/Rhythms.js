import React from 'react';
import Letters  from './Letters';
import useRhythm from 'util/hooks/useRhythm';

const Rhythms = () => {
  const beat = useRhythm('beats');
  const tatum = useRhythm('tatums');
  const bar = useRhythm('bars');
  
  return(
    <React.Fragment>
      <group position-y={-0.2} position-x={-3.2}>
        <Letters 
          text='Bar'
          position={{x:0.1, y:0.5}}
          confidence={bar} 
          confidence_position={{x: -0.83, y: -0.25}}
        />
        
        <Letters 
          text='Beat'
          position={{x:0, y:0}}
          confidence={beat} 
          confidence_position={{x: -1.06, y: -0.25}}
        />

        <Letters 
          text='Tatum'
          position={{x:0.05, y:-0.5}}
          confidence={tatum} 
          confidence_position={{x: -1.42, y: -0.25}}
        />
      </group>
    </React.Fragment>
  )
}

export default Rhythms;