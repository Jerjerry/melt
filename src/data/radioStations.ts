import { RadioStation } from '../types';

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'lofi_chill',
    name: 'Lo-Fi Chill & Study',
    genre: 'Lo-Fi',
    description: 'Warm vinyl beats, Rhodes chords, and soothing downtempo rhythms.',
    tracks: [
      { id: 'lf_1', title: 'Midnight Coffee in Shibuya', artist: 'Nujabes Tribute', genre: 'Lo-Fi', duration: 164 },
      { id: 'lf_2', title: 'Raindrops on Neon Glass', artist: 'Kavinsky Chords', genre: 'Lo-Fi', duration: 192 },
      { id: 'lf_3', title: 'Late Night Code Flow', artist: 'Antigravity Ensemble', genre: 'Lo-Fi', duration: 180 },
      { id: 'lf_4', title: 'Autumn Leaves & Warm Tea', artist: 'Chillhop Society', genre: 'Lo-Fi', duration: 210 },
    ],
  },
  {
    id: 'synthwave_80s',
    name: 'Synthwave & Cyberpunk',
    genre: 'Synthwave',
    description: 'Analog synth basslines, gated snares, and neon retrowave arpeggios.',
    tracks: [
      { id: 'sw_1', title: 'Outrun the Redline', artist: 'Laser Highway', genre: 'Synthwave', duration: 220 },
      { id: 'sw_2', title: 'Cybernetic Horizon 2084', artist: 'Glitch Runner', genre: 'Synthwave', duration: 198 },
      { id: 'sw_3', title: 'Grid Protocol Zero', artist: 'Neo Tokyo Sound', genre: 'Synthwave', duration: 245 },
    ],
  },
  {
    id: 'rock_90s',
    name: '90s Alternative Rock',
    genre: '90s Rock',
    description: 'Distorted guitars, driving drums, and energetic grunge anthems.',
    tracks: [
      { id: 'rk_1', title: 'Smells Like Overdrive', artist: 'Seattle Soundwaves', genre: '90s Rock', duration: 240 },
      { id: 'rk_2', title: 'Black Sun Satellite', artist: 'Soundgarden Drift', genre: '90s Rock', duration: 215 },
      { id: 'rk_3', title: 'Bullet with Butterfly Wings', artist: 'Pumpkin Patch', genre: '90s Rock', duration: 250 },
    ],
  },
  {
    id: 'hiphop_chill',
    name: 'Boom Bap & Golden Era',
    genre: 'Hip-Hop',
    description: 'Heavy bass kicks, jazz samples, and classic 90s flow.',
    tracks: [
      { id: 'hh_1', title: 'Brooklyn Rooftop Cipher', artist: 'Dilla Groove', genre: 'Hip-Hop', duration: 185 },
      { id: 'hh_2', title: 'Concrete Boulevard', artist: 'Nasir Roots', genre: 'Hip-Hop', duration: 204 },
      { id: 'hh_3', title: 'Soul Brother Vinyl', artist: 'Pete Rock Style', genre: 'Hip-Hop', duration: 195 },
    ],
  },
  {
    id: 'jazz_lounge',
    name: 'Midnight Jazz Lounge',
    genre: 'Jazz',
    description: 'Muted trumpet, upright bass, and smoky café piano.',
    tracks: [
      { id: 'jz_1', title: 'Blue in Green Lights', artist: 'Miles Mood', genre: 'Jazz', duration: 310 },
      { id: 'jz_2', title: 'Autumn in Manhattan', artist: 'Bill Evans Trio Tribute', genre: 'Jazz', duration: 280 },
      { id: 'jz_3', title: 'C-Jam Blues Session', artist: 'Duke Collective', genre: 'Jazz', duration: 240 },
    ],
  },
  {
    id: 'ambient_focus',
    name: 'Deep Ambient & Space',
    genre: 'Ambient',
    description: 'Deep modular drone textures and generative soundscapes.',
    tracks: [
      { id: 'am_1', title: 'Apollo Lunar Descent', artist: 'Brian Eno Space', genre: 'Ambient', duration: 360 },
      { id: 'am_2', title: 'Atmospheric Entry 16kHz', artist: 'Deep Space DSP', genre: 'Ambient', duration: 420 },
    ],
  },
];
