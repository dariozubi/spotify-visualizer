import create from 'zustand';

export const useStore = create(set => ({
  isPlaying: false,
  setIsPlaying: (val) => set(state => ({ isPlaying: val})), 
  track: null,  
  setTrack: (val) => set(state => ({ track: val})), 
  analysis: null,
  setAnalysis: (val) => set(state => ({ analysis: val})), 
  features: null,
  setFeatures: (val) => set(state => ({ features: val})), 
  progress: 0,
  setProgress: (val) => set(state => ({ progress: val}))
}));