import React, { Suspense } from 'react';
import { Text, MeshWobbleMaterial, useTextureLoader, Plane, Line, Circle } from "drei";
import * as THREE from 'three';
import { useStore } from 'util/hooks/useStore';
import { toMinutes } from 'util/common';
import { font, color } from './theme';

function Image({ img }) {
  const texture = useTextureLoader(img)
  return (
    <Plane args={[1, 1]} position-x={-3.9} position-y={1.7}>
      <MeshWobbleMaterial attach="material" map={texture} side={THREE.DoubleSide}/>
    </Plane>
  )
}

const Info = () => {
  const track = useStore(state => state.track);
  const progress = useStore(state => state.progress);
  const analysis = useStore(state => state.analysis);

  return(
    <React.Fragment>
      {
        track && !track.error &&  
        <group position-y={-0.15} position-x={0.1}>   
          <Suspense fallback={null}>
            <Image 
              img={track.album.images[0].url}
            />
          </Suspense>
          <Text
            font={font}
            fontSize={0.3}
            color={color.black}
            anchorX='left'
            anchorY='top'
            position={[-3.3, 2.3, 0]}>
            {track.artists[0].name}
          </Text>
          <Text
            font={font}
            fontSize={0.2}
            anchorX='left'
            anchorY='top'
            color={track.explicit ? color.red : color.black}
            position={[-3.3, 1.95, 0]}>
            {track.name}
          </Text>
          <Text
            font={font}
            fontSize={0.2}
            anchorX='left'
            anchorY='top'
            color={color.black}
            position={[-3.3, 1.7, 0]}>
            {track.album.name + ' (' + track.album.release_date.split('-')[0] + ')'}
          </Text>
          <Text
            font={font}
            fontSize={0.2}
            anchorX='left'
            anchorY='top'
            color={color.black}
            position={[-3.3, 1.45, 0]}>
            {toMinutes(progress)}
          </Text>
          <Text
            font={font}
            fontSize={0.2}
            anchorX='left'
            anchorY='top'
            color={color.black}
            position={[3.9, 1.45, 0]}>
            {toMinutes(track.duration_ms - progress)}
          </Text>
          <Line color={color.black} position={[-2.74, 1.22, 0.5]} points={[[(6.47*(progress/track.duration_ms)).toFixed(2),0,0],[(6.47*(progress/track.duration_ms)).toFixed(2),0.15,0]]}  linewidth={0.5}/>
          {
            analysis && 
            <React.Fragment>
              {
                analysis.sections.map((section, key) => {
                  return (
                    <Plane args={[6.5*section.duration/track.duration_ms, 0.15]} position-y={1.3} position-x={-2.75 + 6.5*(section.start + section.duration/2)/track.duration_ms} key={key}>
                      <meshBasicMaterial attach="material"  color={key%2===0 ? color.orange : color.red}/>
                    </Plane>
                  )
                })
              }
              <Circle args={[0.05, 3]} rotation-z={Math.PI} position-x={-2.77 + 6.5*analysis.track.end_of_fade_in/track.duration_ms} position-y={1.18}>
                <meshBasicMaterial attach="material" color={color.gray}/>
              </Circle>
              <Circle args={[0.05, 3]} rotation-z={0} position-x={-2.73 + 6.5*analysis.track.start_of_fade_out/track.duration_ms} position-y={1.18}>
                <meshBasicMaterial attach="material" color={color.gray}/>
              </Circle>
            </React.Fragment>
          }
        </group>
      }
    </React.Fragment>
  )
}

export default Info;