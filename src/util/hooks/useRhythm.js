import { useEffect, useState } from 'react';

export default function useRhythm( track, rhythm ){
  const [confidence, setConfidence] = useState(0);
  
  useEffect(() => {
    if (track){
      const data = track ? track.analysis[rhythm] : null;
      const progress = track ? track.progress : null;
      for (let i=data.length-2; i>=0; --i){
        if (data[i].start < progress){
          setConfidence(data[i+1].confidence);
          break
        }
      }
    }
  }, [track, rhythm])

  return confidence;
}