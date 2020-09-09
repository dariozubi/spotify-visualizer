import React, { useState, useEffect, useRef } from 'react';
import { Text } from 'drei';
import { useFrame } from 'react-three-fiber';
import useRhythm from 'util/hooks/useRhythm';
import useSection from 'util/hooks/useSection';
import useSegment from 'util/hooks/useSegment';

const Letters = ({ text, color, position, confidence, confidence_position, base_scale }) => {
  const [change, setChange] = useState(false);
  const groupRef = useRef();
  const counter = useRef();

  useFrame(() => {
    if (change){
      groupRef.current.position.z = Math.sin(counter.current);
      counter.current += 0.1;
      if (counter.current > Math.PI/2){
        setChange(false);
        counter.current = 0;
      }
    }
  });

  useEffect(() => {
    setChange(true);
    counter.current = 0;
  }, [confidence])

  return(
    <group ref={groupRef} scale={[base_scale, base_scale, base_scale]} position-x={position.x} position-y={position.y}>
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

const Rhythms = () => {
  const beat = useRhythm('beats');
  const tatum = useRhythm('tatums');
  const bar = useRhythm('bars');
  const { confidence: section } = useSection();
  const { confidence: segment } = useSegment();

  return(
    <group>
        <Letters 
        text='Section'
        color='#111111' 
        position={{x:-3.5, y:0.8}}
        confidence={section} 
        confidence_position={{x: -1.78, y: -0.25}}
        base_scale={0.5}
      />

      <Letters 
        text='Bar'
        color='#111111' 
        position={{x:-4, y:0.3}}
        confidence={bar} 
        confidence_position={{x: -0.83, y: -0.25}}
        base_scale={0.5}
      />
      
      <Letters 
      text='Beat'
      color='#111111' 
      position={{x:-3.9, y:-0.2}}
      confidence={beat} 
      confidence_position={{x: -1.06, y: -0.25}}
      base_scale={0.5}
    />

    <Letters 
      text='Tatum'
      color='#111111' 
      position={{x:-3.65, y:-0.7}}
      confidence={tatum} 
      confidence_position={{x: -1.42, y: -0.25}}
      base_scale={0.5}
    />

    <Letters 
      text='Segment'
      color='#111111' 
      position={{x:-3.4, y:-1.2}}
      confidence={segment} 
      confidence_position={{x: -2.12, y: -0.25}}
      base_scale={0.5}
    />
    </group>
  )
}

export default Rhythms;