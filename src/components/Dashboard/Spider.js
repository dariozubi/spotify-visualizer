import React, { useEffect, useState } from 'react';
import { useStore } from 'util/hooks/useStore';
import { Circle, Text, Line } from 'drei';
import { font, color } from './theme';

const Label = ({ text, x, y, rot }) => {
  return(
     <Text
        font={font}
        fontSize={0.08}
        color={color.black}
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

const Spider = () => {
  const [points, setPoints] = useState([[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]])
  const features = useStore(state => state.features);

  useEffect(() => {
    if (features){
      setPoints([
        [0, features.energy, 0],
        [features.danceability*sin45, features.danceability*cos45, 0],
        [features.acousticness*sin45, 0, 0],
        [features.instrumentalness*sin45, -features.instrumentalness*cos45, 0],
        [0, -features.liveness*cos45, 0],
        [-features.speechiness*sin45, -features.speechiness*cos45, 0],
        [-(features.loudness+60)/60*sin45, 0, 0],
        [-features.valence*sin45, features.valence*cos45, 0],
        [0, features.energy, 0]
      ])
    }
  }, [features])

  return (
    <React.Fragment>
      {
        features &&
        <group position-x={3} position-y={-0.6}>
          <Circle args={[1, 8]}>
            <meshBasicMaterial attach="material" wireframe color={color.gray}/>
          </Circle>
          <Circle args={[0.75, 8]}>
            <meshBasicMaterial attach="material" wireframe color={color.gray}/>
          </Circle>
          <Circle args={[0.5, 8]}>
            <meshBasicMaterial attach="material" wireframe color={color.gray}/>
          </Circle>
          <Circle args={[0.25, 8]}>
            <meshBasicMaterial attach="material" wireframe color={color.gray}/>
          </Circle>
          <Line color={color.blue} position={[0, 0, 0.2]} points={points}  linewidth={1}/>
          <Label text="Energy" x={0} y={1.05} rot={0}/>
          <Label text="Danceability" x={0.75} y={0.75} rot={-Math.PI/4}/>
          <Label text="Acousticness" x={1.05} y={0} rot={-Math.PI/2}/>
          <Label text="Instrumentalness" x={0.75} y={-0.75} rot={Math.PI/4}/>
          <Label text="Liveness" x={0} y={-1.05} rot={0}/>
          <Label text="Speechiness" x={-0.75} y={-0.75} rot={-Math.PI/4}/>
          <Label text="Loudness" x={-1.05} y={0} rot={Math.PI/2}/>
          <Label text="Valence" x={-0.75} y={0.75}  rot={Math.PI/4}/>
        </group>
      }
    </React.Fragment>
  )
}

export default Spider;


