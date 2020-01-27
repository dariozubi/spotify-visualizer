# spotify-visualizer

> For the moment this is just a proof of concept.

## Description

Inspired by [kaleidosync](https://github.com/zachwinter/kaleidosync), this project shows a very simple audio reactive 3D scene. Based on [CRA](https://github.com/facebook/create-react-app) with some additions to the Node server for the Spotify API handling. The 3D part comes from the ThreeJS react renderer [react-three-fiber](https://github.com/react-spring/react-three-fiber).

## To test locally
1. Create a new Spotify app in [Spotify's dashboard](https://developer.spotify.com/dashboard/).
2. Add `http://localhost:8001/callback` to the Redirect URIs.
3. Use the **Client ID** and **Client Secret** and set them on the `.env` file.
4. Install dependencies running `npm install` on the root directory.
5. Start the application `npm run start`.
6. Go to [http://localhost:8000](http://localhost:8000) and log in to your Spotify account.
7. Play a song and see the pebbles move.