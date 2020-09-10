import React, { Suspense } from 'react';
import { Text, MeshWobbleMaterial, useTextureLoader, Plane } from "drei";
import * as THREE from 'three';
import { useStore } from 'util/hooks/useStore';
import { toMinutes } from 'util/common';

function Image({ img }) {
  const texture = useTextureLoader(img)
  return (
    <Plane args={[1, 1, 16, 16]} position-x={-4.1} position-y={1.7}>
      <MeshWobbleMaterial attach="material" map={texture} side={THREE.DoubleSide}/>
    </Plane>
  )
}

const Info = () => {
  const track = useStore(state => state.track);
  const progress = useStore(state => state.progress);

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
          factor={0.1}
          color='#111111'
          anchorX='left'
          anchorY='top'
          position={[-3.5, 2.3, 0]}>
          {track.artists[0].name}
        </Text>
        <Text
          font="https://fonts.gstatic.com/s/merriweather/v21/u-4l0qyriQwlOrhSvowK_l5-eR7NWMf8.woff"
          fontSize={0.2}
          anchorX='left'
          anchorY='top'
          color={track.explicit ? 'red' : '#111111'}
          position={[-3.5, 1.95, 0]}>
          {track.name + '(' + track.popularity + '/100)'}
        </Text>
        <Text
          font="https://fonts.gstatic.com/s/merriweather/v21/u-4l0qyriQwlOrhSvowK_l5-eR7NWMf8.woff"
          fontSize={0.2}
          anchorX='left'
          anchorY='top'
          color='#111111'
          position={[-3.5, 1.7, 0]}>
          {track.album.name + ' (' + track.album.release_date.split('-')[0] + ')'}
        </Text>
        <Text
          font="https://fonts.gstatic.com/s/merriweather/v21/u-4l0qyriQwlOrhSvowK_l5-eR7NWMf8.woff"
          fontSize={0.3}
          anchorX='left'
          anchorY='top'
          color='#111111'
          position={[-3.5, 1.5, 0]}>
          {toMinutes(progress)}
        </Text>
      </Suspense>}
    </React.Fragment>
  )
}

export default Info;