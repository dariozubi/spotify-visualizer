import React, { Component } from 'react';
import SpotifyApiHandler from './components/util/SpotifyApiHandler';
import DodecahedronScene from './components/scenes/dodecahedron/DodecahedronScene';
// import FirefliesScene from './components/scenes/fireflies/FirefliesScene';
import './App.css';

export default class App extends Component{

  constructor(props){
    super(props);

    this.setActive = this.setActive.bind(this);
    this.setTrack = this.setTrack.bind(this);

    this.state = {
      active: false,
      track: {}
    };
  }

  setActive(active){
    this.setState({ active: active });
  }

  setTrack(track){
    this.setState({ track: track })
  }

  render() {

    const track = this.state.track;
    const active = this.state.active;

    return(
      <div className="main">

        <DodecahedronScene
          active={active}
          track={track} />

        <SpotifyApiHandler
          active={active}
          setActive={this.setActive}
          setTrack={this.setTrack} />
      </div>
    );
  }
}
