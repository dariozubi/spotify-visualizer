import { useEffect, useState } from 'react';

export default function useSection( track ){
  const [timeSignature, setTimeSignature] = useState(4);
  
  useEffect(() => {
    if (track){
      const data = track ? track.analysis.sections : null;
      const progress = track ? track.progress : null;
      for (let i=data.length-2; i>=0; --i){
        if (data[i].start < progress){
          setTimeSignature(data[i+1].time_signature);
          break
        }
      }
    }
  }, [track])

  return timeSignature;
}