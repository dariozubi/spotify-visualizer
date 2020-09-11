import { useEffect, useState, useRef } from 'react';
import { useStore } from 'util/hooks/useStore';

export default function useSegment(){
  const [confidence, setConfidence] = useState(0);
  const [pitches, setPitches] = useState([1,1,1,1,1,1,1,1,1,1,1,1]);
  const [loudnessStart, setLoudnessStart] = useState(0);
  const [loudnessMax, setLoudnessMax] = useState(0);
  const [loudnessMaxTime, setLoudnessMaxTime] = useState(0);
  const [timbre, setTimbre] = useState([]);
  const start = useRef();
  const analysis = useStore(state => state.analysis);
  const progress = useStore(state => state.progress);

  useEffect(() => {
    if (analysis){
      const data = analysis['segments'];
      for (let i=data.length-1; i>=0; --i){
        if (data[i].start < progress){
          if (data[i].start !== start.current){
            setConfidence(data[i].confidence);
            start.current = data[i].start;
            setPitches(data[i].pitches)
            setLoudnessStart(data[i].loudness_start)
            setLoudnessMax(data[i].loudness_max)
            setLoudnessMaxTime(data[i].loudness_max_time)
            setTimbre(data[i].timbre)
          }
          break
        }
      }
    }
  }, [analysis, progress])

  return { confidence, pitches, loudnessStart, loudnessMax, loudnessMaxTime, timbre };
}