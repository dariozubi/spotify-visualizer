import React from 'react';
import { Canvas, useThree, useFrame } from "react-three-fiber"
import { useSpring, a } from "react-spring/three"

function Tempo(props) {
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width
  const [spring, set] = useSpring(() => ({
    scale: [0.5, 0.5, 0.5],
    position: props.position,
    rotation: [0, 0, 0],
    config: { mass: 5, friction: 50, tension: 100 }
  }))

  useFrame(() => set({ scale: props.track.tempo_pulse ? [0.9, 0.9, 0.9] : [0.7, 0.7, 0.7] }));

  return (
    <a.mesh {...spring} castShadow>
      <dodecahedronBufferGeometry attach="geometry" args={[1.4, 0]} />
      <meshNormalMaterial attach="material" />
    </a.mesh>
  )
}

function Section(props) {

  const [spring, set] = useSpring(() => ({
    scale: [0.5, 0.5, 0.5],
    position: props.position,
    rotation: [0, 0, 0],
    config: { mass: 5, friction: 50, tension: 100 }
  }));

  useFrame(() => set({ scale: props.track.section_pulse ? [0.7, 0.7, 0.7] : [0.5, 0.5, 0.5] }));

  return (
    <a.mesh {...spring} castShadow>
      <dodecahedronBufferGeometry attach="geometry" args={[1.4, 0]} />
      <meshNormalMaterial attach="material" />
    </a.mesh>
  )
}


function Tatum(props) {

  const [spring, set] = useSpring(() => ({
    scale: [0.5, 0.5, 0.5],
    position: props.position,
    rotation: [0, 0, 0],
    config: { mass: 5, friction: 50, tension: 100 }
  }));

  useFrame(() => set({ scale: props.track.tatum_pulse ? [0.7, 0.7, 0.7] : [0.5, 0.5, 0.5] }));

  return (
    <a.mesh {...spring} castShadow>
      <dodecahedronBufferGeometry attach="geometry" args={[1.4, 0]} />
      <meshNormalMaterial attach="material" />
    </a.mesh>
  )
}

function Beat(props) {

  const [spring, set] = useSpring(() => ({
    scale: [0.5, 0.5, 0.5],
    position: props.position,
    rotation: [0, 0, 0],
    config: { mass: 5, friction: 50, tension: 100 }
  }));

  useFrame(() => set({ scale: props.track.beat_pulse ? [0.7, 0.7, 0.7] : [0.5, 0.5, 0.5] }));

  return (
    <a.mesh {...spring} castShadow>
      <dodecahedronBufferGeometry attach="geometry" args={[1.4, 0]} />
      <meshNormalMaterial attach="material" />
    </a.mesh>
  )
}


function Segment(props) {

  const [spring, set] = useSpring(() => ({
    scale: [0.5, 0.5, 0.5],
    position: props.position,
    rotation: [0, 0, 0],
    config: { mass: 5, friction: 50, tension: 100 }
  }));

  useFrame(() => set({ scale: props.track.segment_pulse ? [0.7, 0.7, 0.7] : [0.5, 0.5, 0.5] }));

  return (
    <a.mesh {...spring} castShadow>
      <dodecahedronBufferGeometry attach="geometry" args={[1.4, 0]} />
      <meshNormalMaterial attach="material" />
    </a.mesh>
  )
}

function Bar(props) {

  const [spring, set] = useSpring(() => ({
    scale: [0.5, 0.5, 0.5],
    position: props.position,
    rotation: [0, 0, 0],
    config: { mass: 5, friction: 50, tension: 100 }
  }));

  useFrame(() => set({ scale: props.track.bar_pulse ? [0.7, 0.7, 0.7] : [0.5, 0.5, 0.5] }));

  return (
    <a.mesh {...spring} castShadow>
      <dodecahedronBufferGeometry attach="geometry" args={[1.4, 0]} />
      <meshNormalMaterial attach="material" />
    </a.mesh>
  )
}

export default function DodecahedronScene(props) {

  const track = props.track;
  const active = props.active;


  return (
    <Canvas 
      style={{ background: "lightblue" }} 
      shadowMap 
      camera={{ position: [0, 0, 5] }}>

        <ambientLight intensity={0.5} />

        <spotLight
          intensity={0.6}
          position={[20, 10, 10]}
          angle={0.2}
          penumbra={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow />
          
        <mesh receiveShadow>
          <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
          <meshPhongMaterial attach="material" color="#272727" />
        </mesh>

        <Tempo
          position={[0, 0, 0]}
          track={track} />

        <Section
          position={[2.5, 0, 0]}
          track={track} />

        <Tatum
          position={[-2.5, 0, 0]}
          track={track} />

        <Beat
          position={[0, 2.5, 0]}
          track={track} />

        <Segment
          position={[1.5, -2.5, 0]}
          track={track} />

        <Bar
          position={[-1.5, -2.5, 0]}
          track={track} />
    </Canvas>
  )
}
