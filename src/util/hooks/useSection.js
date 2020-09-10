import { useEffect, useState, useRef } from 'react';
import { useStore } from 'util/hooks/useStore';

function mapKey(key){
  switch(key){
    case 0:
      return 'C';
    case 1:
      return 'C#/Db';
    case 2:
      return 'D';
    case 3:
      return 'D#/Eb';
    case 4:
      return 'E';
    case 5:
      return 'F';
    case 6:
      return 'F#/Gb';
    case 7:
      return 'G';
    case 8:
      return 'G#/Ab';
    case 9:
      return 'A';
    case 10:
      return 'A#/Bb';
    default:
      return 'B'
  }
}

function mapMode(mode){
  switch(mode){
    case -1:
      return '';
    case 0:
      return 'm';
    default:
      return 'M';
  }
}

export default function useSection(){
  const [confidence, setConfidence] = useState(0);
  const [timeSignature, setTimeSignature] = useState(4);
  const [tempo, setTempo] = useState(4);
  const [mode, setMode] = useState('');
  const [key, setKey] = useState('');
  const start = useRef();
  const analysis = useStore(state => state.analysis);
  const progress = useStore(state => state.progress);

  useEffect(() => {
    if (analysis){
      const data = analysis['sections'];
      for (let i=data.length-2; i>=0; --i){
        if (data[i].start < progress){
          if (data[i+1].start !== start.current){
            setConfidence(data[i+1].confidence);
            start.current = data[i+1].start;
            setTimeSignature(data[i+1].time_signature);
            setKey(mapKey(data[i+1].key));
            setMode(mapMode(data[i+1].mode));
            setTempo(data[i+1].tempo)
          }
          break
        }
      }
    }
  }, [analysis, progress])

  return { confidence, timeSignature, mode, key, tempo };
}