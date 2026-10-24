/* ÜRETİLDİ — elle düzenlemeyin. Kaynak: production/chapter2-script.js · node tools/gen-chapter2.js */
(function (root) {
  'use strict';
  const story = {
 "id": "chapter2",
 "chapter": 2,
 "title_key": "ui.chapter2_title",
 "start": [
  {
   "if": {
    "var": "c1_end",
    "eq": "SA5"
   },
   "goto": "c2_2ai"
  },
  {
   "if": {
    "var": "c1_end",
    "eq": "SB3"
   },
   "goto": "c2_2bk"
  },
  {
   "if": {
    "any": [
     {
      "var": "c1_end",
      "eq": "SB1"
     },
     {
      "var": "c1_end",
      "eq": "SB2"
     },
     {
      "var": "c1_end",
      "eq": "SB4"
     }
    ]
   },
   "goto": "c2_2b0"
  },
  {
   "goto": "c2_2a0"
  }
 ],
 "variables": {
  "c1_end": {
   "initial": "SA1",
   "doc": "Bölüm 1 sonu"
  },
  "c1_chief": {
   "initial": null,
   "doc": "Bölüm 1: 'stayed' | 'chased'"
  },
  "c1_earnings": {
   "initial": 0,
   "doc": "Bölüm 1 kazancı"
  },
  "earnings": {
   "initial": 0,
   "doc": "Bölüm 2 kazancı"
  },
  "filiz": {
   "initial": 0,
   "doc": "Filiz ile yakınlık"
  },
  "told_enduro": {
   "initial": false,
   "doc": "A: Endurocu'ya anlattı"
  },
  "offer": {
   "initial": null,
   "doc": "A: teklif 'accept' | 'refuse' | 'play' | 'wipe' | 'silent'"
  },
  "escaped": {
   "initial": false,
   "doc": "Jiroskop kaçışı sonucu"
  },
  "locker": {
   "initial": null,
   "doc": "B: koli 'put' | 'warn' | 'photo'"
  },
  "evidence": {
   "initial": false,
   "doc": "B: dolabın fotoğrafı çekildi"
  },
  "fund": {
   "initial": null,
   "doc": "B: Endurocu'nun parası"
  },
  "confessed_filiz": {
   "initial": false,
   "doc": "B: Filiz'e köstebek olduğunu söyledi"
  },
  "confessed": {
   "initial": false,
   "doc": "B: Kabile önünde itiraf"
  },
  "wrote_plan": {
   "initial": false,
   "doc": "B: planı adama yazdı"
  },
  "hesitated": {
   "initial": false,
   "doc": "Süre doldu"
  }
 },
 "clues": {},
 "characters": {
  "teacher": {
   "speakers": [
    "teacher"
   ]
  },
  "enduro": {
   "speakers": [
    "enduro"
   ]
  },
  "man": {
   "speakers": [
    "man"
   ]
  },
  "chief": {
   "speakers": [
    "chief"
   ]
  },
  "kid": {
   "speakers": [
    "kid"
   ]
  },
  "rota": {
   "speakers": [
    "rota"
   ]
  },
  "cico": {
   "speakers": [
    "cico"
   ]
  }
 },
 "media_aspect": 0.5625,
 "music": "assets/audio/c1_music.mp3",
 "scenes": [
  {
   "scene_id": "c2_2a0",
   "code": "2A0",
   "scene_type": "cinematic",
   "text": [
    "b0",
    {
     "key": "b1",
     "if": {
      "var": "c1_end",
      "eq": "SA1"
     }
    },
    {
     "key": "b2",
     "if": {
      "var": "c1_end",
      "eq": "SA2"
     }
    },
    {
     "key": "b3",
     "if": {
      "var": "c1_end",
      "eq": "SA3"
     }
    },
    {
     "key": "b4",
     "if": {
      "var": "c1_end",
      "eq": "SA4"
     }
    },
    {
     "key": "b5",
     "kind": "msg",
     "from": "rota"
    }
   ],
   "image_asset": "assets/scenes/c2/2A0.jpg",
   "still_motion": true,
   "next": "c2_2a1"
  },
  {
   "scene_id": "c2_2ai",
   "code": "2AI",
   "scene_type": "cinematic",
   "text": [
    "b0",
    "b1",
    {
     "key": "b2",
     "kind": "say",
     "from": "man"
    },
    "b3"
   ],
   "image_asset": "assets/scenes/c2/2AI.jpg",
   "still_motion": true,
   "next": "c2_2a1"
  },
  {
   "scene_id": "c2_2a1",
   "code": "2A1",
   "scene_type": "cinematic",
   "text": [
    "b0",
    "b1",
    "b2"
   ],
   "image_asset": "assets/scenes/c2/2A1.jpg",
   "still_motion": true,
   "next": "c2_2a2"
  },
  {
   "scene_id": "c2_2a2",
   "code": "2A2",
   "scene_type": "choice",
   "text": [
    "b0",
    {
     "key": "@characters.teacher.line",
     "kind": "intro",
     "who": "teacher"
    },
    {
     "key": "b2",
     "kind": "say",
     "from": "teacher"
    }
   ],
   "image_asset": "assets/scenes/c2/2A2.jpg",
   "still_motion": true,
   "choices": [
    {
     "id": "c0",
     "hotspot": {
      "x": 24,
      "y": 54
     },
     "effects": [
      {
       "add": {
        "earnings": 150,
        "filiz": -1
       }
      }
     ],
     "next": "c2_2a5"
    },
    {
     "id": "c1",
     "hotspot": {
      "x": 76,
      "y": 62
     },
     "effects": [
      {
       "add": {
        "filiz": 1
       }
      }
     ],
     "next": "c2_2a3"
    },
    {
     "id": "c2",
     "hotspot": {
      "x": 40,
      "y": 80
     },
     "effects": [
      {
       "add": {
        "filiz": 2
       }
      }
     ],
     "next": "c2_2a3",
     "conditions": {
      "var": "c1_end",
      "eq": "SA4"
     }
    },
    {
     "id": "timeout",
     "hidden": true,
     "effects": [
      {
       "add": {
        "earnings": 150
       },
       "set": {
        "hesitated": true
       }
      }
     ],
     "next": "c2_2a5"
    }
   ],
   "timer": {
    "seconds": 12,
    "on_timeout": "timeout"
   }
  },
  {
   "scene_id": "c2_2a3",
   "code": "2A3",
   "scene_type": "cinematic",
   "text": [
    "b0",
    {
     "key": "b1",
     "kind": "say",
     "from": "kid"
    },
    "b2",
    {
     "key": "b3",
     "kind": "say",
     "from": "teacher"
    },
    {
     "key": "b4",
     "kind": "say",
     "from": "cico"
    }
   ],
   "image_asset": "assets/scenes/c2/2A3.jpg",
   "still_motion": true,
   "next": "c2_2a4"
  },
  {
   "scene_id": "c2_2a4",
   "code": "2A4",
   "scene_type": "choice",
   "text": [
    {
     "key": "b0",
     "kind": "msg",
     "from": "rota"
    },
    {
     "key": "b1",
     "kind": "say",
     "from": "teacher"
    }
   ],
   "image_asset": "assets/scenes/c2/2A4.jpg",
   "still_motion": true,
   "choices": [
    {
     "id": "c0",
     "hotspot": {
      "x": 26,
      "y": 62
     },
     "effects": [
      {
       "add": {
        "filiz": 1
       }
      }
     ],
     "next": "c2_2a5"
    },
    {
     "id": "c1",
     "hotspot": {
      "x": 74,
      "y": 70
     },
     "effects": [
      {
       "add": {
        "earnings": 150
       }
      }
     ],
     "next": "c2_2a5"
    },
    {
     "id": "timeout",
     "hidden": true,
     "effects": [
      {
       "set": {
        "hesitated": true
       }
      }
     ],
     "next": "c2_2a5"
    }
   ],
   "timer": {
    "seconds": 10,
    "on_timeout": "timeout"
   }
  },
  {
   "scene_id": "c2_2a5",
   "code": "2A5",
   "scene_type": "cinematic",
   "text": [
    "b0",
    {
     "key": "b1",
     "kind": "msg",
     "from": "mom",
     "if": {
      "var": "c1_earnings",
      "lt": 1400
     }
    },
    {
     "key": "b2",
     "kind": "msg",
     "from": "mom",
     "if": {
      "var": "c1_earnings",
      "gte": 1400
     }
    },
    "b3"
   ],
   "image_asset": "assets/scenes/c2/2A5.jpg",
   "still_motion": true,
   "next": "c2_2a5b"
  },
  {
   "scene_id": "c2_2a5b",
   "code": "2A5b",
   "scene_type": "cinematic",
   "text": [
    "b0",
    "b1",
    {
     "key": "b2",
     "kind": "say",
     "from": "courier"
    },
    {
     "key": "b3",
     "kind": "say",
     "from": "courier"
    },
    {
     "key": "b4",
     "kind": "say",
     "from": "courier"
    },
    "b5"
   ],
   "image_asset": "assets/scenes/c2/2A5b.jpg",
   "still_motion": true,
   "next": "c2_2a6"
  },
  {
   "scene_id": "c2_2a6",
   "code": "2A6",
   "scene_type": "cinematic",
   "text": [
    "b0",
    {
     "key": "@characters.enduro.line",
     "kind": "intro",
     "who": "enduro"
    },
    "b2",
    {
     "key": "b3",
     "if": {
      "var": "c1_end",
      "eq": "SA2"
     }
    }
   ],
   "image_asset": "assets/scenes/c2/2A6.jpg",
   "still_motion": true,
   "next": "c2_2a7"
  },
  {
   "scene_id": "c2_2a7",
   "code": "2A7",
   "scene_type": "choice",
   "text": [
    "b0",
    {
     "key": "b1",
     "kind": "say",
     "from": "enduro"
    }
   ],
   "image_asset": "assets/scenes/c2/2A7.jpg",
   "still_motion": true,
   "choices": [
    {
     "id": "c0",
     "hotspot": {
      "x": 24,
      "y": 54
     },
     "effects": [
      {
       "set": {
        "told_enduro": true
       }
      }
     ],
     "next": "c2_2a8"
    },
    {
     "id": "c1",
     "hotspot": {
      "x": 76,
      "y": 62
     },
     "effects": [],
     "next": "c2_2a8"
    },
    {
     "id": "c2",
     "hotspot": {
      "x": 40,
      "y": 80
     },
     "effects": [],
     "next": "c2_2a8"
    }
   ]
  },
  {
   "scene_id": "c2_2a8",
   "code": "2A8",
   "scene_type": "cinematic",
   "text": [
    "b0",
    "b1",
    {
     "key": "b2",
     "kind": "say",
     "from": "man"
    }
   ],
   "image_asset": "assets/scenes/c2/2A8.jpg",
   "still_motion": true,
   "next": "c2_2a9"
  },
  {
   "scene_id": "c2_2a9",
   "code": "2A9",
   "scene_type": "choice",
   "text": [
    {
     "key": "b0",
     "kind": "say",
     "from": "man"
    },
    {
     "key": "b1",
     "kind": "say",
     "from": "man"
    }
   ],
   "image_asset": "assets/scenes/c2/2A9.jpg",
   "still_motion": true,
   "choices": [
    {
     "id": "c0",
     "hotspot": {
      "x": 22,
      "y": 46
     },
     "effects": [
      {
       "set": {
        "offer": "accept"
       }
      }
     ],
     "next": "c2_2a10"
    },
    {
     "id": "c1",
     "hotspot": {
      "x": 78,
      "y": 54
     },
     "effects": [
      {
       "set": {
        "offer": "refuse"
       }
      }
     ],
     "next": "c2_2a10"
    },
    {
     "id": "c2",
     "hotspot": {
      "x": 24,
      "y": 72
     },
     "effects": [
      {
       "set": {
        "offer": "play"
       }
      }
     ],
     "next": "c2_2a10",
     "conditions": {
      "any": [
       {
        "var": "c1_end",
        "eq": "SA3"
       },
       {
        "var": "c1_end",
        "eq": "SA4"
       }
      ]
     }
    },
    {
     "id": "c3",
     "hotspot": {
      "x": 76,
      "y": 82
     },
     "effects": [
      {
       "set": {
        "offer": "wipe"
       }
      }
     ],
     "next": "c2_2a10",
     "conditions": {
      "var": "c1_end",
      "eq": "SA5"
     }
    },
    {
     "id": "timeout",
     "hidden": true,
     "effects": [
      {
       "set": {
        "offer": "silent",
        "hesitated": true
       }
      }
     ],
     "next": "c2_2a10"
    }
   ],
   "timer": {
    "seconds": 12,
    "on_timeout": "timeout"
   }
  },
  {
   "scene_id": "c2_2a10",
   "code": "2A10",
   "scene_type": "choice",
   "text": [
    "b0",
    {
     "key": "b1",
     "kind": "say",
     "from": "teacher"
    },
    {
     "key": "b2",
     "kind": "say",
     "from": "teacher"
    }
   ],
   "image_asset": "assets/scenes/c2/2A10.jpg",
   "still_motion": true,
   "choices": [
    {
     "id": "c0",
     "hotspot": {
      "x": 24,
      "y": 54
     },
     "effects": [
      {
       "add": {
        "filiz": 2
       }
      }
     ],
     "next": "c2_2a10b"
    },
    {
     "id": "c1",
     "hotspot": {
      "x": 76,
      "y": 62
     },
     "effects": [
      {
       "add": {
        "filiz": 1
       }
      }
     ],
     "next": "c2_2a10b"
    },
    {
     "id": "c2",
     "hotspot": {
      "x": 40,
      "y": 80
     },
     "effects": [],
     "next": "c2_2a10b"
    }
   ]
  },
  {
   "scene_id": "c2_2a10b",
   "code": "2A10b",
   "scene_type": "cinematic",
   "text": [
    "b0",
    {
     "key": "b1",
     "kind": "msg",
     "from": "rota"
    },
    "b2"
   ],
   "image_asset": "assets/scenes/c2/2A13a.jpg",
   "still_motion": true,
   "next": "c2_2a11"
  },
  {
   "scene_id": "c2_2a11",
   "code": "2A11",
   "scene_type": "cinematic",
   "text": [
    "b0",
    "b1",
    "b2",
    {
     "key": "b3",
     "if": {
      "flag": "told_enduro"
     }
    },
    {
     "key": "b4",
     "if": {
      "var": "offer",
      "eq": "accept"
     }
    },
    {
     "key": "b5",
     "if": {
      "var": "offer",
      "eq": "silent"
     }
    }
   ],
   "image_asset": "assets/scenes/c2/2A11.jpg",
   "still_motion": true,
   "next": "c2_2a12"
  },
  {
   "scene_id": "c2_2a12",
   "code": "2A12",
   "scene_type": "interaction",
   "text": [
    "b0",
    "b1"
   ],
   "image_asset": "assets/scenes/c2/2A12.jpg",
   "still_motion": true,
   "game": {
    "type": "gyro",
    "set": "A",
    "seconds": 35
   },
   "choices": [
    {
     "id": "escape",
     "hotspot": {
      "x": 50,
      "y": 76,
      "side": "below"
     },
     "effects": [
      {
       "set": {
        "escaped": true
       }
      }
     ],
     "next": "c2_2a13a"
    },
    {
     "id": "caught",
     "hotspot": {
      "x": 50,
      "y": 76,
      "side": "below"
     },
     "effects": [
      {
       "set": {
        "escaped": false
       }
      }
     ],
     "next": "c2_2a13b"
    }
   ]
  },
  {
   "scene_id": "c2_2a13a",
   "code": "2A13a",
   "scene_type": "cinematic",
   "text": [
    "b0",
    "b1",
    "b2"
   ],
   "image_asset": "assets/scenes/c2/2A13a.jpg",
   "still_motion": true,
   "next": [
    {
     "if": {
      "var": "offer",
      "eq": "refuse"
     },
     "goto": "c2_2sa1"
    },
    {
     "if": {
      "var": "offer",
      "eq": "play"
     },
     "goto": "c2_2sa2"
    },
    {
     "if": {
      "var": "offer",
      "eq": "wipe"
     },
     "goto": "c2_2sa6"
    },
    {
     "if": {
      "var": "offer",
      "eq": "accept"
     },
     "goto": "c2_2sa4"
    },
    {
     "goto": "c2_2sa5"
    }
   ]
  },
  {
   "scene_id": "c2_2a13b",
   "code": "2A13b",
   "scene_type": "cinematic",
   "text": [
    "b0",
    "b1",
    {
     "key": "b2",
     "kind": "say",
     "from": "enduro",
     "if": {
      "var": "offer",
      "eq": "accept"
     }
    },
    {
     "key": "b3",
     "if": {
      "var": "offer",
      "eq": "silent"
     }
    }
   ],
   "image_asset": "assets/scenes/c2/2A13b.jpg",
   "still_motion": true,
   "next": [
    {
     "if": {
      "var": "offer",
      "eq": "accept"
     },
     "goto": "c2_2sa4"
    },
    {
     "if": {
      "var": "offer",
      "eq": "silent"
     },
     "goto": "c2_2sa5"
    },
    {
     "goto": "c2_2sa3"
    }
   ]
  },
  {
   "scene_id": "c2_2sa1",
   "code": "2SA1",
   "scene_type": "ending",
   "text": [
    "b0",
    {
     "key": "b1",
     "kind": "say",
     "from": "teacher"
    },
    {
     "key": "b2",
     "kind": "msg",
     "from": "rota"
    },
    "b3",
    "b4"
   ],
   "image_asset": "assets/scenes/c2/2SA1.jpg"
  },
  {
   "scene_id": "c2_2sa2",
   "code": "2SA2",
   "scene_type": "ending",
   "text": [
    "b0",
    "b1",
    "b2",
    {
     "key": "b3",
     "kind": "msg",
     "from": "man"
    }
   ],
   "image_asset": "assets/scenes/c2/2SA2.jpg"
  },
  {
   "scene_id": "c2_2sa3",
   "code": "2SA3",
   "scene_type": "ending",
   "text": [
    "b0",
    "b1",
    {
     "key": "b2",
     "kind": "msg",
     "from": "teacher"
    }
   ],
   "image_asset": "assets/scenes/c2/2SA3.jpg"
  },
  {
   "scene_id": "c2_2sa4",
   "code": "2SA4",
   "scene_type": "ending",
   "text": [
    "b0",
    "b1",
    "b2",
    "b3",
    {
     "key": "b4",
     "kind": "msg",
     "from": "rota"
    }
   ],
   "image_asset": "assets/scenes/c2/2SA4.jpg"
  },
  {
   "scene_id": "c2_2sa5",
   "code": "2SA5",
   "scene_type": "ending",
   "text": [
    "b0",
    "b1",
    {
     "key": "b2",
     "kind": "msg",
     "from": "rota"
    },
    "b3"
   ],
   "image_asset": "assets/scenes/c2/2SA5.jpg"
  },
  {
   "scene_id": "c2_2sa6",
   "code": "2SA6",
   "scene_type": "ending",
   "text": [
    "b0",
    "b1",
    "b2",
    "b3"
   ],
   "image_asset": "assets/scenes/c2/2SA6.jpg"
  },
  {
   "scene_id": "c2_2b0",
   "code": "2B0",
   "scene_type": "cinematic",
   "text": [
    "b0",
    {
     "key": "b1",
     "if": {
      "var": "c1_end",
      "eq": "SB1"
     }
    },
    {
     "key": "b2",
     "if": {
      "var": "c1_end",
      "eq": "SB2"
     }
    },
    {
     "key": "b3",
     "if": {
      "var": "c1_end",
      "eq": "SB4"
     }
    },
    {
     "key": "b4",
     "kind": "msg",
     "from": "rota"
    }
   ],
   "image_asset": "assets/scenes/c2/2B0.jpg",
   "still_motion": true,
   "next": "c2_2b1"
  },
  {
   "scene_id": "c2_2bk",
   "code": "2BK",
   "scene_type": "cinematic",
   "text": [
    "b0",
    {
     "key": "b1",
     "kind": "msg",
     "from": "unknown"
    },
    {
     "key": "b2",
     "kind": "msg",
     "from": "unknown"
    }
   ],
   "image_asset": "assets/scenes/c2/2BK.jpg",
   "still_motion": true,
   "next": "c2_2b1"
  },
  {
   "scene_id": "c2_2b1",
   "code": "2B1",
   "scene_type": "cinematic",
   "text": [
    "b0",
    {
     "key": "@characters.teacher.line",
     "kind": "intro",
     "who": "teacher"
    },
    {
     "key": "b2",
     "kind": "say",
     "from": "kid"
    },
    "b3",
    {
     "key": "b4",
     "if": {
      "var": "c1_end",
      "eq": "SB2"
     }
    }
   ],
   "image_asset": "assets/scenes/c2/2B1.jpg",
   "still_motion": true,
   "next": "c2_2b2"
  },
  {
   "scene_id": "c2_2b2",
   "code": "2B2",
   "scene_type": "choice",
   "text": [
    "b0",
    {
     "key": "b1",
     "kind": "msg",
     "from": "rota"
    },
    "b2"
   ],
   "image_asset": "assets/scenes/c2/2B2.jpg",
   "still_motion": true,
   "choices": [
    {
     "id": "c0",
     "hotspot": {
      "x": 24,
      "y": 54
     },
     "effects": [
      {
       "set": {
        "locker": "put"
       }
      }
     ],
     "next": "c2_2b2b"
    },
    {
     "id": "c1",
     "hotspot": {
      "x": 76,
      "y": 62
     },
     "effects": [
      {
       "set": {
        "locker": "warn"
       },
       "add": {
        "filiz": 2
       }
      }
     ],
     "next": "c2_2b2b"
    },
    {
     "id": "c2",
     "hotspot": {
      "x": 40,
      "y": 80
     },
     "effects": [
      {
       "set": {
        "locker": "photo",
        "evidence": true
       }
      }
     ],
     "next": "c2_2b2b",
     "conditions": {
      "any": [
       {
        "var": "c1_end",
        "eq": "SB2"
       },
       {
        "var": "c1_end",
        "eq": "SB4"
       }
      ]
     }
    },
    {
     "id": "timeout",
     "hidden": true,
     "effects": [
      {
       "set": {
        "locker": "put",
        "hesitated": true
       }
      }
     ],
     "next": "c2_2b2b"
    }
   ],
   "timer": {
    "seconds": 12,
    "on_timeout": "timeout"
   }
  },
  {
   "scene_id": "c2_2b2b",
   "code": "2B2b",
   "scene_type": "cinematic",
   "text": [
    "b0",
    "b1",
    {
     "key": "b2",
     "kind": "say",
     "from": "courier"
    },
    {
     "key": "b3",
     "kind": "say",
     "from": "courier"
    },
    {
     "key": "b4",
     "kind": "say",
     "from": "courier"
    }
   ],
   "image_asset": "assets/scenes/c2/2B2b.jpg",
   "still_motion": true,
   "next": [
    {
     "if": {
      "var": "c1_chief",
      "eq": "chased"
     },
     "goto": "c2_2b3b"
    },
    {
     "goto": "c2_2b3a"
    }
   ]
  },
  {
   "scene_id": "c2_2b3a",
   "code": "2B3a",
   "scene_type": "cinematic",
   "text": [
    "b0",
    {
     "key": "b1",
     "kind": "say",
     "from": "chief"
    },
    {
     "key": "b2",
     "kind": "say",
     "from": "chief"
    }
   ],
   "image_asset": "assets/scenes/c2/2B3a.jpg",
   "still_motion": true,
   "next": "c2_2b4"
  },
  {
   "scene_id": "c2_2b3b",
   "code": "2B3b",
   "scene_type": "cinematic",
   "text": [
    "b0",
    {
     "key": "b1",
     "kind": "say",
     "from": "chief"
    },
    {
     "key": "b2",
     "kind": "say",
     "from": "chief"
    }
   ],
   "image_asset": "assets/scenes/c2/2B3b.jpg",
   "still_motion": true,
   "next": "c2_2b4"
  },
  {
   "scene_id": "c2_2b4",
   "code": "2B4",
   "scene_type": "cinematic",
   "text": [
    "b0",
    "b1",
    {
     "key": "@characters.enduro.line",
     "kind": "intro",
     "who": "enduro"
    },
    "b3"
   ],
   "image_asset": "assets/scenes/c2/2B4.jpg",
   "still_motion": true,
   "next": "c2_2b5"
  },
  {
   "scene_id": "c2_2b5",
   "code": "2B5",
   "scene_type": "choice",
   "text": [
    {
     "key": "b0",
     "kind": "say",
     "from": "enduro"
    },
    "b1"
   ],
   "image_asset": "assets/scenes/c2/2B5.jpg",
   "still_motion": true,
   "choices": [
    {
     "id": "c0",
     "hotspot": {
      "x": 24,
      "y": 54
     },
     "effects": [
      {
       "set": {
        "fund": "took"
       }
      }
     ],
     "next": "c2_2b6"
    },
    {
     "id": "c1",
     "hotspot": {
      "x": 76,
      "y": 62
     },
     "effects": [
      {
       "set": {
        "fund": "refused"
       }
      }
     ],
     "next": "c2_2b6"
    },
    {
     "id": "c2",
     "hotspot": {
      "x": 40,
      "y": 80
     },
     "effects": [
      {
       "set": {
        "fund": "tested"
       }
      }
     ],
     "next": "c2_2b6"
    }
   ]
  },
  {
   "scene_id": "c2_2b6",
   "code": "2B6",
   "scene_type": "cinematic",
   "text": [
    "b0",
    {
     "key": "b1",
     "kind": "say",
     "from": "teacher"
    },
    {
     "key": "b2",
     "kind": "say",
     "from": "teacher"
    }
   ],
   "image_asset": "assets/scenes/c2/2B6.jpg",
   "still_motion": true,
   "next": "c2_2b7"
  },
  {
   "scene_id": "c2_2b7",
   "code": "2B7",
   "scene_type": "choice",
   "text": [
    "b0",
    {
     "key": "b1",
     "kind": "say",
     "from": "teacher"
    }
   ],
   "image_asset": "assets/scenes/c2/2B7.jpg",
   "still_motion": true,
   "choices": [
    {
     "id": "c0",
     "hotspot": {
      "x": 22,
      "y": 46
     },
     "effects": [
      {
       "add": {
        "filiz": 2
       }
      }
     ],
     "next": "c2_2b7b"
    },
    {
     "id": "c1",
     "hotspot": {
      "x": 78,
      "y": 54
     },
     "effects": [
      {
       "add": {
        "filiz": 1
       }
      }
     ],
     "next": "c2_2b7b"
    },
    {
     "id": "c2",
     "hotspot": {
      "x": 24,
      "y": 72
     },
     "effects": [],
     "next": "c2_2b7b"
    },
    {
     "id": "c3",
     "hotspot": {
      "x": 76,
      "y": 82
     },
     "effects": [
      {
       "add": {
        "filiz": 3
       },
       "set": {
        "confessed_filiz": true
       }
      }
     ],
     "next": "c2_2b7b",
     "conditions": {
      "var": "c1_end",
      "eq": "SB3"
     }
    }
   ]
  },
  {
   "scene_id": "c2_2b7b",
   "code": "2B7b",
   "scene_type": "cinematic",
   "text": [
    "b0",
    "b1",
    {
     "key": "b2",
     "kind": "say",
     "from": "teacher"
    }
   ],
   "image_asset": "assets/scenes/c2/2B7b.jpg",
   "still_motion": true,
   "next": "c2_2b8"
  },
  {
   "scene_id": "c2_2b8",
   "code": "2B8",
   "scene_type": "cinematic",
   "text": [
    "b0",
    "b1"
   ],
   "image_asset": "assets/scenes/c2/2B8.jpg",
   "still_motion": true,
   "next": "c2_2b9"
  },
  {
   "scene_id": "c2_2b9",
   "code": "2B9",
   "scene_type": "choice",
   "text": [
    "b0",
    "b1"
   ],
   "image_asset": "assets/scenes/c2/2B9.jpg",
   "still_motion": true,
   "choices": [
    {
     "id": "c0",
     "hotspot": {
      "x": 22,
      "y": 46
     },
     "effects": [],
     "next": "c2_2b10"
    },
    {
     "id": "c1",
     "hotspot": {
      "x": 78,
      "y": 54
     },
     "effects": [],
     "next": "c2_2b10"
    },
    {
     "id": "c2",
     "hotspot": {
      "x": 24,
      "y": 72
     },
     "effects": [
      {
       "set": {
        "confessed": true
       }
      }
     ],
     "next": "c2_2b10",
     "conditions": {
      "var": "c1_end",
      "eq": "SB3"
     }
    },
    {
     "id": "c3",
     "hotspot": {
      "x": 76,
      "y": 82
     },
     "effects": [
      {
       "set": {
        "wrote_plan": true
       }
      }
     ],
     "next": "c2_2b10",
     "conditions": {
      "var": "c1_end",
      "eq": "SB3"
     }
    },
    {
     "id": "timeout",
     "hidden": true,
     "effects": [
      {
       "set": {
        "hesitated": true
       }
      }
     ],
     "next": "c2_2b10"
    }
   ],
   "timer": {
    "seconds": 10,
    "on_timeout": "timeout"
   }
  },
  {
   "scene_id": "c2_2b10",
   "code": "2B10",
   "scene_type": "interaction",
   "text": [
    "b0",
    {
     "key": "b1",
     "if": {
      "flag": "wrote_plan"
     }
    },
    "b2"
   ],
   "image_asset": "assets/scenes/c2/2B10.jpg",
   "still_motion": true,
   "game": {
    "type": "gyro",
    "set": "B",
    "seconds": 35
   },
   "choices": [
    {
     "id": "escape",
     "hotspot": {
      "x": 50,
      "y": 76,
      "side": "below"
     },
     "effects": [
      {
       "set": {
        "escaped": true
       }
      }
     ],
     "next": [
      {
       "if": {
        "flag": "wrote_plan"
       },
       "goto": "c2_2sb3"
      },
      {
       "goto": "c2_2b11a"
      }
     ]
    },
    {
     "id": "caught",
     "hotspot": {
      "x": 50,
      "y": 76,
      "side": "below"
     },
     "effects": [
      {
       "set": {
        "escaped": false
       }
      }
     ],
     "next": [
      {
       "if": {
        "flag": "wrote_plan"
       },
       "goto": "c2_2sb3"
      },
      {
       "goto": "c2_2b11b"
      }
     ]
    }
   ]
  },
  {
   "scene_id": "c2_2b11a",
   "code": "2B11a",
   "scene_type": "cinematic",
   "text": [
    "b0",
    {
     "key": "b1",
     "kind": "say",
     "from": "cico"
    },
    "b2",
    "b3"
   ],
   "image_asset": "assets/scenes/c2/2B11a.jpg",
   "still_motion": true,
   "next": [
    {
     "if": {
      "flag": "confessed"
     },
     "goto": "c2_2sb6"
    },
    {
     "if": {
      "flag": "evidence"
     },
     "goto": "c2_2sb2"
    },
    {
     "goto": "c2_2sb1"
    }
   ]
  },
  {
   "scene_id": "c2_2b11b",
   "code": "2B11b",
   "scene_type": "cinematic",
   "text": [
    "b0",
    "b1",
    "b2"
   ],
   "image_asset": "assets/scenes/c2/2B11b.jpg",
   "still_motion": true,
   "next": [
    {
     "if": {
      "var": "locker",
      "eq": "put"
     },
     "goto": "c2_2sb5"
    },
    {
     "goto": "c2_2sb4"
    }
   ]
  },
  {
   "scene_id": "c2_2sb1",
   "code": "2SB1",
   "scene_type": "ending",
   "text": [
    "b0",
    "b1",
    "b2",
    "b3"
   ],
   "image_asset": "assets/scenes/c2/2SB1.jpg"
  },
  {
   "scene_id": "c2_2sb2",
   "code": "2SB2",
   "scene_type": "ending",
   "text": [
    "b0",
    "b1",
    "b2",
    "b3"
   ],
   "image_asset": "assets/scenes/c2/2SB2.jpg"
  },
  {
   "scene_id": "c2_2sb3",
   "code": "2SB3",
   "scene_type": "ending",
   "text": [
    "b0",
    "b1",
    {
     "key": "b2",
     "kind": "msg",
     "from": "rota"
    },
    "b3"
   ],
   "image_asset": "assets/scenes/c2/2SB3.jpg"
  },
  {
   "scene_id": "c2_2sb4",
   "code": "2SB4",
   "scene_type": "ending",
   "text": [
    "b0",
    "b1",
    {
     "key": "b2",
     "kind": "msg",
     "from": "teacher"
    }
   ],
   "image_asset": "assets/scenes/c2/2SB4.jpg"
  },
  {
   "scene_id": "c2_2sb5",
   "code": "2SB5",
   "scene_type": "ending",
   "text": [
    "b0",
    "b1",
    "b2",
    {
     "key": "b3",
     "kind": "say",
     "from": "kid"
    }
   ],
   "image_asset": "assets/scenes/c2/2SB5.jpg"
  },
  {
   "scene_id": "c2_2sb6",
   "code": "2SB6",
   "scene_type": "ending",
   "text": [
    "b0",
    {
     "key": "b1",
     "kind": "say",
     "from": "cico"
    },
    {
     "key": "b2",
     "if": {
      "var": "c1_chief",
      "eq": "stayed"
     }
    },
    {
     "key": "b3",
     "if": {
      "var": "c1_chief",
      "eq": "chased"
     }
    },
    {
     "key": "b4",
     "kind": "msg",
     "from": "man"
    }
   ],
   "image_asset": "assets/scenes/c2/2SB6.jpg"
  }
 ],
 "epilogue": []
};
  if (typeof module === 'object' && module.exports) module.exports = story;
  else (root.CICO = root.CICO || {}).story2 = story;
})(typeof self !== 'undefined' ? self : this);
