import React from 'react';
import { Canvas } from 'react-three-fiber';
import { OrbitControls } from 'drei';
import Graph from './Graph';
import Rhythms from './Rhythms';
import Info from './Info';

const style = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
}

const Dashboard = () => {
  return (
    <div style={style}>
      <Canvas 
        colorManagement
        camera={{ position: [0, 0, 130], fov:2}}
      >
        <OrbitControls/>
        <ambientLight color="#ffffff" intensity={0.5} />
        <Info />
        <Rhythms/>
        <Graph/>
      </Canvas>
    </div>
  )
}

export default Dashboard;

