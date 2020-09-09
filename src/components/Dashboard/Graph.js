import React from 'react';
import { useStore } from 'util/hooks/useStore'; 
import { Plane, Text } from 'drei';
import useSegment from 'util/hooks/useSegment';

const Strip = ({ text, position, color, percentage }) => {

  return(
    <React.Fragment>
      <group position-y={position * -0.2}>
          <Text
            font='https://fonts.gstatic.com/s/merriweather/v21/u-4l0qyriQwlOrhSvowK_l5-eR7NWMf8.woff'
            color='#111111'
            fontSize={0.15}
            position-y={0.8}
            position-x={-1}
          >
            {text}
          </Text>
          <Plane args={[2,0.2]} position-x={0.4} position-y={0.8}>
            <meshBasicMaterial attach="material" color={"hsl("+color[0]+", "+((100 - color[1]) * (1 - percentage) + color[1])+"%, "+color[2]+"%)"} />
          </Plane>
      </group>
    </React.Fragment>
  )
}

const Graph = () => {
  const { pitches } = useSegment();
  return (
    <React.Fragment>
      <Strip text="C" position={0} color={[0, 89, 66]} percentage={pitches[0]}/>
      <Strip text="C#/Db" position={1} color={[16, 81, 62]} percentage={pitches[1]}/>
      <Strip text="D" position={2} color={[32, 74, 59]} percentage={pitches[2]}/>
      <Strip text="D#/Eb" position={3} color={[48, 68, 55]} percentage={pitches[3]}/>
      <Strip text="E" position={4} color={[63, 63, 52]} percentage={pitches[4]}/>
      <Strip text="F" position={5} color={[80, 60, 49]} percentage={pitches[5]}/>
      <Strip text="F#/Gb" position={6} color={[96, 63, 46]} percentage={pitches[6]}/>
      <Strip text="G" position={7} color={[128, 70, 41]} percentage={pitches[7]}/>
      <Strip text="G#/Ab" position={8} color={[144, 74, 38]} percentage={pitches[8]}/>
      <Strip text="A" position={9} color={[160, 77, 35]} percentage={pitches[9]}/>
      <Strip text="A#/Bb" position={10} color={[176,  82, 32]} percentage={pitches[10]}/>
    </React.Fragment>
  )
}

export default Graph;




// 0, 89, 66
// 16, 81, 62
// 32, 74, 59
// 48, 68, 55
// 63, 63, 52
// 80, 60, 49
// 96, 63, 46
// 128, 70, 41
// 144, 74, 38
// 160, 77, 35
// 176, 82, 32







