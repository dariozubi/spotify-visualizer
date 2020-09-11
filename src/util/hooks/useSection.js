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
  const startID = useRef();
  const analysis = useStore(state => state.analysis);
  const progress = useStore(state => state.progress);

  useEffect(() => {
    if (analysis){
      const data = analysis['sections'];
      for (let i=data.length-1; i>=0; --i){
        if (progress > data[i].start){
          if (data[i].start !== startID.current){
            startID.current = data[i].start;
            setConfidence(data[i].confidence);
            setTimeSignature(data[i].time_signature);
            setKey(mapKey(data[i].key));
            setMode(mapMode(data[i].mode));
            setTempo(data[i].tempo)
          }
          break
        }
      }
    }
  }, [analysis, progress])

  return { confidence, timeSignature, mode, key, tempo };
}