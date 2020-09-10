import React from 'react';
import Letters  from './Letters';
import useRhythm from 'util/hooks/useRhythm';
import useSection from 'util/hooks/useSection';
import { Text } from 'drei';

const Rhythms = () => {
  const beat = useRhythm('beats');
  const tatum = useRhythm('tatums');
  const bar = useRhythm('bars');
  const { confidence: section, timeSignature, mode, key, tempo } = useSection();

  return(
    <React.Fragment>
      <Text
        font='https://fonts.gstatic.com/s/merriweather/v21/u-4l0qyriQwlOrhSvowK_l5-eR7NWMf8.woff'
        color='#111111'
        fontSize={0.25}
        position-y={0.85}
        position-x={0.4}
      >
        {key + ' ' + mode}
      </Text>

      <Text
        font='https://fonts.gstatic.com/s/merriweather/v21/u-4l0qyriQwlOrhSvowK_l5-eR7NWMf8.woff'
        color='#111111'
        fontSize={0.25}
        position-y={-1.65}
        position-x={0.4}
      >
        {Math.round(tempo) + 'BPM  ' + timeSignature + '/4'}
      </Text>

      <Letters 
        text='Section'
        position={{x:-3.5, y:0.65}}
        confidence={section} 
        confidence_position={{x: -1.78, y: -0.25}}
      />

      <Letters 
        text='Bar'
        position={{x:-4, y:0.15}}
        confidence={bar} 
        confidence_position={{x: -0.83, y: -0.25}}
      />
      
      <Letters 
      text='Beat'
      position={{x:-3.9, y:-0.35}}
      confidence={beat} 
      confidence_position={{x: -1.06, y: -0.25}}
    />

    <Letters 
      text='Tatum'
      position={{x:-3.65, y:-0.85}}
      confidence={tatum} 
      confidence_position={{x: -1.42, y: -0.25}}
    />
    </React.Fragment>
  )
}

export default Rhythms;