import React, { useEffect, useState } from 'react';

export default function useSegment( track ){
  const [pitches, setPitches] = useState([]);
  
  useEffect(() => {
    if (track){
      const data = track ? track.analysis.sections : null;
      const progress = track ? track.progress : null;
      for (let i=data.length-2; i>=0; --i){
        if (data[i].start < progress){
          setPitches(data[i+1].pitches);
          break
        }
      }
    }
  })

  return pitches;
}