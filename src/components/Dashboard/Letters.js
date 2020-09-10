import React, { useState, useEffect, useRef } from 'react';
import { Text } from 'drei';
import { useFrame } from 'react-three-fiber';

const Letters = ({ text, position, confidence, confidence_position }) => {
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
    <group ref={groupRef} scale={[0.5, 0.5, 0.5]} position-x={position.x} position-y={position.y}>
      <Text
        font='https://fonts.gstatic.com/s/merriweather/v21/u-4l0qyriQwlOrhSvowK_l5-eR7NWMf8.woff'
        color='#111111'
        fontSize={1}
      >
      {text}
      </Text> 
      <group rotation-z={Math.PI/2-0.1} position-x={confidence_position.x} position-y={confidence_position.y}>
        {'confidence'.split('').map((a,k) => 
          <Text color={(k+1)*0.1 < confidence ? '#111111' : 'gray'} position-x={k*0.05} key={k}>{a}</Text>
        )}
      </group>
    </group>
  )
}

export default Letters;