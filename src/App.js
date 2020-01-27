import React, { Component } from 'react';
import APIHandler from './components/APIHandler';
import Scene from './components/Scene';
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

        <Scene
          active={active}
          track={track} />

        <APIHandler
          active={active}
          setActive={this.setActive}
          setTrack={this.setTrack} />
      </div>
    );
  }
}
