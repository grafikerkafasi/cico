/*
 * Bölüm 2 Flow (Veo 3.1 Fast) promptları. Ayar: Video · Frames · 9:16 · 8 sn · x1.
 * Start = End = sahne görseli (assets/scenes/c2/<KOD>.jpg) → kesintisiz döngü.
 * Bölüm 1'in sabit kuralları (production/flow-prompts.js RULES) aynen geçerli; ek olarak:
 *  - karakterler neredeyse kıpırdamaz (yalnızca göz kırpma ve nefes), konuşmaz, ses çıkarmaz;
 *  - nida/iç çekme/nefes sesi yok; arka plan kalabalık uğultusu anlaşılmaz ve kısık olabilir.
 * `node tools/flow-prompt-c2.js` → production/flow-prompts-c2.json (otomasyon bunu okur).
 */
(function (root) {
  'use strict';
  const base = typeof module === 'object' && module.exports ? require('./flow-prompts.js') : root.CICO_FLOW;

  const STILL =
    'The characters stay almost completely still for the whole video, holding exactly the pose they have in the image: ' +
    'no gestures, no talking, no lip movement, no head turns, no walking; only their eyes blink and their chests breathe very slightly. ';

  const AUDIO = (ambient) =>
    `Audio: natural ambient sound only — ${ambient}. NO HUMAN VOICES AT ALL: no speech, no dialogue, no words, no language of any kind, ` +
    'no talking or chatter in the background, no whispering, no shouting, no gasps, no sighs, no exclamations, no laughing, no humming, no singing. ' +
    'Where there is a crowd, it is only a soft, blurred general hum of the place and the street, like distant room tone, in which no single voice or word can be heard. No music.';

  // Mekân grupları: ortamda ne hafifçe kıpırdar + ortam sesi
  const PLACE = {
    school: { env: 'leaves sway gently, soft daylight shifts on the stone, a few pigeons on the ground peck quietly', amb: 'the general sound of a school street: a soft distant crowd hum, birds chirping, light street traffic far away' },
    steps: { env: 'the street lamps glow and flicker very softly, leaves sway, pigeons on the cobblestones shuffle slightly, the cobblestones glisten', amb: 'a quiet evening street, distant traffic, a far-off seagull, leaves rustling' },
    classroom: { env: 'dust floats in the light from the window, a curtain moves very slightly', amb: 'a quiet classroom, a clock ticking, chairs creaking faintly, birds outside' },
    warehouse: { env: 'fluorescent tubes flicker faintly, dust floats in the light', amb: 'fluorescent lights buzzing, a distant forklift, metal shutters rattling softly far away' },
    home: { env: 'the screen glow flickers softly on the walls, a curtain moves very slightly', amb: 'a quiet room, faint city hum outside, a fridge humming softly' },
    office: { env: 'monitor screens glow and flicker subtly, city lights twinkle outside the window', amb: 'a quiet office at night, air conditioning hum, a faint electronic buzz' },
    traffic: { env: 'heat shimmer above the asphalt, distant cars and seagulls move in the background', amb: 'midday Karaköy traffic hum, distant car horns, seagulls, scooters passing far away' },
    teahouse: { env: 'steam rises from the tea glasses, the awning sways slightly, background figures move very little', amb: 'a busy tea stall by the waterfront: tea glasses clinking on saucers, a kettle bubbling, a soft general crowd hum, seagulls, scooters and traffic in the distance' },
    kahvehane: { env: 'steam rises from the tea glasses, the hanging lamps glow and flicker softly', amb: 'an old coffee house: tea glasses clinking, backgammon pieces clicking, chairs scraping, a soft general room hum' },
    hospital: { env: 'the fluorescent light flickers faintly, light from the window shifts slightly', amb: 'a quiet hospital corridor, a distant monitor beeping, soft ventilation hum' },
    bridge_under: { env: 'the water glitters, the low sun shimmers, hanging lamps sway slightly, background couriers move very little', amb: 'water lapping under the Galata Bridge, seagulls, muffled traffic passing overhead, a soft general crowd hum' },
    night_street: { env: 'the street lamps flicker softly, rain falls lightly and puddles ripple, reflections shimmer on the wet cobblestones', amb: 'light rain on a narrow night street, water dripping from gutters, distant traffic, a street lamp buzzing' },
    bridge_night: { env: 'headlights and city lights shimmer, the water below glitters, light wind', amb: 'night traffic on the Galata Bridge, wind, a distant tram bell, the sea below' },
    coast_rain: { env: 'heavy rain falls and splashes on the road, puddles ripple, distant headlights shimmer', amb: 'heavy rain on asphalt, distant trucks passing, wind from the sea' },
    blue_night: { env: 'blue emergency lights pulse softly across the walls, light rain falls', amb: 'a tense night street, a distant siren fading, light rain, a soft distant street hum' },
    rain_morning: { env: 'rain falls steadily, puddles ripple on the steps, leaves drip', amb: 'steady morning rain on stone steps and leaves, distant traffic' },
  };

  // Sahne → mekân (+ isteğe bağlı ek ortam hareketi)
  const MAP = {
    '2A0': ['home'], '2AI': ['office'], '2A1': ['warehouse'],
    '2A2': ['school'], '2A2-a': ['school'], '2A2-b': ['school'], '2A2-c': ['school'], '2A2-d': ['school'],
    '2A3': ['classroom'], '2A4': ['school'], '2A4-a': ['school'], '2A4-b': ['school'], '2A4-c': ['school'],
    '2A5': ['traffic'], '2A5b': ['teahouse'], '2A6': ['kahvehane'],
    '2A7': ['kahvehane'], '2A7-a': ['kahvehane'], '2A7-b': ['kahvehane'], '2A7-c': ['kahvehane'],
    '2A8': ['school'], '2A9': ['school'], '2A9-a': ['school'], '2A9-b': ['school'], '2A9-c': ['school'], '2A9-d': ['office'], '2A9-e': ['school'],
    '2A10': ['steps'], '2A10-a': ['steps'], '2A10-b': ['steps', 'steam rises from the two paper tea cups'], '2A10-c': ['steps'],
    '2A10b': ['night_street'], '2A11': ['warehouse', 'the half-open shutter rattles faintly in the night air'],
    '2A12': ['bridge_night'], '2A13a': ['night_street'], '2A13b': ['bridge_night', 'the fallen scooter\'s front wheel keeps spinning slowly'],
    '2SA1': ['school'], '2SA2': ['school'], '2SA3': ['rain_morning'], '2SA4': ['school'], '2SA5': ['school'], '2SA6': ['office'],
    '2B0': ['home'], '2BK': ['home'], '2B1': ['school'],
    '2B2': ['school'], '2B2-a': ['school'], '2B2-b': ['school'], '2B2-c': ['school'], '2B2-d': ['school'],
    '2B2b': ['teahouse'], '2B3a': ['kahvehane'], '2B3b': ['hospital'], '2B4': ['bridge_under'],
    '2B5': ['bridge_under'], '2B5-a': ['bridge_under'], '2B5-b': ['bridge_under'], '2B5-c': ['bridge_under'],
    '2B6': ['classroom'], '2B7': ['steps'], '2B7-a': ['steps'], '2B7-b': ['steps'], '2B7-c': ['steps'], '2B7-d': ['steps'],
    '2B7b': ['night_street'], '2B8': ['night_street'],
    '2B9': ['night_street'], '2B9-a': ['night_street'], '2B9-b': ['night_street'], '2B9-c': ['night_street'], '2B9-d': ['night_street'], '2B9-e': ['night_street'],
    '2B10': ['coast_rain'], '2B11a': ['bridge_under'], '2B11b': ['coast_rain'],
    '2SB1': ['school'], '2SB2': ['school'], '2SB3': ['blue_night'], '2SB4': ['kahvehane'], '2SB5': ['school'], '2SB6': ['bridge_under'],
  };

  function prompt(code) {
    const m = MAP[code];
    if (!m) throw new Error('flow-prompts-c2: sahne yok ' + code);
    const p = PLACE[m[0]];
    const env = m[1] ? `${m[1]}; ${p.env}` : p.env;
    return `${base.RULES} ${STILL}Only the environment is subtly alive and only with things already in the image: ${env}. ` +
      'If something listed here is not in the image, leave it out. ' + AUDIO(p.amb);
  }

  const api = { MAP, PLACE, prompt };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CICO_FLOW_C2 = api;
})(typeof window !== 'undefined' ? window : globalThis);
