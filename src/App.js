import React, { Component } from 'react';
import SpotifyApiHandler from './components/SpotifyApiHandler';
import CubesScene from './components/CubesScene';
import { Canvas } from 'react-three-fiber';
import './App.css';

export default class App extends Component{

  constructor(props){
    super(props);

    this.setMainState = this.setMainState.bind(this);

    this.state = {
      track: {},
      track_analysis: {},
      track_progress: 0,
      last_update: 0,
      active: false
    };
  }

  setMainState(state){
    this.setState(state);
  }

  render() {

    const track = this.state.track;
    const track_analysis = this.state.track_analysis;
    const track_progress = this.state.track_progress;
    const active = this.state.active;
    const last_update = this.state.last_update;

    return(
      <div className="main">
        <Canvas>
          <CubesScene
            active={active}
            track_analysis={track_analysis}
            track_progress={track_progress}
            last_update={last_update}
            setMainState={this.setMainState} />
        </Canvas>
        <SpotifyApiHandler
          active={active}
          track={track}
          track_progress={track_progress}
          setMainState={this.setMainState} />
      </div>
    );
  }
}
