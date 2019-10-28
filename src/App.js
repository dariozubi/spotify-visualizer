import React, { Component } from 'react';
import * as Mycookie from './mycookie';
import * as THREE from 'three';

export default class ThreeScene extends Component{

  constructor(props){
    super(props);
    this.state = {
      headers: {},
      accessToken: '',
      refreshToken: '',
      refreshCode: '',

      currentlyPlaying: {},
      trackAnalysis: {},
      trackFeatures: {},

      initialTrackProgress: 0,
      initialStart: 0,
      trackProgress: 0,

      active: false
    };
  }

  componentDidMount() {

    if (window.location.hash === '#start') {

      // this.setApiTokens();

      this.setState({accessToken: Mycookie.get('DAZOPTICA_ACCESS_TOKEN'),
        refreshToken: Mycookie.get('DAZOPTICA_REFRESH_TOKEN'),
        refreshCode: Mycookie.get('DAZOPTICA_REFRESH_CODE'),
        headers: new Headers({
          'Authorization': 'Bearer ' + Mycookie.get('DAZOPTICA_ACCESS_TOKEN'),
          'Accept': 'application/json'
        })
      }, this.ping());

      const width = this.mount.clientWidth;
      const height = this.mount.clientHeight;

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

      this.scene.add(this.cube);

      this.start();

    } else {

      this.auth();
    }
    
  };

  auth () {
    fetch('http://localhost:8001/auth')
      .then(res => res.json())
      .then(res => res.auth_id ? window.location.href = `http://localhost:8001/login?auth_id=${res.auth_id}` : null) 
      .catch(err => console.log(err))
  }

  ping(){
    setTimeout(() => this.getCurrentlyPlaying(), 500);
  }

  getCurrentlyPlaying () {

    const request = new Request('https://api.spotify.com/v1/me/player', {headers: this.state.headers});

    fetch(request)
      .then(res => res.json())
      .then(res => {

        if (res.error && res.error.status === 401) {
          return this.getNewToken(); 
        }

        const track = res.item;
        const playing = res.is_playing;
        const progress = res.progress_ms;

        const songsInSync = JSON.stringify(this.state.currentlyPlaying) === JSON.stringify(track)

        const stats = {
          client: this.state.trackProgress,
          server: progress,
          error: this.state.trackProgress - progress
        }
        
        console.log(`Sync error: ${Math.round(stats.error)}ms`)
        // console.log("playing:" + playing + ", active:" + this.state.active + ", songsInSync:" + songsInSync);

        if (track === null || track === undefined) {
          this.ping();
        }

        if (playing && !this.state.active) {
          if (songsInSync) {
            this.setState({
              initialStart: window.performance.now(),
              initialized: true,
              active: true
            }, this.ping());
          }
          else
            this.getTrackData({ track, progress })
        }

        if (!playing && this.state.active) {
          this.setState({active: false}, this.ping());
        }

        if(!playing && !this.state.active){
          this.ping();
        }

        if (playing && this.state.active && !songsInSync) {
          this.getTrackData({ track, progress })
        }

        if (playing && this.state.active && songsInSync && Math.abs(stats.error) > 500) {
          this.setState({trackProgress: progress}, this.ping());
        }

      })
      .catch(err => console.log(err))
  }

  getTrackData ({ track, progress }) {

    const now = window.performance.now();

    fetch(new Request('https://api.spotify.com/v1/audio-analysis/' + track.id, {headers: this.state.headers}))
      .then(res => res.json())
      .then(res =>{

        if (res.error && res.error.status === 401) {
          return this.getNewToken(); 
        }

        this.setState({
          active: true,
          currentlyPlaying: track,
          trackAnalysis: res,
          initialTrackProgress: progress,
          progress: progress + (window.performance.now() - now) 
        }, this.ping())

    })
    .catch(err => console.log(err))

    // const features = fetch(new Request('https://api.spotify.com/v1/audio-features/' + track.id, this.state.headers)).then(res => res.json()) 
    
    /** We need to keep track of how long these requests take so we can add latency to current track progress. */
    // const now = window.performance.now()

    // Promise.all([ analysis, features ]).then(responses => {

    //   const analysis = {...responses[0]}
    //   const features = {...responses[1]}

    //   console.log(analysis);
      
    //   /** If 401, get new API token. */

    //   if (analysis.error && analysis.error.status === 401 || (features.error && features.error.status === 401)) { console.log("analysis or feature error"); this.getNewToken(); }

    //   else{
    //     this.normalizeIntervals({
    //       track,
    //       analysis
    //     });

    //     console.log(analysis);

    //     this.setState({active: false,
    //       currentlyPlaying: track,
    //       trackAnalysis: analysis,
    //       trackFeatures: features,
    //       initialTrackProgress: progress,
    //       active: true
    //     }, this.ping());
    //   }

    // }).catch(err => console.log(err));
  }

  normalizeIntervals ({ track, analysis }) {
    this.state.intervalTypes.forEach((t) => {
    const type = analysis[t]

    /** Ensure first interval of each type starts at zero. */
    type[0].duration = type[0].start + type[0].duration
    type[0].start = 0

    /** Ensure last interval of each type ends at the very end of the track. */
    type[type.length - 1].duration = (track.duration_ms / 1000) - type[type.length - 1].start

    /** Convert every time value to milliseconds for our later convenience. */
    type.forEach((interval) => {
      interval.start = interval.start * 1000 // ------------------------------------------------------------> Shouldn't this be / to transform to ms???!?
      interval.duration = interval.duration * 1000
    })
  })
}

  getNewToken () {
    console.log("getNewToken");

    if (!this.state.refreshToken) {
      return window.location.href = ''
    }

    fetch('http://localhost:8001/refresh?token=' + this.state.refreshToken)
      .then(res => res.json())
      .then(res => {
        this.setState({accessToken: res.access_token}, this.ping());
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
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
    if (this.state.active){
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
      // this.cube.scale.set(1,1.,1.);
    }

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }; 

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  }; 

  render() {
    return(
      <div
        style = {{ width: '400px', height: '400px' }}
        ref = {(mount) => { this.mount = mount }}
      />
    )
  }
}
