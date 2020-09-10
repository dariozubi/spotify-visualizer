import React, { useEffect, useState } from 'react';
import { useStore } from 'util/hooks/useStore';
import { Circle, Text, Line } from 'drei';

const Label = ({ text, x, y, rot }) => {
  return(
     <Text
        font='https://fonts.gstatic.com/s/merriweather/v21/u-4l0qyriQwlOrhSvowK_l5-eR7NWMf8.woff'
        fontSize={0.08}
        color="#111111"
        position-y={y}
        position-x={x}
        rotation-z={rot}
      >
        {text}
      </Text>
  )
}

const sin45 = Math.sin(Math.PI/4);
const cos45 = Math.cos(Math.PI/4);
// const points = [[0,,0], [0.5*sin45, 0.5*cos45, 0]]

const Spider = () => {
  const [points, setPoints] = useState([[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]])
  const features = useStore(state => state.features);

  useEffect(() => {
    if (features){
      setPoints([
        [0, features.acousticness, 0],
        [features.danceability*sin45, features.danceability*cos45, 0],
        [features.energy*sin45, 0, 0],
        [features.instrumentalness*sin45, -features.instrumentalness*cos45, 0],
        [0, -features.liveness*cos45, 0],
        [-(features.loudness+60)/60*sin45, -(features.loudness+60)/60*cos45, 0],
        [-features.speechiness*sin45, 0, 0],
        [-features.valence*sin45, features.valence*cos45, 0],
        [0, features.acousticness, 0]
      ])
    }
  }, [features])

  return (
    <React.Fragment>
      <Circle args={[1, 8]} position-x={3} position-y={-0.2}>
        <meshBasicMaterial attach="material" wireframe/>
      </Circle>
      <Circle args={[0.75, 8]} position-x={3} position-y={-0.2}>
        <meshBasicMaterial attach="material" wireframe/>
      </Circle>
      <Circle args={[0.5, 8]} position-x={3} position-y={-0.2}>
        <meshBasicMaterial attach="material" wireframe/>
      </Circle>
      <Circle args={[0.25, 8]} position-x={3} position-y={-0.2}>
        <meshBasicMaterial attach="material" wireframe/>
      </Circle>
      <Line color="red" position={[3, -0.2, 0]} points={points}  linewidth={1}/>
      <Label text="Acousticness" x={3} y={0.9} rot={0}/>
      <Label text="Danceability" x={3.75} y={0.55} rot={-Math.PI/4}/>
      <Label text="Energy" x={4.05} y={-0.2} rot={-Math.PI/2}/>
      <Label text="Insturmentalness" x={3.75} y={-0.95} rot={Math.PI/4}/>
      <Label text="Liveness" x={3} y={-1.3} rot={0}/>
      <Label text="Loudness" x={2.25} y={-0.95} rot={-Math.PI/4}/>
      <Label text="Speechiness" x={1.95} y={-0.2} rot={Math.PI/2}/>
      <Label text="Valence" x={2.25} y={0.55}  rot={Math.PI/4}/>
      
    </React.Fragment>
  )
}

export default Spider;


