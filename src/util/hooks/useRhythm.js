import { useEffect, useState } from 'react';
import { useStore } from 'util/hooks/useStore';

export default function useRhythm( rhythm ){
  const [confidence, setConfidence] = useState(0);
  const [start, setStart] = useState(0);
  const analysis = useStore(state => state.analysis);
  const progress = useStore(state => state.progress);

  useEffect(() => {
    if (analysis){
      const data = analysis[rhythm];
      for (let i=data.length-2; i>=0; --i){
        if (data[i].start < progress){
          if (data[i+1].start !== start){
            setConfidence(data[i+1].confidence);
            setStart(data[i+1].start);
          }
          break
        }
      }
    }
  }, [analysis, rhythm, progress])

  return confidence;
}