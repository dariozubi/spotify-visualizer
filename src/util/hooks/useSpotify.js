import { useEffect, useState, useRef } from 'react';
import { useInterval } from './useInterval';
import { getCookie } from 'util/common';
import { auth, getInfo, getAnalysis, getFeatures } from 'util/api';
import { useStore } from 'util/hooks/useStore';

const PROGRESS_UPDATE_DELAY = 100;
const SERVER_CALL_DELAY = 7000;
const MAX_SERVER_CALL_DELAY = 15000;

export default function useSpotify(){

  const isPlaying = useStore(state => state.isPlaying);
  const track = useStore(state => state.track);
  const progress = useStore(state => state.progress);
  const setIsPlaying = useStore(state => state.setIsPlaying);
  const setTrack = useStore(state => state.setTrack);
  const setAnalysis = useStore(state => state.setAnalysis);
  const setFeatures = useStore(state => state.setFeatures);
  const setProgress = useStore(state => state.setProgress);

  const serverDelay = useRef();
  const [lastUpdate, setLastUpdate] = useState(0);
  
  // Initialize values
	useEffect(() => {
    serverDelay.current = SERVER_CALL_DELAY;

    if (getCookie('DAZUMA_ACCESS_TOKEN')){
      const now = window.performance.now();
      getInfo()
        .then(player => {
          const new_now = window.performance.now();

          setIsPlaying(player.is_playing);

          if (!player.error){
            setTrack(player.item);
            setProgress(player.progress_ms + (new_now - now)/2);
            setLastUpdate(new_now);

            getAnalysis(player.item.id)
              .then(analysis => {
                setAnalysis(analysis);
              });

            getFeatures(player.item.id)
              .then(features => {
                setFeatures(features);
              })
          }
        })
    }
    else
      auth();
	}, [setIsPlaying, setTrack, setProgress, setAnalysis, setFeatures])

  // Interval for server info retrieval
  useInterval(() => {
    const now = window.performance.now();

    getInfo()
      .then(player => {
        if (isPlaying !== player.is_playing)
          setIsPlaying(player.is_playing);

        if (!player.error){
          const new_now = window.performance.now();
          const server_progress = player.progress_ms + (new_now - now)/2; // Approximation on the time from the server

          // Synchronize the progress if the error is too big or the track changed
          if (Math.abs(server_progress - progress) > 300 || isNaN(progress)){
            setProgress(server_progress);
            setLastUpdate(new_now)
          }

          // Update the delay if the next song is about to start
          if (player.item.duration_ms - progress < MAX_SERVER_CALL_DELAY)
            serverDelay.current = Math.max(player.item.duration_ms - progress + 50, SERVER_CALL_DELAY);

          else if (serverDelay.current !== SERVER_CALL_DELAY)
            serverDelay.current = SERVER_CALL_DELAY;

          // Update info if track changed
          if (player.is_playing && track.name !== player.item.name){
            setTrack(player.item);

            getAnalysis(player.item.id)
              .then(analysis => {
                setAnalysis(analysis);
              });

            getFeatures(player.item.id)
              .then(features => {
                setFeatures(features);
              });
          }
        }
      })
  }, serverDelay.current ? serverDelay.current : null)

  // Update progress constantly, except when calling the server
  useInterval(() => {
    const new_now = window.performance.now();
    setLastUpdate(new_now)
    if (isPlaying)
      setProgress(progress + new_now - lastUpdate <= track.duration_ms ? progress + new_now - lastUpdate : track.duration_ms);
  }, PROGRESS_UPDATE_DELAY)
}
