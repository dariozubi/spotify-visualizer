import React, { Component } from 'react';
import * as THREE from 'three';

 export default class ThreeScene extends Component{

  constructor(props){
    super(props);

    this.state = {
      bar: 0,
      bar_confidence: 0,
      tatum: 0,
      tatum_confidence: 0,
      bar: 0,
      bar_confidence: 0,
      beat: 0,
      beat_confidence: 0,
      section: 0,
      section_confidence: 0,
      segment: 0,
      segment_confidence: 0,
      tempo: 0,
      tempo_confidence: 0,
      key: 0,
      key_confidence: 0,
      mode: 0,
      mode_confidence: 0,
      loudness: 0
    }

    this.setMainState = this.setMainState.bind(this);
  }

  componentDidMount() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000

    );

    this.camera.position.z = 4;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: '#433F81' });
    this.cube = new THREE.Mesh(geometry, material);

    window.addEventListener('resize', this.handleWindowResize);

    this.scene.add(this.cube);

    this.start();
    
  };

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  };

  handleWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize( width, height );
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  animate = () => {

    if (this.props.active){

      if (this.tempoPulse()){
        this.cube.scale.set(3.,3.,3.);
      }

      if (this.tatumPulse())
        this.cube.rotation.x += Math.PI/8;

      else{

        if (this.cube.scale.x > 0.5){

          this.cube.scale.x -= 0.01;
          this.cube.scale.y -= 0.01;
          this.cube.scale.z -= 0.01;

        }

      }
    } 

    else
      this.cube.rotation.set(0.,0.,0.);

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  tempoPulse(){

    const tempo = this.props.track_progress % this.state.tempo < 100 
      && this.props.track_progress > this.props.track_analysis.track.end_of_fade_in
      && this.props.track_progress < this.props.track_analysis.track.start_of_fade_out

    return tempo;
  }

  tatumPulse(){

    let result = false;

    for (let i=this.props.track_analysis.tatums.length-1; i>=0; i--){

      if (this.state.tatum !== i
        && this.props.track_progress > this.props.track_analysis.tatums[i].start
        && this.props.track_progress < this.props.track_analysis.tatums[i+1].start){

          this.setState({
            tatum: i,
            tatum_confidence: this.props.track_analysis.tatums[i].confidence
          });
          result = true;
          break;

      }
    }

    return result;
  }

  beatPulse(){

    let result = false;

    for (let i=this.props.track_analysis.beats.length-1; i>=0; i--){

      if (this.state.beat !== i
        && this.props.track_progress > this.props.track_analysis.beats[i].start
        && this.props.track_progress < this.props.track_analysis.beats[i+1].start){

          this.setState({
            beat: i,
            beat_confidence: this.props.track_analysis.beats[i].confidence
          });
          result = true;
          break;

      }
    }

    return result;
  }

  sectionPulse(){

    let result = false;

    for (let i=this.props.track_analysis.sections.length-1; i>=0; i--){

      if (this.state.section !== i
        && this.props.track_progress > this.props.track_analysis.sections[i].start
        && this.props.track_progress < this.props.track_analysis.sections[i+1].start){

          this.setState({
            section: i,
            section_confidence: this.props.track_analysis.sections[i].confidence
          });
          result = true;
          break;

      }
    }

    return result;
  }

  segmentPulse(){

    let result = false;

    for (let i=this.props.track_analysis.segments.length-1; i>=0; i--){

      if (this.state.segment !== i
        && this.props.track_progress > this.props.track_analysis.segments[i].start
        && this.props.track_progress < this.props.track_analysis.segments[i+1].start){

          this.setState({
            segment: i,
            segment_confidence: this.props.track_analysis.segments[i].confidence
          });
          result = true;
          break;

      }
    }

    return result;
  }

  renderScene = () => {

    this.renderer.render(this.scene, this.camera);
    this.updateState();
  
  };

  updateState(){

    if (this.props.active){

      const progress = this.props.track_progress + window.performance.now() - this.props.last_update

      this.props.setMainState({
        track_progress: progress, 
        last_update: window.performance.now()
      });

      for (let i=this.props.track_analysis.sections.length-1; i>=0; i--){

        if (progress > this.props.track_analysis.sections[i].start 
          && this.state.tempo !== this.props.track_analysis.sections[i].tempo){

            this.setState({
              tempo: this.props.track_analysis.sections[i].tempo/60*1000/this.props.track_analysis.sections[i].time_signature,
              tempo_confidence: this.props.track_analysis.sections[i].tempo_confidence,
              key: this.props.track_analysis.sections[i].key,
              key_confidence: this.props.track_analysis.sections[i].key_confidence,
              mode: this.props.track_analysis.sections[i].mode,
              mode_confidence: this.props.track_analysis.sections[i].mode_confidence,
              loudness: this.props.track_analysis.sections[i].loudness
            });
            break;

        }

      }

    }

    else{

      this.props.setMainState({
        last_update: window.performance.now()
      });

    }
  }

  setMainState(state){
    this.props.setMainState(state);
  }

  render() {
    return(
      <div ref = {(mount) => { this.mount = mount }} />
    )
  }

 }