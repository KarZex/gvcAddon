import { EntityDamageCause } from "@minecraft/server";
export const vehicleData = {
  "aifv": {
    "type": "apc",
    "speed": 0.3,
    "Weapon1": "25mmmc",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 7
  },
  "lav25": {
    "type": "apc",
    "speed": 0.3,
    "Weapon1": "25mmmc",
    "Weapon2": "76mmrocket",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 7
  },
  "lav25aa": {
    "type": "apc",
    "speed": 0.3,
    "Weapon1": "20mmmcair",
    "Weapon2": "aamissile",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 7
  },
  "m113": {
    "type": "apc",
    "speed": 0.3,
    "Weapon1": "hmg",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 7
  },
  "m113aa": {
    "type": "apc",
    "speed": 0.3,
    "Weapon1": "20mmmcair",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 7
  },
  "m1126": {
    "type": "apc",
    "speed": 0.2,
    "Weapon1": "hmg",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 7
  },
  "m1128": {
    "type": "apc",
    "speed": 0.2,
    "Weapon1": "105mm",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 7
  },
  "btr60": {
    "type": "apc",
    "speed": 0.3,
    "Weapon1": "14.5mmhmg",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 7
  },
  "panzer": {
    "type": "tank",
    "speed": 0.25,
    "Weapon1": "76mm",
    "Weapon2": "vmg",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 1,
    "gattack": 0
  },
  "kv2": {
    "type": "tank",
    "speed": 0.1,
    "Weapon1": "152mm",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 20
  },
  "m1_abrams": {
    "type": "tank",
    "speed": 0.2,
    "Weapon1": "120mm",
    "Weapon2": "vmg",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 20
  },
  "m1a2": {
    "type": "tank",
    "speed": 0.2,
    "Weapon1": "120mm",
    "Weapon2": "vmg",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 20
  },
  "m41": {
    "type": "stank",
    "speed": 0.4,
    "Weapon1": "85mm",
    "Weapon2": "vmg",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 7
  },
  "fv101": {
    "type": "stank",
    "speed": 0.3,
    "Weapon1": "76mm",
    "Weapon2": "vmg",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 7
  },
  "m60a1": {
    "type": "tank",
    "speed": 0.2,
    "Weapon1": "105mm",
    "Weapon2": "vmg",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 14
  },
  "pt76": {
    "type": "stank",
    "speed": 0.3,
    "Weapon1": "76mm",
    "Weapon2": "vmg",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 7
  },
  "t34": {
    "type": "tank",
    "speed": 0.2,
    "Weapon1": "85mm",
    "Weapon2": "vmg",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 7
  },
  "t55": {
    "type": "tank",
    "speed": 0.2,
    "Weapon1": "100mm",
    "Weapon2": "vmg",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 14
  },
  "t72": {
    "type": "tank",
    "speed": 0.2,
    "Weapon1": "125mm",
    "Weapon2": "vmg",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 18
  },
  "r22": {
    "type": "heri",
    "speed": 0.4,
    "Weapon1": "7.62mmmgs",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 0
  },
  "ah1s": {
    "type": "heri",
    "speed": 0.4,
    "Weapon1": "20mmmcheri",
    "Weapon2": "76mmrocket",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 0
  },
  "ah6": {
    "type": "heri",
    "speed": 0.4,
    "Weapon1": "7.62mmmg",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 0
  },
  "g_heri": {
    "type": "heri",
    "speed": 0.4,
    "Weapon1": "vmg",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 0
  },
  "ka50": {
    "type": "heri",
    "speed": 0.4,
    "Weapon1": "30mmmc",
    "Weapon2": "76mmrocket",
    "Weapon3": "aamissile",
    "Weapon4": "bomb",
    "turn": 0,
    "gattack": 0
  },
  "ka60": {
    "type": "heri",
    "speed": 0.4,
    "Weapon1": "vmg",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 0
  },
  "mi24d": {
    "type": "heri",
    "speed": 0.4,
    "Weapon1": "12.7mmmg",
    "Weapon2": "agmissile",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 0
  },
  "20mmaa": {
    "type": "set",
    "speed": 0.0,
    "Weapon1": "20mmmc",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 0
  },
  "flak18": {
    "type": "set",
    "speed": 0.0,
    "Weapon1": "125mm",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 0
  },
  "pak40": {
    "type": "set",
    "speed": 0.0,
    "Weapon1": "105mm",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 0
  },
  "zu23": {
    "type": "set",
    "speed": 0.0,
    "Weapon1": "23mmmc",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 0
  },
  "vads": {
    "type": "set",
    "speed": 0.0,
    "Weapon1": "20mmmcair",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 0
  },
  "dp28set": {
    "type": "set",
    "speed": 0.0,
    "Weapon1": "7.62mmmg",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 0
  },
  "m60set": {
    "type": "set",
    "speed": 0.0,
    "Weapon1": "7.62mmmg",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 0
  },
  "pkmset": {
    "type": "set",
    "speed": 0.0,
    "Weapon1": "7.62mmmg",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 0,
    "gattack": 0
  },
  "mig17": {
    "type": "air",
    "speed": 1.5,
    "Weapon1": "23mmmcair",
    "Weapon2": "76mmrocket",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 15,
    "gattack": 0
  },
  "su27": {
    "type": "air",
    "speed": 2.0,
    "Weapon1": "20mmmcaird",
    "Weapon2": "aamissile",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 15,
    "gattack": 0
  },
  "f16": {
    "type": "air",
    "speed": 2.0,
    "Weapon1": "20mmmcair",
    "Weapon2": "aamissile",
    "Weapon3": "bomb",
    "Weapon4": "",
    "turn": 15,
    "gattack": 0
  },
  "su25": {
    "type": "air",
    "speed": 1.5,
    "Weapon1": "30mmmcair",
    "Weapon2": "bomb",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 15,
    "gattack": 0
  },
  "f117": {
    "type": "air",
    "speed": 1.5,
    "Weapon1": "bombii",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 15,
    "gattack": 0
  },
  "yak9": {
    "type": "air",
    "speed": 1.0,
    "Weapon1": "20mmmcaird",
    "Weapon2": "",
    "Weapon3": "",
    "Weapon4": "",
    "turn": 15,
    "gattack": 0
  },
  "il2": {
    "type": "air",
    "speed": 0.6,
    "Weapon1": "20mmmcaird",
    "Weapon2": "bomb",
    "Weapon3": "37mmrocket",
    "Weapon4": "",
    "turn": 6,
    "gattack": 0
  }
};