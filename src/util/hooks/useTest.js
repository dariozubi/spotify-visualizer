import { useState } from 'react';
import { useInterval } from './useInterval';
import { toMinutes } from '../util/util';
import { test_track } from '../util/test'

const average_time = 120 * 1000;
const variation = 15 * 1000;
const initial = { 
  ...test_track,
  artist: 'Test',
  name: 'Track 0',
  analysis: { 
    track: {
      total: average_time
    },
    bars: new Array(average_time/1200).fill(0).map((i,k) => { 
      return {
        start: k*1200,
        confidence: Math.random()
    }}),
    beats: new Array(average_time/300).fill(0).map((i,k) => { 
      return {
        start: k*300,
        confidence: Math.random()
    }}),
    tatums: new Array(average_time/30).fill(0).map((i,k) => { 
      return {
        start: k*30,
        confidence: Math.random()
    }})
  },
  progress: 0,
  time: 0
};

export default function useTest(){
  const [track, setTrack] = useState(initial);
  const [calls, setCalls] = useState(0);
  const [number, setNumber] = useState(0)

  useInterval(() => {
    if (calls%30 === 0){
      if (track.progress >= track.analysis.track.total){
        const total = average_time + Math.round(Math.random()*variation) - variation/2
        setTrack({
          ...track,
          artist: 'Test',
          name: 'Track '+ number,
          analysis: { 
            track: {
              total:  total
            },
            bars: new Array(Math.round(total/1200)).fill(0).map((i,k) => { 
              return {
                start: k*1200,
                confidence: Math.random()
            }}),
            beats: new Array(Math.round(total/300)).fill(0).map((i,k) => { 
              return {
                start: k*300,
                confidence: Math.random()
            }}),
            tatums: new Array(Math.round(total/30)).fill(0).map((i,k) => { 
              return {
                start: k*30,
                confidence: Math.random()
            }})
          },
          progress: 0,
          time: 0
        })
        setNumber(number+1)
      }
      else
        setTrack({
          ...track,
          progress: track.progress+50,
          time: toMinutes(track.progress+50)
        })
      setCalls(calls+1)
    }
    else{
      setTrack({
        ...track,
        progress: (track.progress+50) < track.analysis.track.total ? track.progress+50 : track.analysis.track.total,
        time: toMinutes(track.progress+50)
      })
      setCalls(calls+1)
    }
  }, [50])

  return track;
}