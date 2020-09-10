import React, { Suspense } from 'react';
import { Text, MeshWobbleMaterial, useTextureLoader, Plane, Line } from "drei";
import * as THREE from 'three';
import { useStore } from 'util/hooks/useStore';
import { toMinutes } from 'util/common';

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
      {track && !track.error &&     
      <Suspense fallback={null}>
        <Image 
          img={track.album.images[0].url}
        />
        <Text
          font="https://fonts.gstatic.com/s/merriweather/v21/u-4l0qyriQwlOrhSvowK_l5-eR7NWMf8.woff"
          fontSize={0.3}
          color='#111111'
          anchorX='left'
          anchorY='top'
          position={[-3.3, 2.3, 0]}>
          {track.artists[0].name}
        </Text>
        <Text
          font="https://fonts.gstatic.com/s/merriweather/v21/u-4l0qyriQwlOrhSvowK_l5-eR7NWMf8.woff"
          fontSize={0.2}
          anchorX='left'
          anchorY='top'
          color={track.explicit ? 'red' : '#111111'}
          position={[-3.3, 1.95, 0]}>
          {track.name + '(' + track.popularity + '/100)'}
        </Text>
        <Text
          font="https://fonts.gstatic.com/s/merriweather/v21/u-4l0qyriQwlOrhSvowK_l5-eR7NWMf8.woff"
          fontSize={0.2}
          anchorX='left'
          anchorY='top'
          color='#111111'
          position={[-3.3, 1.7, 0]}>
          {track.album.name + ' (' + track.album.release_date.split('-')[0] + ')'}
        </Text>
        <Text
          font="https://fonts.gstatic.com/s/merriweather/v21/u-4l0qyriQwlOrhSvowK_l5-eR7NWMf8.woff"
          fontSize={0.2}
          anchorX='left'
          anchorY='top'
          color='#111111'
          position={[-3.3, 1.45, 0]}>
          {toMinutes(progress)}
        </Text>
        <Text
          font="https://fonts.gstatic.com/s/merriweather/v21/u-4l0qyriQwlOrhSvowK_l5-eR7NWMf8.woff"
          fontSize={0.2}
          anchorX='left'
          anchorY='top'
          color='#111111'
          position={[3.9, 1.45, 0]}>
          {toMinutes(track.duration_ms - progress)}
        </Text>
        <Line color="#ae0001" position={[-2.74, 1.22, 0.5]} points={[[(6.47*(progress/track.duration_ms)).toFixed(2),0,0],[(6.47*(progress/track.duration_ms)).toFixed(2),0.15,0]]}  linewidth={0.5}/>
        {analysis && 
          analysis.sections.map((section, key) => {
            return (
              <Plane args={[6.5*section.duration/track.duration_ms, 0.15]} position-y={1.3} position-x={-2.75 + 6.5*(section.start + section.duration/2)/track.duration_ms} key={key}>
                <meshBasicMaterial attach="material"  color={key%2===0 ? '#e1f7d5' : '#f1cbff'}/>
              </Plane>
            )
          })
          
        }
        
      </Suspense>}
    </React.Fragment>
  )
}

export default Info;