import React, { useState, useEffect, useRef } from 'react';
import { Text } from 'drei';
import { useFrame } from 'react-three-fiber';
import { font, color } from './theme';

const Letters = ({ text, position, confidence, confidence_position }) => {
  const [change, setChange] = useState(false);
  const groupRef = useRef();
  const counter = useRef();

  useFrame(() => {
    if (change){
      groupRef.current.position.z = 0.1*Math.sin(counter.current);
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
    <group ref={groupRef} scale={[0.5, 0.5, 0.5]} position-x={position.x} position-y={position.y}>
      <Text
        font={font}
        color={color.font}
        fontSize={1}
      >
      {text}
      </Text> 
      <group rotation-z={Math.PI/2-0.1} position-x={confidence_position.x} position-y={confidence_position.y}>
        {'confidence'.split('').map((a,k) => 
          <Text color={(k+1)*0.1 < confidence ? color.font : color.gray } position-x={k*0.05} key={k}>{a}</Text>
        )}
      </group>
    </group>
  )
}

export default Letters;