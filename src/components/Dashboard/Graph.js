import React from 'react';
import { Plane, Text } from 'drei';
import useSegment from 'util/hooks/useSegment';
import useSection from 'util/hooks/useSection';
import Letters from './Letters';
import { font, color } from './theme';

const Strip = ({ text, position, color_hsl, percentage }) => {
  return(
    <React.Fragment>
      <group position-y={position * -0.2}>
          <Text
            font={font}
            color={color.black}
            fontSize={0.15}
            position-y={0.45}
            position-x={-1}
          >
            {text}
          </Text>
          <Plane args={[2,0.2]} position-x={0.4} position-y={0.45}>
            <meshBasicMaterial attach="material" color={"hsl("+color_hsl[0]+", "+Math.round( (percentage) * color_hsl[1])+"%, "+color_hsl[2]+"%)"} />
          </Plane>
      </group>
    </React.Fragment>
  )
}

const color_hsl = [140, 82, 56];

const Graph = () => {
  const { confidence, pitches } = useSegment();
  const { confidence: section, timeSignature, mode, key, tempo } = useSection();
  return (
    <React.Fragment>
      <group position-x={-0.2}>
        <Strip text="C" position={0} color_hsl={color_hsl} percentage={pitches[0]}/>
        <Strip text="C#/Db" position={1} color_hsl={color_hsl} percentage={pitches[1]}/>
        <Strip text="D" position={2} color_hsl={color_hsl} percentage={pitches[2]}/>
        <Strip text="D#/Eb" position={3} color_hsl={color_hsl} percentage={pitches[3]}/>
        <Strip text="E" position={4} color_hsl={color_hsl} percentage={pitches[4]}/>
        <Strip text="F" position={5} color_hsl={color_hsl} percentage={pitches[5]}/>
        <Strip text="F#/Gb" position={6} color_hsl={color_hsl} percentage={pitches[6]}/>
        <Strip text="G" position={7} color_hsl={color_hsl} percentage={pitches[7]}/>
        <Strip text="G#/Ab" position={8} color_hsl={color_hsl} percentage={pitches[8]}/>
        <Strip text="A" position={9} color_hsl={color_hsl} percentage={pitches[9]}/>
        <Strip text="A#/Bb" position={10} color_hsl={color_hsl} percentage={pitches[10]}/>
        <Text
          font={font}
          color={color.black}
          fontSize={0.25}
          position-y={0.7}
          position-x={0.4}
        >
          {key + ' ' + mode}
        </Text>

        <Text
          font={font}
          color={color.black}
          fontSize={0.25}
          position-y={-1.8}
          position-x={0.4}
        >
          {Math.round(tempo) + 'BPM  ' + timeSignature + '/4'}
        </Text>
      </group>
      <Letters 
        text='Segment'
        position={{x:-3.1, y:-1.2}}
        confidence={confidence} 
        confidence_position={{x: -2.12, y: -0.25}}
      />
    </React.Fragment>
  )
}

export default Graph;