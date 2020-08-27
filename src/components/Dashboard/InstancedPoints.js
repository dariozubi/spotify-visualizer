import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

const DEFAULT_COLOR = '#ffffff';
const scratchColor = new THREE.Color();
const max_instances = 5000;

const InstancedPoints = ({ data, progress, color, max, shift }) => {
  const ref = useRef();
  const colorAttrib = useRef();
  const colorArray = useMemo(() => new Float32Array(10000 * 3), []);

  useEffect(() => {
    let base = new THREE.Object3D();

    const mesh = ref.current;
    const cols = Math.ceil(Math.sqrt(data.length))
    const rows = cols;
    const scale = Math.sqrt(max/data.length) * 0.1
    const adjust = scale === 1 ? 0 : scale*0.5;

    for (let i=0; i<data.length; ++i){

      const x = (i%cols) - cols*0.5;
      const y = Math.floor(i/cols) - rows*0.5
      const size = data[i].confidence;

      base.position.set(scale*x + adjust, scale*y + adjust, shift*scale*0.5);
      base.scale.set(scale*size*0.5, scale*size*0.5, scale*size*0.5);

      base.updateMatrix();
      mesh.setMatrixAt(i, base.matrix);
    }

    for (let i=data.length; i<max_instances; ++i){
      base.position.set(i,i,i);
      base.scale.set(0,0,0);
      base.updateMatrix();
      mesh.setMatrixAt(i, base.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  }, [data, max, shift])

  useEffect(() => {
    let set = false;
    for (let i=max_instances-1; i>=0; --i){
      
      if (!set && i<data.length && data[i].start < progress){
        scratchColor.set(color);
        set = true;
      }
      else
        scratchColor.set(DEFAULT_COLOR);
      
      scratchColor.toArray(colorArray, i * 3);
    }
    colorAttrib.current.needsUpdate = true;
  }, [data, progress, colorArray, color]);

  return(
    <instancedMesh
      ref={ref} 
      args={[null,null,max_instances]}
      receiveShadow
      castShadow
    >
      <sphereBufferGeometry 
        attach="geometry"
        args={[1, 12, 12]}
      >
        <instancedBufferAttribute
          ref={colorAttrib}
          attachObject={['attributes', 'color']}
          args={[colorArray, 3]}
        />
      </sphereBufferGeometry>
      <meshPhysicalMaterial 
        attach="material" 
        vertexColors={true} 
        clearcoat={0.2}
      />
    </instancedMesh>
  )
}

export default InstancedPoints;