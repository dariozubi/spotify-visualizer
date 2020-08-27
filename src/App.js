import React from 'react';
import useTrack from './util/hooks/useTrack';
import Dashboard from './components/Dashboard';

export default function App(){
  
  const track = useTrack();

	return(
    <React.Fragment>
      {track && 
        <Dashboard track={track}/>
      }
    </React.Fragment>
	)
}

