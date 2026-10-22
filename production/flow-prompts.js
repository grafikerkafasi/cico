/*
 * Google Flow (Veo) video promptları — her sahne görselini, başka hiçbir şey eklemeden/çıkarmadan
 * hareketlendirmek için. Ayar: Video · Frames · 9:16 · Veo 3.1 Fast · 8 sn · x1.
 * Start frame = End frame = sahne görseli (assets/scenes/<KOD>_<scene_id>.jpg).
 * Böylece video bizim görselimizle başlar ve AYNI görselle biter; seçimler son karede gelir,
 * istenirse döngü de kesintisiz olur.
 *
 * Prompt = RULES (sabit) + sahneye özel MOTION + AMBIENT. `node tools/flow-prompt.js <KOD>` tam metni basar.
 */
(function (root) {
  'use strict';

  // Her promptun başına aynen eklenir. Flow'un "coşmasını" engelleyen kurallar.
  const RULES =
    'Animate THIS EXACT IMAGE as one continuous vertical 9:16 shot. The start frame and the end frame are the same image: ' +
    'the video must begin on this exact frame and settle back onto this exact same frame at the end, so it can loop seamlessly. ' +
    'Keep everything exactly as it is: same characters, faces, hair, light stubble and thin moustache, clothes, the green hoodie and the round "26" badge, ' +
    'the helmet, the green scooter, all props, the composition, the framing, the camera position, the lighting, the colours and the Pixar-style stylized 3D look. ' +
    'Do NOT add or remove any person, animal, object, vehicle, sign, text or logo. No readable text anywhere. ' +
    'No cuts, no new angles, no zoom reveal, no camera shake, no morphing, no face changes. ' +
    'Characters never look into or turn towards the camera. Cico keeps his head still in exactly the direction it has in the image: he does NOT turn or swivel his head left, right or back, he does not look around; only his eyes may blink and his chest may breathe. No light rays, light beams, lens flares or sudden bright flashes. ' +
    'Only small, natural, physically believable motion that gently returns to the starting pose by the last second.';

  const AUDIO = (ambient) =>
    `Audio: natural ambient sound only — ${ambient}. Absolutely no speech, no dialogue, no voices, no whispering, no singing, no music.`;

  // MOTION: yalnızca görselde zaten olan şeyler hareket eder. AMBIENT: ortam sesi.
  const SHOTS = {
    O2: {
      motion: 'Cico breathes slowly and blinks, head still, his thumb hovers over the phone; the two floating glowing order cards bob very gently in place; neon signs flicker softly; light fog drifts; rain glistens on the cobblestones.',
      ambient: 'distant tavern chatter and laughter, light rain, a far-off car horn',
    },
    O3: {
      motion: 'Tracking shot moving with the scooter: Cico and the scooter stay in the same place in the frame while the street lights and shop fronts stream past with motion blur, the wheels spin, water sprays softly from the tyres, his hoodie flutters in the wind.',
      ambient: 'scooter engine humming, tyres on wet asphalt, rain hiss, wind',
    },
    A1: {
      motion: 'The gloved hand in the doorway pulls back slightly and returns; Cico breathes with his head still, eyes on the package, his thumb hesitating near the lifted corner of the tape; the warm light inside the doorway flickers faintly; light rain falls.',
      ambient: 'light rain, a distant dog barking, a door creaking softly',
    },
    A1a: {
      motion: 'Almost a still image. Cico is frozen in shock exactly as in the image: his head, face, shoulders and arms do not move at all for the whole video; only his eyes blink once and his chest rises with one breath. The street lamp flickers once; light rain falls in the background; the puddles ripple.',
      ambient: 'light rain, a buzzing street lamp, distant traffic',
    },
    A1b: {
      motion: 'Cico sits still on the seat, holding the handlebar, breathing; the tail light glows softly; rain falls and puddles ripple on the cobblestones; the street lamp flickers gently.',
      ambient: 'scooter idling, light rain, water dripping from a gutter',
    },
    A2: {
      motion: 'Very slow, calm motion: Cico breathes slowly, his head stays still; leaves and children\'s drawings on the railings flutter slightly in the breeze; the single lamp glows steadily.',
      ambient: 'soft night breeze, a scooter idling very quietly, distant city hum',
    },
    A3a: {
      motion: 'The black car\'s headlights glare and flicker faintly; the man in the coat stands still beside the open door, his coat moving slightly in the wind; Cico breathes heavily, steadying himself on the scooter; rain falls in the headlight beams.',
      ambient: 'a car engine idling, light rain, wind in a narrow street',
    },
    A3: {
      motion: 'The man in the coat is an original, fictional Pixar-style cartoon character (not a real person). He holds out his gloved hand, perfectly calm, a faint smile; his coat stirs slightly in the wind; Cico breathes, clutching the package; the black car\'s headlights glow behind; the tower lights shimmer; light rain falls.',
      ambient: 'a car engine idling, wind, distant seagulls, light rain',
    },
    A4: {
      motion: 'Cico sits still on the rooftop, breathing slowly; the phone screen glow pulses softly on his face; the city lights twinkle and tiny headlights crawl along the roads far below; a gentle breeze moves his hair.',
      ambient: 'distant city hum, wind on the rooftop, a far-off ship horn',
    },
    A5: {
      motion: 'Tense, held moment, very little movement: the scooter vibrates slightly as the engine idles; Cico stays in the same pose with his face in profile, breathing fast, his head still; a soft, dim white glow from car headlights slowly brightens a little on the wet wall at the right edge and fades again (no beams, no rays); rain falls on the steps; the lantern inside the empty arched passage flickers gently. The steps and the arched passage stay clearly visible the whole time.',
      ambient: 'scooter engine revving, rain, a car engine approaching from behind',
    },
    A5b: {
      motion: 'Quiet aftermath: Cico breathes heavily on the ground, slowly raising his head; the man with the umbrella keeps walking slowly away up the steps; rain falls on the stones; the scooter\'s headlight flickers.',
      ambient: 'rain on stone steps, slow fading footsteps, a scooter engine ticking as it cools',
    },
    A5c: {
      motion: 'Extreme stillness: raindrops fall around the envelope and ripple in the thin puddles; the street lamps shimmer in the blurred background; the envelope stays exactly in place.',
      ambient: 'gentle rain on stone, water dripping, distant city hum',
    },
    A6: {
      motion: 'The man holds the folded paper out, almost motionless; Cico grips the package tighter and breathes; the background stays softly blurred and quiet; a light breeze moves the man\'s coat.',
      ambient: 'near silence, a soft wind, very distant city hum',
    },
    B0: {
      motion: 'Cico lowers the pharmacy bag into the scooter box and straightens a little, then returns to the same pose; the green cross sign glows and pulses softly; its green reflection shimmers on the wet pavement; light rain falls.',
      ambient: 'light rain, the buzz of a neon sign, a distant car passing',
    },
    B1: {
      motion: 'The kid smiles and looks up at Cico, the door moves very slightly; Cico smiles warmly holding out the bag; the grandmother in the background nods gently; the warm room light glows steadily.',
      ambient: 'stairwell echo, a TV murmuring indistinctly inside, a clock ticking',
    },
    B2: {
      motion: 'The phone glow flickers softly; the hand holding the phone trembles very slightly; dust floats in the dim stairwell light; the chain on the door sways a little.',
      ambient: 'dripping water, a distant siren, stairwell echo',
    },
    B2a: {
      motion: 'Tracking shot moving with the scooter: the Tribe Chief stays in place in the frame while the street lights stream past with motion blur; he glances at the phone in his hand and at the mirror; the black car\'s headlights behind him grow a little brighter and dim again; the wheels spin, water sprays.',
      ambient: 'scooter engine, tyres on wet asphalt, a car engine close behind, rain',
    },
    B3: {
      motion: 'The Tribe Chief, sitting on the kerb, raises his hand slowly and lowers it, breathing heavily; distant blue ambulance lights pulse; the red tail lights of the black car in the background flicker; rain falls; Cico breathes in the foreground.',
      ambient: 'traffic, a distant ambulance siren, rain, heavy breathing',
    },
    B3a: {
      motion: 'We see Cico only from behind, exactly as in the image, for the whole video: the back of his helmet and hoodie; his face is NEVER visible and he never turns his head. Nothing is added to the helmet (no number, no badge on the helmet). He sits perfectly still on the dark scooter; ahead, the black car\'s red tail lights glow and its exhaust drifts; rain falls and red reflections ripple on the wet cobbles.',
      ambient: 'a car engine idling ahead, light rain, the scooter engine off',
    },
    B4: {
      motion: 'Slow, tired motion in the hospital corridor: couriers shift slightly in their seats and breathe; the fluorescent light flickers once; the Tribe Chief looks at his phone; Cico stands holding his phone.',
      ambient: 'a quiet hospital corridor hum, a soft distant monitor beep, a chair creaking',
    },
    B5: {
      motion: 'Cico crouches in the shadows, breathing quietly; the light from the ajar door spills and flickers; the monitors in the basement window glow and the green dots twinkle; light rain falls.',
      ambient: 'humming electronics, light rain, distant traffic',
    },
    SA1: {
      motion: 'Steam rises from the tea glass; the TV glow changes softly on Cico\'s face; he blinks and breathes but does not move; morning light drifts through the window.',
      ambient: 'teaspoons clinking, a muffled TV with no intelligible words, morning street sounds',
    },
    SA2: {
      motion: 'Phones on the tables light up and vibrate one after another; Cico sits still and blinks; steam rises from the tea; morning light through the window.',
      ambient: 'phones buzzing, teaspoons clinking, quiet teahouse ambience without words',
    },
    SA3: {
      motion: 'Dawn: seagulls glide across the sky; the sea glitters and small boats rock gently; the awning stirs in the breeze; Cico breathes, his head still, looking down at the open box of hard drives.',
      ambient: 'gentle waves, seagulls, a distant ferry horn, morning breeze',
    },
    SA4: {
      motion: 'Cico sits on the wet steps reading the sheet, head still; his eyes move slightly along the paper and widen; his jaw tightens; rain falls softly; the street lamps shimmer; the fallen scooter\'s headlight flickers.',
      ambient: 'soft rain on stone, distant city hum, paper rustling',
    },
    SA5: {
      motion: 'The green dots on the wall screen move slowly; one red dot stays perfectly still; Cico sits motionless, breathing slowly, the cold screen light on his face.',
      ambient: 'server room hum, air conditioning, total silence otherwise',
    },
    SB1: {
      motion: 'The crowd of couriers raises their helmets and fists, cheering; green flare smoke swirls and drifts upwards; blank placards wave; Cico and the Tribe Chief lift their arms and return; tavern lights glow.',
      ambient: 'a cheering crowd without intelligible words, clapping, helmets knocking, no engines',
    },
    SB2: {
      motion: 'The hand holding the phone stays steady with a tiny natural movement; the phone screen stays exactly the same; in the blurred background the couriers cheer, hug and wave their helmets; morning sunlight flickers through the trees.',
      ambient: 'joyful cheering crowd without intelligible words, morning birds, city sounds',
    },
    SB3: {
      motion: 'The wall of monitors glows and the green dots move slowly; Cico breathes, frozen in shock; the man in the coat stands still in the doorway behind him; the light flickers faintly.',
      ambient: 'humming electronics, a soft electrical buzz, near silence',
    },
    SB4: {
      motion: 'Dawn light grows softly; Cico sits on the scooter looking at his phone, breathing out with relief; birds fly far above; the scooter headlight glows; a light breeze moves the plants.',
      ambient: 'dawn birds, a quiet scooter engine idling, distant city waking up',
    },
  };

  const prompt = (code) => {
    const s = SHOTS[code];
    if (!s) throw new Error('Bilinmeyen sahne kodu: ' + code);
    return `${RULES}\n\nMotion: ${s.motion}\n\n${AUDIO(s.ambient)}`;
  };

  const api = { RULES, SHOTS, prompt, settings: 'Video · Frames · 9:16 · Veo 3.1 Fast · 8s · x1 · Start = End = sahne görseli' };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.CICO = root.CICO || {}).flowPrompts = api;
})(typeof self !== 'undefined' ? self : this);
