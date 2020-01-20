import React, { useRef, useMemo, useState, useEffect } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useSpring, a } from 'react-spring/three'
import { Canvas, useRender, extend, useThree, useResource } from 'react-three-fiber'
import { useDrag } from 'react-use-gesture'
import * as THREE from 'three'

extend({ OrbitControls })
const Controls = props => {
  const { gl, camera } = useThree()
  const ref = useRef()
  useRender(() => ref.current.update())
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Particle({ geometry, material, track }){
  let ref = useRef();
  let t = Math.random() * 100;
  let size = 1000;
  let speed = 0.01 + Math.random() / 200;
  let factor = 20 + Math.random() * 100;
  let xFactor = -size + Math.random() * 2 * size;
  let yFactor = -size + Math.random() * 2 * size;
  let zFactor = -30 + Math.random() * size;

  useRender(() => {
    t += speed;
    const s = Math.cos(t);
    ref.current.scale.set(s/2, s/2, s/2);
    ref.current.position.set(
      xFactor + Math.cos((t / 30) * factor) + (Math.sin(t * 1) * factor) / 10,
      yFactor + Math.sin((t / 20) * factor) + (Math.cos(t * 2) * factor) / 10,
      zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 20
    )
  })
  return <mesh ref={ref} material={material} geometry={geometry} />
}

function Swarm(props){

  const [geometryRef, geometry] = useResource()
  const [materialRef, material] = useResource()

  const particles = new Array(2000).fill().map((_, index) => <Particle key={index} material={material} geometry={geometry} track={props.track}/>);

  return (
    <group>
      <sphereBufferGeometry ref={geometryRef} args={[1, 10, 10]} />
      <meshBasicMaterial ref={materialRef} args={[{color: 0xedaa28}]}/>
      {geometry && particles}
    </group>

  )
}

export default function FirefliesScene(props){

  const track = props.track;
  const active = props.active;

  return(

    <Canvas
      style={{ background: "black" }}
      camera={{fov: 45, position: [0,0,1000]}}>

      <Controls/>

      <Swarm track={track}/>

    </Canvas>

  )
}