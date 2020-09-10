import { getCookie } from './common';

export async function auth(){
	await fetch('http://localhost:8001/auth')
	  .then(res => res.json())
	  .then(res => res.auth_id ? window.location.href = 'http://localhost:8001/login?auth_id='+ res.auth_id : null) 
	  .catch(err => console.error(err))
}

export async function getInfo(){
  try {
    const data = await fetch(new Request(
      'https://api.spotify.com/v1/me/player',
      { 
        headers: new Headers({ 
          'Authorization': 'Bearer ' + getCookie('DAZUMA_ACCESS_TOKEN'), 
          'Accept': 'application/json' 
        }) 
      }
    ))
    .then(res =>{
      if (res.statusText !== "No Content")
        return res.json();
      else
        throw new Error('No content');
    })
    .then(res => {
      if (res.error && res.error.status === 401)
        getNewToken();

      return res;
    });

    return data;
  }
  catch(err){
    return { is_playing: false, item: { error: 'No Content' } }
  }
} 

export async function getAnalysis(track_id){
  if (!track_id)
    return null;
  const analysis = await fetch(new Request(
    'https://api.spotify.com/v1/audio-analysis/' + track_id, 
    { 
      headers: new Headers({ 
        'Authorization': 'Bearer ' + getCookie('DAZUMA_ACCESS_TOKEN'), 
        'Accept': 'application/json' 
      }) 
    }
  ))
    .then(res => res.json())
    .then(res =>{
      if (res.error && res.error.status === 401){
        getNewToken(); 
        return null;
      }

      const rhythms = ['bars', 'beats', 'sections', 'segments', 'tatums'];
      let analysis = res;
      console.log(analysis);
      for (let rhythm of rhythms){
        // TODO: I got an error trying to fetch analysis[rhythm]. Add some error handling here.
        if (analysis[rhythm]){
          for (let i=0; i<analysis[rhythm].length; i++){
            analysis[rhythm][i].start *= 1000;
            analysis[rhythm][i].duration *= 1000;
          }
        }
      }
      analysis.track.end_of_fade_in *= 1000;
      analysis.track.start_of_fade_out *= 1000;
      analysis.track.duration *= 1000;
      return analysis;
  });

  return analysis;
}

export async function getFeatures(track_id){
  if (!track_id)
    return null;
  const features = await fetch(new Request(
    'https://api.spotify.com/v1/audio-features/' + track_id, 
    { 
      headers: new Headers({ 
        'Authorization': 'Bearer ' + getCookie('DAZUMA_ACCESS_TOKEN'), 
        'Accept': 'application/json' 
      }) 
    }
  ))
    .then(res => res.json())
    .then(res =>{
      if (res.error && res.error.status === 401){
        getNewToken(); 
        return null;
      }

      return res;
  });

  return features;
}

// TODO: arreglar esta función. Hay un problema con el servidor al dar respuesta a esta función
async function getNewToken(){
  console.log("Getting new token with "+getCookie('DAZUMA_REFRESH_TOKEN'))
  auth();
  // await fetch('http://localhost:8001/refresh?token=' + getCookie('DAZUMA_REFRESH_TOKEN'))
  //   // .then(res => res.json())
  //   // .then(res => {
  //   //   getInfo();
  //   // })
  //   .catch(err => console.error(err));
}