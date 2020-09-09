const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const request = require('request');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:8000');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(cookieParser());

app.get('/refresh', (req, res) => {
  const refresh_token = req.query.token;

  if (!refresh_token) {
    res.status(400);
    res.send({ ERROR: 'No token provided.' });
    return
  }

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 
      'Authorization': 'Basic ' + (Buffer.from(process.env.client_id + ':' + process.env.client_secret).toString('base64'))
    },
    form: {
      refresh_token: refresh_token,
      grant_type: 'refresh_token'
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.cookie(process.env.access_token, body.access_token);
      res.cookie(process.env.refresh_token, body.refresh_token);
      res.redirect('http://localhost:8000/');
    } else {
      res.send({ message: 'The end is near'});
    };
  });
});

app.get('/login', (req, res) => {
  const auth_id = req.query.auth_id
  const query = querystring.stringify({
    response_type: 'code',
    client_id: process.env.client_id,
    scope: process.env.scope,
    redirect_uri: process.env.redirect_uri,
    state: auth_id
  });

  res.redirect('https://accounts.spotify.com/authorize?' + query);
});

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  // TODO: add error handling based on req.query.error
  
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: process.env.redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(process.env.client_id + ':' + process.env.client_secret).toString('base64'))
    },
    json: true
  };
  
  request.post(authOptions, (error, response, body) => {
    if (!error && res.statusCode === 200) {
      res.cookie(process.env.access_token, body.access_token);
      res.cookie(process.env.refresh_token, body.refresh_token);
      res.redirect('http://localhost:8000/');
    } else {
      res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
    }
  })
})

app.get('/auth', (req, res) => {
  const auth_id = Math.random().toString(36).slice(5, 11)
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ auth_id: Math.random().toString(36).slice(5, 11) }));
});

app.listen(8001, () =>
  console.log('Express server is running on localhost:8001')
);