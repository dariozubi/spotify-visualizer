import { useState } from 'react'
import { useFrame } from 'react-three-fiber';

export default function useRhythm(props){

  const [last_track_progress, setLastTrackProgress] = useState(-1);

  const [tatum, setTatum] = useState(-1);
  const [bar, setBar] = useState(-1);
  const [beat, setBeat] = useState(-1);
  const [section, setSection] = useState(-1);
  const [segment, setSegment] = useState(-1);

  const [next_tatum, setNextTatum] = useState(-1);
  const [next_bar, setNextBar] = useState(-1);
  const [next_beat, setNextBeat] = useState(-1);
  const [next_section, setNextSection] = useState(-1);
  const [next_segment, setNextSegment] = useState(-1);

  const [tempo, setTempo] = useState(0);
  const [key, setKey] = useState(0);
  const [mode, setMode] = useState(0);
  const [loudness, setLoudness] = useState(0);

  const [tempo_pulse, setTempoPulse] = useState(false);
  const [tatum_pulse, setTatumPulse] = useState(false);
  const [beat_pulse, setBeatPulse] = useState(false);
  const [bar_pulse, setBarPulse] = useState(false);
  const [segment_pulse, setSegmentPulse] = useState(false);
  const [section_pulse, setSectionPulse] = useState(false);

  useFrame(() => {

  	if (props.active){

      const progress = props.track_progress + window.performance.now() - props.last_update;

      if (Math.abs(last_track_progress - progress) > 3000){
        setNextTatum(0);
        setNextSection(0);
        setNextBeat(0);
        setNextBar(0);
        setNextSegment(0);
      }

      if (progress > next_section){

        for (let i=props.track_analysis.sections.length-1; i>=0; i--){

          if (progress > props.track_analysis.sections[i].start 
            && section !== props.track_analysis.tatums[i].start){

              setSection(props.track_analysis.sections[i].start);
              setNextSection(props.track_analysis.sections[i+1].start);
              setSectionPulse(!section_pulse);
              setTempo(props.track_analysis.sections[i].tempo/60*1000/props.track_analysis.sections[i].time_signature);
              setKey(props.track_analysis.sections[i].key);
              setMode(props.track_analysis.sections[i].mode);
              setLoudness(props.track_analysis.sections[i].loudness);
              break;

          }

        }

      }

      if (progress > next_tatum){

        for (let i=props.track_analysis.tatums.length-1; i>=0; i--){

          if (progress > props.track_analysis.tatums[i].start
            && tatum !== props.track_analysis.tatums[i].start){

              setTatum(props.track_analysis.tatums[i].start);
              setNextTatum(props.track_analysis.tatums[i+1].start);
              setTatumPulse(!tatum_pulse);
              break;

          }

        }

      }

      if (progress > next_beat){

        for (let i=props.track_analysis.beats.length-1; i>=0; i--){

          if (progress > props.track_analysis.beats[i].start
            && beat !== props.track_analysis.beats[i].start){

              setBeat(props.track_analysis.beats[i].start);
              setNextBeat(props.track_analysis.beats[i+1].start);
              setBeatPulse(!beat_pulse);
              break;

          }

        }

      }

      if (progress > next_bar){

        for (let i=props.track_analysis.bars.length-1; i>=0; i--){

          if (progress > props.track_analysis.bars[i].start
            && bar !== props.track_analysis.bars[i].start){

              setBar(props.track_analysis.bars[i].start);
              setNextBar(props.track_analysis.bars[i+1].start);
              setBarPulse(!bar_pulse);
              break;

          }

        }

      }

      if (progress > next_segment){

        for (let i=props.track_analysis.segments.length-1; i>=0; i--){

          if (progress > props.track_analysis.segments[i].start
            && segment !== props.track_analysis.segments[i].start){

              setSegment(props.track_analysis.segments[i].start);
              setNextSegment(props.track_analysis.segments[i+1].start);
              setSegmentPulse(!segment_pulse);
              break;

          }

        }

      }

      setTempoPulse(props.track_progress % tempo < 100 
        && props.track_progress > props.track_analysis.track.end_of_fade_in
        && props.track_progress < props.track_analysis.track.start_of_fade_out);

      props.setMainState({
        track_progress: progress, 
        last_update: window.performance.now()
      });

      setLastTrackProgress(progress);
    }

    else{

      props.setMainState({
        last_update: window.performance.now()
      });

      setNextTatum(0);
      setNextSection(0);
      setNextBeat(0);
      setNextBar(0);
      setNextSegment(0);

    }
  });
	
  return {
      tempo: tempo,
      key: key,
      mode: mode,
      loudness: loudness,
      tempo_pulse: tempo_pulse,
      tatum_pulse: tatum_pulse,
      beat_pulse: beat_pulse,
      bar_pulse: bar_pulse,
      segment_pulse: segment_pulse,
      section_pulse: section_pulse
    };
}