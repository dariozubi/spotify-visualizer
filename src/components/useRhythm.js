import { useState } from 'react'
import { useFrame } from 'react-three-fiber';

export default function useRhythm(props){

  const [tatum, setTatum] = useState(0);
  const [bar, setBar] = useState(0);
  const [beat, setBeat] = useState(0);
  const [section, setSection] = useState(0);
  const [segment, setSegment] = useState(0);
  const [tempo, setTempo] = useState(0);
  const [key, setKey] = useState(0);
  const [mode, setMode] = useState(0);
  const [loudness, setLoudness] = useState(0);

  const [tatum_confidence, setTatumConfidence] = useState(0);
  const [bar_confidence, setBarConfidence] = useState(0);
  const [beat_confidence, setBeatConfidence] = useState(0);
  const [section_confidence, setSectionConfidence] = useState(0);
  const [segment_confidence, setSegmentConfidence] = useState(0);
  const [tempo_confidence, setTempoConfidence] = useState(0);
  const [key_confidence, setKeyConfidence] = useState(0);
  const [mode_confidence, setModeConfidence] = useState(0);

  const [tempo_pulse, setTempoPulse] = useState(false);

  useFrame(() => {

  	if (props.active){

      const progress = props.track_progress + window.performance.now() - props.last_update;

      props.setMainState({
        track_progress: progress, 
        last_update: window.performance.now()
      });

      for (let i=props.track_analysis.sections.length-1; i>=0; i--){

        if (progress > props.track_analysis.sections[i].start 
          && tempo !== props.track_analysis.sections[i].tempo){

            setTempo(props.track_analysis.sections[i].tempo/60*1000/props.track_analysis.sections[i].time_signature);
            setTempoConfidence(props.track_analysis.sections[i].tempo_confidence);
            setKey(props.track_analysis.sections[i].key);
            setKeyConfidence(props.track_analysis.sections[i].key_confidence);
            setMode(props.track_analysis.sections[i].mode);
            setModeConfidence(props.track_analysis.sections[i].mode_confidence);
            setLoudness(props.track_analysis.sections[i].loudness);
            break;

        }

      }

      setTempoPulse(props.track_progress % tempo < 100 
        && props.track_progress > props.track_analysis.track.end_of_fade_in
        && props.track_progress < props.track_analysis.track.start_of_fade_out);

    }

    else{

      props.setMainState({
        last_update: window.performance.now()
      });

    }
  });
	
  return {
      tatum: tatum,
      bar: bar,
      beat: beat,
      section: section,
      segment: segment,
      tempo: tempo,
      key: key,
      mode: mode,
      loudness: loudness,
      tatum_confidence: tatum_confidence,
      bar_confidence: bar_confidence,
      beat_confidence: beat_confidence,
      section_confidence: section_confidence,
      segment_confidence: segment_confidence,
      tempo_confidence: tempo_confidence,
      key_confidence: key_confidence,
      mode_confidence: mode_confidence,
      tempo_pulse: tempo_pulse
    };
}