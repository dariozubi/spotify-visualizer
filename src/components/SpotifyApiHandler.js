import { Component } from 'react';
import * as Mycookie from './cookie';

 export default class SpotifyApiHandler extends Component{

  constructor(props){
	super(props);

	this.state = {
	  headers: {},
    refresh_token: ''
	}

	this.setMainState = this.setMainState.bind(this);
  }

  componentDidMount() {

    if (window.location.hash === '#start') {

      this.setState({
        refresh_token: Mycookie.get('DAZOPTICA_REFRESH_TOKEN'),
        headers: new Headers({
          'Authorization': 'Bearer ' + Mycookie.get('DAZOPTICA_ACCESS_TOKEN'),
          'Accept': 'application/json'
        })
      });
      this.ping();

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
    setTimeout(() => this.getAPIInfo(), 3000);
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
          this.setMainState({ 
            active: false,
            track: "NO TRACK"
          });
          return "";
        }

        if (res.error && res.error.status === 401)
          return this.getNewToken(); 

        const track = res.item;
        const playing = res.is_playing;
        const progress = res.progress_ms + (window.performance.now() - now);

        const song_in_sync = JSON.stringify(this.props.track) === JSON.stringify(track)

        const error = this.props.track_progress - progress;
        // console.info(error);

        if (playing && !this.props.active) {
          if (song_in_sync) {
            this.setMainState({ 
              active: true, 
              track_progress: progress, 
              last_update: window.performance.now() 
            });
          }
          else
            this.getTrackData({ track, progress })
        }

        if (!playing && this.props.active) {
          this.setMainState({ 
            active: false 
          });
        }

        if (playing && this.props.active && !song_in_sync) {
          this.getTrackData({ track, progress })
        }

        if (playing && this.props.active && song_in_sync && Math.abs(error) > 50) {
          this.setMainState({ 
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
            analysis[rhythm][i].start *= 100;
          }
        }

        analysis.track.end_of_fade_in *= 1000;
        analysis.track.start_of_fade_out *= 1000;
        analysis.track.duration *= 1000;

        this.setMainState({
          active: true,
          track: track,
          track_analysis: analysis,
          track_progress: progress + (window.performance.now() - now),
          last_update: window.performance.now()
        })

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

  setMainState(state){
    this.props.setMainState(state);
  }

  render() {
    return null;
  }

}