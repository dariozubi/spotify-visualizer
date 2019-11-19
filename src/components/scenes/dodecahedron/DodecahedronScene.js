import React from 'react';
import { Canvas, useThree, useFrame } from "react-three-fiber"
import { useDrag } from "react-use-gesture"
import { useSpring, a } from "react-spring/three"
import useRhythm from "../../util/useRhythm";

function Tempo(props) {
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width
  const [spring, set] = useSpring(() => ({
    scale: [0.5, 0.5, 0.5],
    position: props.position,
    rotation: [0, 0, 0],
    config: { mass: 5, friction: 50, tension: 100 }
  }))
  const bindDrag = useDrag(
    ({ offset: [x, y], vxvy: [vx, vy], down, ...props }) =>
      set({ position: [x / aspect, -y / aspect, 0], rotation: [y / aspect, x / aspect, 0] }),
    { pointerEvents: true }
  )

  const rhythm = useRhythm(props);

  useFrame(() => set({ scale: rhythm.tempo_pulse ? [0.9, 0.9, 0.9] : [0.7, 0.7, 0.7] }));

  

  return (
    <a.mesh {...spring} {...bindDrag()} castShadow>
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

  const rhythm = useRhythm(props);

  useFrame(() => set({ scale: rhythm.tatum_pulse ? [0.7, 0.7, 0.7] : [0.5, 0.5, 0.5] }));

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

  const rhythm = useRhythm(props);

  useFrame(() => set({ scale: rhythm.beat_pulse ? [0.7, 0.7, 0.7] : [0.5, 0.5, 0.5] }));

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

  const rhythm = useRhythm(props);

  useFrame(() => set({ scale: rhythm.section_pulse ? [0.7, 0.7, 0.7] : [0.5, 0.5, 0.5] }));

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

  const rhythm = useRhythm(props);

  useFrame(() => set({ scale: rhythm.segment_pulse ? [0.7, 0.7, 0.7] : [0.5, 0.5, 0.5] }));

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

  const rhythm = useRhythm(props);

  useFrame(() => set({ scale: rhythm.bar_pulse ? [0.7, 0.7, 0.7] : [0.5, 0.5, 0.5] }));

  return (
    <a.mesh {...spring} castShadow>
      <dodecahedronBufferGeometry attach="geometry" args={[1.4, 0]} />
      <meshNormalMaterial attach="material" />
    </a.mesh>
  )
}

export default function DodecahedronScene(props) {

  const track_analysis = props.track_analysis;
  const track_progress = props.track_progress;
  const active = props.active;
  const last_update = props.last_update;
  const setMainState = props.setMainState;

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
          active={active}
          track_analysis={track_analysis}
          track_progress={track_progress}
          last_update={last_update}
          setMainState={setMainState} />

        <Tatum
          position={[-2.5, 0, 0]}
          active={active}
          track_analysis={track_analysis}
          track_progress={track_progress}
          last_update={last_update}
          setMainState={setMainState} />

        <Beat
          position={[0, 2.5, 0]}
          active={active}
          track_analysis={track_analysis}
          track_progress={track_progress}
          last_update={last_update}
          setMainState={setMainState} />

        <Section
          position={[2.5, 0, 0]}
          active={active}
          track_analysis={track_analysis}
          track_progress={track_progress}
          last_update={last_update}
          setMainState={setMainState} />

        <Segment
          position={[-1., -2.5, 0]}
          active={active}
          track_analysis={track_analysis}
          track_progress={track_progress}
          last_update={last_update}
          setMainState={setMainState} />

        <Bar
          position={[1, -2.5, 0]}
          active={active}
          track_analysis={track_analysis}
          track_progress={track_progress}
          last_update={last_update}
          setMainState={setMainState} />
    </Canvas>
  )
}
