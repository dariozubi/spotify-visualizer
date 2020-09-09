import { useEffect, useState } from 'react';
import { useStore } from 'util/hooks/useStore';

export default function useSegment(){
  const [confidence, setConfidence] = useState(0);
  const [pitches, setPitches] = useState([1,1,1,1,1,1,1,1,1,1,1,1]);
  const [loudnessStart, setLoudnessStart] = useState(0);
  const [loudnessMax, setLoudnessMax] = useState(0);
  const [loudnessMaxTime, setLoudnessMaxTime] = useState(0);
  const [timbre, setTimbre] = useState([]);
  const [start, setStart] = useState(0);
  const analysis = useStore(state => state.analysis);
  const progress = useStore(state => state.progress);

  useEffect(() => {
    if (analysis){
      const data = analysis['segments'];
      for (let i=data.length-2; i>=0; --i){
        if (data[i].start < progress){
          if (data[i+1].start !== start){
            setConfidence(data[i+1].confidence);
            setStart(data[i+1].start);
            setPitches(data[i+1].pitches)
            setLoudnessStart(data[i+1].loudness_start)
            setLoudnessMax(data[i+1].loudness_max)
            setLoudnessMaxTime(data[i+1].loudness_max_time)
            setTimbre(data[i+1].timbre)
          }
          break
        }
      }
    }
  }, [analysis, progress])

  return { confidence, pitches, loudnessStart, loudnessMax, loudnessMaxTime, timbre };
}