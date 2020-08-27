import { useEffect, useState } from 'react';
import { useInterval } from './useInterval';
import { getCookie, toMinutes } from '../util';

export default function useTrack(){

  const [autenticated, setAutenticated] = useState(false);
  const [calls, setCalls] = useState(0);
  const [track, setTrack] = useState(null);
  const [headers, setHeaders] = useState(new Headers({
      'Authorization': 'Bearer ' + getCookie('DAZUMA_ACCESS_TOKEN'),
      'Accept': 'application/json'  
  }));

  const auth = () => {
    fetch('http://localhost:8001/auth')
      .then(res => res.json())
      .then(res => res.auth_id ? window.location.href = 'http://localhost:8001/login?auth_id='+ res.auth_id : null) 
      .catch(err => console.error(err))
  }

  const getInfo = () => {
    const now = window.performance.now();

    if (headers !== null){
      fetch(new Request('https://api.spotify.com/v1/me/player', {headers: headers}))
        .then(res =>{
          if (res.statusText === "No Content") return res; 
          return res.json();
        })
        .then(res => {
          if (res.statusText === "No Content"){
            setTrack(null);
            return "";
          }

          if (res.error && res.error.status === 401)
            return getNewToken(); 

          let current_track = res.item;
          const playing = res.is_playing;
          const track_progress = playing ? (res.progress_ms + (window.performance.now() - now)) : res.progress_ms;
          const song_in_sync = track ? track.name === current_track.name : false;
          const error = track ? (track.progress - track_progress) : 0;
          
          current_track.progress = track_progress;
          current_track.time = toMinutes(track_progress);
          current_track.last_update = window.performance.now();
          current_track.artist = current_track.artists[0].name;
          current_track.playing = playing;

          if (track === null){
            getTrackData({ current_track });
            return "";
          }

          if (playing) {
            if (!song_in_sync){
              getTrackData({ current_track });
              return "";
            }

            if (song_in_sync && Math.abs(error) > 200) {
              current_track.analysis = track.analysis;
              setTrack(current_track);
              return "";
            } 
          } 
          else{
            current_track.analysis = track.analysis;
            setTrack(current_track);
          }
        })
        .catch(err => console.error(err))
    }
  }

  const getTrackData = ({ current_track }) => {
    const now = window.performance.now();

    fetch(new Request('https://api.spotify.com/v1/audio-analysis/' + current_track.id, {headers: headers}))
      .then(res => res.json())
      .then(res =>{
        if (res.error && res.error.status === 401)
          return getNewToken(); 

        const rhythms = ['bars', 'beats', 'sections', 'segments', 'tatums'];
        let analysis = res;
        for (let rhythm of rhythms){
          for (let i=0; i<analysis[rhythm].length; i++){
            analysis[rhythm][i].start *= 1000;
            analysis[rhythm][i].duration *= 1000;
          }
        }
        analysis.track.end_of_fade_in *= 1000;
        analysis.track.start_of_fade_out *= 1000;
        analysis.track.duration *= 1000;
        analysis.track.total = toMinutes(analysis.track.duration);

        current_track.analysis = analysis;
        current_track.progress = current_track.playing ? (current_track.progress + (window.performance.now() - now)) : current_track.progress;
        current_track.time = toMinutes(current_track.progress);
        setTrack(current_track);
        console.log(current_track)
    })
    .catch(err => console.error(err))
  }

  const getNewToken = () => {
    const refToken = getCookie('DAZUMA_REFRESH_TOKEN');
    
    if (!refToken)
      return window.location.href = ''

    fetch('http://localhost:8001/refresh?token=' + refToken)
      .then(res => res.json())
      .then(res => {
        setHeaders(new Headers({
          'Authorization': 'Bearer ' + getCookie('DAZUMA_ACCESS_TOKEN'),
          'Accept': 'application/json'
        }))
      })
      .catch(err => console.error(err));
  }

	useEffect(() => {
    if (window.location.hash === '#start')
      setAutenticated(true);
    else
      auth();
	}, [])


  useInterval(function progress(){

    if (calls%60 === 0){
      getInfo();
      setCalls(calls+1);
    }

    else{
      if (track && track.playing && track.analysis){
        const now = window.performance.now();
        const updated_progress = track.progress + now - track.last_update;
        const current_progress = updated_progress > track.analysis.track.duration ? track.analysis.track.duration : updated_progress;
        setTrack({
          ...track,
          progress: current_progress,
          time: toMinutes(current_progress),
          last_update: now
        });
        setCalls(calls+1);
      }
    }
  }, [autenticated ? 50 : null]);

  return track;
}
