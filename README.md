# spotify-visualizer

A small React app that shows you the track analysis and features of the song you are currently hearing in Spotify.

## Description

Inspired by [kaleidosync](https://github.com/zachwinter/kaleidosync), this project shows a very simple audio reactive 3D scene. Based on [CRA](https://github.com/facebook/create-react-app) with some additions to the Node server for the Spotify API handling. The 3D part comes from the ThreeJS react renderer [react-three-fiber](https://github.com/react-spring/react-three-fiber). State is managed with [zustand](https://github.com/react-spring/zustand).

## To test locally
1. Create a new Spotify app in [Spotify's dashboard](https://developer.spotify.com/dashboard/).
2. Add `http://localhost:8001/callback` to the Redirect URIs.
3. Use the **Client ID** and **Client Secret** and set them on the `.env` file.
4. Install dependencies running `npm install` on the root directory.
5. Start the application `npm run start`.
6. Go to [http://localhost:8000](http://localhost:8000) and log in to your Spotify account.
7. Play a song and watch the analysis.

## What am I looking at?
- The album cover moves faster if the song is popular.
- The song name changes to red if it's labeled as NSFW.
- The progress bar of the song also shows the sections.
- The triangles below the progress bar show the end of the fade in and the beginning of the fade out.
- The color bars show the pithces of each segment. More green is a higher value.
- The key and mode on top of the bars and the bpm and time signature on the bottom change each section.
- Each of the audio features in the spider graph go from 0 to 1.
- All the rhythms move when they start (the actualization rate is of 150ms).