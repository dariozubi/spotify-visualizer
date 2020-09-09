import React from 'react';
import useSpotify from 'util/hooks/useSpotify';
import Dashboard from 'components/Dashboard'

export default function App(){

  useSpotify();

	return(
    <React.Fragment>
      <Dashboard />
    </React.Fragment>
	)
}

