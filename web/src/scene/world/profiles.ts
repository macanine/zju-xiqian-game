export interface WorldSceneProfile {
  background: number;
  fog: number;
  fogDensity: number;
  sunColor: number;
  sunIntensity: number;
  rimColor: number;
  rimIntensity: number;
  cameraDistance: number;
  cameraHeight: number;
  lookAhead: number;
}

const baseProfile: WorldSceneProfile = {
  background: 0x13271c,
  fog: 0x1a3326,
  fogDensity: 0.014,
  sunColor: 0xffdfae,
  sunIntensity: 4.4,
  rimColor: 0x6ea4a1,
  rimIntensity: 1.7,
  cameraDistance: 11.5,
  cameraHeight: 6.4,
  lookAhead: 6.8,
};

const profiles: Record<string, Partial<WorldSceneProfile>> = {
  "prologue-hangzhou": {
    background: 0x1c2c24,
    fog: 0x20382c,
    fogDensity: 0.011,
    sunColor: 0xffd4a0,
    cameraDistance: 12.4,
    cameraHeight: 5.8,
    lookAhead: 7.4,
  },
  "01-xitianmushan": {
    background: 0x102d25,
    fog: 0x174033,
    fogDensity: 0.02,
    sunColor: 0xd7edcf,
    sunIntensity: 3.8,
    rimColor: 0x72b4a2,
    cameraDistance: 9.8,
    cameraHeight: 7.4,
    lookAhead: 5.7,
  },
  "02-jiande": {
    background: 0x173039,
    fog: 0x21434a,
    fogDensity: 0.012,
    sunColor: 0xffd9ae,
    rimColor: 0x6b9fad,
    cameraDistance: 12.8,
    cameraHeight: 6.1,
    lookAhead: 8.1,
  },
  "03-jian": {
    background: 0x30251e,
    fog: 0x4a3829,
    fogDensity: 0.009,
    sunColor: 0xffc78f,
    sunIntensity: 4.8,
    rimColor: 0x9b7861,
    cameraDistance: 13.2,
    cameraHeight: 5.7,
    lookAhead: 8.4,
  },
  "04-taihe": {
    background: 0x1a302d,
    fog: 0x31504a,
    fogDensity: 0.018,
    sunColor: 0xe6d7b1,
    sunIntensity: 3.9,
    rimColor: 0x75a6a0,
    cameraDistance: 12.2,
    cameraHeight: 6.2,
    lookAhead: 7.2,
  },
  "05-yishan": {
    background: 0x102d20,
    fog: 0x1c4932,
    fogDensity: 0.022,
    sunColor: 0xd0e8bf,
    sunIntensity: 3.7,
    rimColor: 0x61a487,
    cameraDistance: 9.9,
    cameraHeight: 7.2,
    lookAhead: 5.9,
  },
  "06-zunyi-meitan": {
    background: 0x1b2a2a,
    fog: 0x374b49,
    fogDensity: 0.026,
    sunColor: 0xd8d9c5,
    sunIntensity: 3.5,
    rimColor: 0x7e9b99,
    cameraDistance: 10.6,
    cameraHeight: 7.8,
    lookAhead: 6.2,
  },
  "finale-1946": {
    background: 0x302b20,
    fog: 0x554937,
    fogDensity: 0.008,
    sunColor: 0xffd8a0,
    sunIntensity: 4.9,
    rimColor: 0xa47f5c,
    cameraDistance: 13.6,
    cameraHeight: 5.4,
    lookAhead: 8.8,
  },
};

export function getWorldSceneProfile(nodeId: string, eventId?: string): WorldSceneProfile {
  const profile = { ...baseProfile, ...profiles[nodeId] };
  if (eventId === "re-airraid") {
    return {
      ...profile,
      background: 0x141c1b,
      fog: 0x293533,
      fogDensity: 0.03,
      sunIntensity: 2.6,
      rimColor: 0x718887,
      rimIntensity: 1.1,
      cameraDistance: profile.cameraDistance - 1.2,
      cameraHeight: profile.cameraHeight - 0.5,
      lookAhead: profile.lookAhead - 0.8,
    };
  }
  if (eventId === "re-disease") {
    return {
      ...profile,
      fog: 0x53605a,
      fogDensity: Math.max(profile.fogDensity, 0.034),
      sunIntensity: profile.sunIntensity * 0.72,
      rimIntensity: profile.rimIntensity * 0.65,
    };
  }
  if (eventId === "re-camp") {
    return {
      ...profile,
      background: 0x1b211d,
      fog: 0x374039,
      fogDensity: Math.max(profile.fogDensity, 0.024),
      sunIntensity: profile.sunIntensity * 0.64,
      cameraDistance: profile.cameraDistance - 0.6,
      cameraHeight: profile.cameraHeight - 0.7,
    };
  }
  return profile;
}
