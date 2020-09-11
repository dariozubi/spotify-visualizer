import React from 'react';
import { Canvas } from 'react-three-fiber';
import { Stars } from 'drei';
import Graph from './Graph';
import Rhythms from './Rhythms';
import Info from './Info';
import Spider from './Spider';

const style = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: '#272730'
}

const Dashboard = () => {
  return (
    <div style={style}>
      <Canvas 
        colorManagement
        camera={{ position: [0, 0, 3]}}
      >
        <ambientLight />
        <Info />
        <Rhythms/>
        <Graph/>
        <Spider />
        <Stars />
      </Canvas>
    </div>
  )
}

export default Dashboard;

