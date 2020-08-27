import React from 'react';
import InstancedPoints from './InstancedPoints';

const Spheres = ({ track }) => {
  const max = track.analysis.tatums.length;
  const progress = track.progress;
	return(
    <group>
      <InstancedPoints 
        data={track.analysis.beats} 
        progress={progress}
        color='#00ff00'
        max={max}
        shift={1}
      />
      <pointLight position={[0, 5, 1]} args={['#ffffff', 1, 100]}/>
      <directionalLight 
        castShadow
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        position={[0, 5, 5]}
      />
      <InstancedPoints 
        data={track.analysis.bars} 
        progress={progress}
        color='#011efe'
        max={max}
        shift={-1}
      />
      <InstancedPoints 
        data={track.analysis.tatums} 
        progress={progress}
        color='#ff0000'
        shift={0}
        max={max}
      />
    </group>
  )
}

export default Spheres;