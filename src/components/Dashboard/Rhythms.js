import React, { useState, useEffect } from 'react';
import { Text } from 'drei';

import useRhythm from '../../util/hooks/useRhythm';
import useSection from '../../util/hooks/useSection';

const Letters = ({ text, color, position, confidence, confidence_position, base_scale }) => {
  const [scale, setScale] = useState(base_scale);

  useEffect(() => {
    setScale(scale > base_scale ? base_scale : base_scale*1.1);
  }, [confidence, base_scale, scale])

  return(
    <group scale={[scale,scale,scale]} position-x={position.x} position-y={position.y}>
      <Text
        font='https://fonts.gstatic.com/s/merriweather/v21/u-4l0qyriQwlOrhSvowK_l5-eR7NWMf8.woff'
        color={color}
        fontSize={1}
      >
      {text}
      </Text>
      <group rotation-z={Math.PI/2-0.1} position-x={confidence_position.x} position-y={confidence_position.y}>
        {'confidence'.split('').map((a,k) => 
          <Text color={(k+1)*0.1 < confidence ? color : 'gray'} position-x={k*0.05} key={k}>{a}</Text>
        )}
      </group>
    </group>
  )
}

const Rhythms = ({ track }) => {
  const [timeSignature, setTimeSignature] = useState(4);
  const beat = useRhythm(track, 'beats');
  const tatum = useRhythm(track, 'tatums');
  const bar = useRhythm(track, 'bars');
  const section = useSection(track);

  useEffect(() => {
    setTimeSignature(section);
  }, [section])

  return(
    <group>
      <Letters 
        text='Bars'
        color='#111111' 
        position={{x:-4, y:0.8}}
        confidence={bar} 
        confidence_position={{x: -1.05, y: -0.25}}
        base_scale={0.5}
      />
      
      <Letters 
        text='Beats'
        color='#111111' 
        position={{x:-3.9, y:0.3}}
        confidence={beat} 
        confidence_position={{x: -1.28, y: -0.25}}
        base_scale={0.5}
      />

      <Letters 
        text='Tatums'
        color='#111111' 
        position={{x:-3.6, y:-0.2}}
        confidence={tatum} 
        confidence_position={{x: -1.65, y: -0.25}}
        base_scale={0.5}
      />
      <mesh>
        <circleBufferGeometry attach='geometry' args={[1,timeSignature]}/>
        <meshStandardMaterial attach='material'/>
      </mesh>
    </group>
  )
}

export default Rhythms;