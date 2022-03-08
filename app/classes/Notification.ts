import { PATHS } from '../utils/paths';
import { IS_DEV } from '../constants/env';
/* Cache of Audio elements, for instant playback */
const cache: any = {};
const VOLUME = 0.55;

// these get packaged into renderer.prod.js which resides in the same filepath as the app.html
const sounds: any = {
  DONE: {
    url: IS_DEV ? PATHS.successSoundPath : './success.mp3',
    volume: VOLUME
  },
  HEADS_UP: {
    url: IS_DEV ? PATHS.notifySoundPath : './notify.mp3',
    volume: VOLUME
  }
};

function preload() {
  // eslint-disable-next-line no-restricted-syntax
  for (const name in sounds) {
    if (!cache[name]) {
      const sound = sounds[name];
      const audio = (cache[name] = new window.Audio());
      audio.volume = sound.volume;
      audio.src = sound.url;
    }
  }
}

function play(name: string) {
  let audio = cache[name];
  if (!audio) {
    const sound = sounds[name];
    if (!sound) {
      throw new Error('Invalid sound name');
    }
    audio = cache[name] = new window.Audio();
    audio.volume = sound.volume || VOLUME;
    audio.src = sound.url;
  }
  audio.currentTime = 0;
  audio.play();
}

export { preload, play };
