import React, { Component, useRef, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber';
import useRhythm from "./useRhythm";

export default function CubesScene(props) {

  const ref = useRef()

  const rhythm = useRhythm(props);

  useFrame(() => {

    if (rhythm.tempo_pulse)
      ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = 1.01;

    else{

      if (ref.current.scale.x >= 0.5)
        ref.current.scale.x = ref.current.scale.y = ref.current.scale.z -= 0.01;
    }

  });

  return (
    <mesh
      ref={ref}
      onClick={e => console.log('click')}
      onPointerOver={e => console.log('hover')}
      onPointerOut={e => console.log('unhover')}>
      <boxBufferGeometry attach="geometry" args={[5, 5, 5]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  )
}