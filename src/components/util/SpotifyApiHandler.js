import { Component } from 'react';
import * as cookie from './cookie';

 export default class SpotifyApiHandler extends Component{

  constructor(props){
  	super(props);

  	this.state = {
      track: {},
      track_analysis: {},
      track_progress: 0,
  	  headers: {},
      refresh_token: '',
      last_update: 0,
      section: -1,
      tatum: -1
  	}

  	this.setActive = this.setActive.bind(this);
    this.setTrack = this.setTrack.bind(this);
  }

  componentDidMount() {

    if (window.location.hash === '#start') {

      this.setState({
        refresh_token: cookie.get('DAZUMA_REFRESH_TOKEN'),
        headers: new Headers({
          'Authorization': 'Bearer ' + cookie.get('DAZUMA_ACCESS_TOKEN'),
          'Accept': 'application/json'
        })
      });

      this.ping();

      this.timerId = setInterval(this.updateProgress.bind(this), 50);

    } else {

      this.auth();
    }
    
  };

  componentWillUnmount(){
    clearInterval(this.timerId);
    clearTimeout(this.callId);
  }

  auth () {
    fetch('http://localhost:8001/auth')
      .then(res => res.json())
      .then(res => res.auth_id ? window.location.href = `http://localhost:8001/login?auth_id=${res.auth_id}` : null) 
      .catch(err => console.log(err))
  }

  updateProgress(){

    if (this.props.active){

      this.setState((state,props)=>({ 
        track_progress: state.track_progress + window.performance.now() - state.last_update,
        last_update: window.performance.now() 
      }));
      
      let tempo = 0;
      let key = 0;
      let mode = 0;
      let loudness = 0;
      let section = 0;
      let tatum = 0;
      let beat = 0;
      let bar = 0;
      let segment = 0;

      for (let i=0; i<this.state.track_analysis.sections.length; i++){

        if (this.state.track_progress > this.state.track_analysis.sections[i].start){
          section = this.state.track_analysis.sections[i].start;
          tempo = this.state.track_analysis.sections[i].tempo/60*1000/this.state.track_analysis.sections[i].time_signature;
          key = this.state.track_analysis.sections[i].key;
          mode = this.state.track_analysis.sections[i].mode;
          loudness = this.state.track_analysis.sections[i].loudness;
        }

        else break;
      }

      for (let i=0; i<this.state.track_analysis.tatums.length; i++){
        if (this.state.track_progress > this.state.track_analysis.tatums[i].start)
          tatum = this.state.track_analysis.tatums[i].start;
        else break;
      }

      for (let i=0; i<this.state.track_analysis.beats.length; i++){
        if (this.state.track_progress > this.state.track_analysis.beats[i].start)
          beat = this.state.track_analysis.beats[i].start;
        else break;
      }

      for (let i=0; i<this.state.track_analysis.bars.length; i++){
        if (this.state.track_progress > this.state.track_analysis.bars[i].start)
          bar = this.state.track_analysis.bars[i].start;
        else break;
      }

      for (let i=0; i<this.state.track_analysis.segments.length; i++){
        if (this.state.track_progress > this.state.track_analysis.segments[i].start)
          segment = this.state.track_analysis.segments[i].start;
        else break;
      }

      this.setTrack({
        name: this.state.track.name,
        tempo: tempo,
        key: key,
        mode: mode,
        loudness: loudness,
        tempo_pulse: this.state.track_progress % tempo < 100,
        section_pulse: Math.abs(this.state.track_progress - section) < 500,
        tatum_pulse: Math.abs(this.state.track_progress - tatum) < 100,
        beat_pulse: Math.abs(this.state.track_progress - beat) < 100,
        bar_pulse: Math.abs(this.state.track_progress - bar) < 100,
        segment_pulse: Math.abs(this.state.track_progress - segment) < 100
      });

      this.setState({
        section: section,
        tatum: tatum
      });
    }
  }

  ping(){
    this.callId = setTimeout(() => this.getAPIInfo(), 3000);
  }

  getAPIInfo() {

    const now = window.performance.now();

    const request = new Request('https://api.spotify.com/v1/me/player', {headers: this.state.headers});

    fetch(request)
      .then(res =>{

        if (res.statusText === "No Content")
          return res; 

        return res.json();

      })
      .then(res => {

        if (res.statusText === "No Content"){
          this.setActive(false);
          this.setState({ track: "NO TRACK" });
          return "";
        }

        if (res.error && res.error.status === 401)
          return this.getNewToken(); 

        const track = res.item;
        const playing = res.is_playing;
        const progress = res.progress_ms + (window.performance.now() - now);

        const song_in_sync = JSON.stringify(this.state.track) === JSON.stringify(track)

        const error = this.state.track_progress - progress;
        // console.info(error);

        if (playing && !this.props.active) {

          if (song_in_sync) {

            this.setActive(true);

            this.setState({ 
              track_progress: progress,
              last_update: window.performance.now() 
            });
          }

          else

            this.getTrackData({ track, progress })
        }

        if (!playing && this.props.active) {

          this.setActive(false);

        }

        if (playing && this.props.active && !song_in_sync) {

          this.getTrackData({ track, progress })

        }

        if (playing && this.props.active && song_in_sync && Math.abs(error) > 50) {

          this.setState({ 
            track_progress: progress,
            last_update: window.performance.now() 
          });

        } 

      })
      .then(this.ping())
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

        const rhythms = ['bars', 'beats', 'sections', 'segments', 'tatums'];

        let analysis = res;

        for (let rhythm of rhythms){
          let item = analysis[rhythm];
          for (let i=0; i<item.length; i++){
            analysis[rhythm][i].start *= 1000;
            analysis[rhythm][i].duration *= 1000;
          }
        }

        analysis.track.end_of_fade_in *= 1000;
        analysis.track.start_of_fade_out *= 1000;
        analysis.track.duration *= 1000;

        this.setActive(true);

        this.setState({ 
          track: track,
          track_analysis: analysis,
          track_progress: progress + (window.performance.now() - now),
          last_update: window.performance.now() 
        });

    })
    .catch(err => console.log(err))
  }

  getNewToken () {

    console.warn("Fetching new token");

    if (!this.state.refresh_token) {
      return window.location.href = ''
    }

    fetch('http://localhost:8001/refresh?token=' + this.state.refresh_token)
      .then(res => res.json())
      .then(res => {
        this.setState({
          headers: new Headers({
            'Authorization': 'Bearer ' + res.access_token,
            'Accept': 'application/json'
          })
        });
      })
      .catch(err => console.log(err));
  }

  setActive(active){
    this.props.setActive(active);
  }

  setTrack(track){
    this.props.setTrack(track);
  }

  render() {
    return null;
  }

}