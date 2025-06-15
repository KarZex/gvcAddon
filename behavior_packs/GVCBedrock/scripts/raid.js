import { EntityDamageCause } from "@minecraft/server";
export const raidData = {
  "infantry_i": {
    "wave1": [
      { "counts": 4,"type": "gvcv5:ga","gun": "m1911" },
      { "counts": 8,"type": "gvcv5:ga","gun": "mp40" }
    ],
    "wave2": [
      { "counts": 4,"type": "gvcv5:ga","gun": "ak47" },
      { "counts": 6,"type": "gvcv5:ga","gun": "uzi" },
      { "counts": 1,"type": "gvcv5:ga","gun": "p90" },
      { "counts": 1,"type": "gvcv5:gb1"}
    ],
    "wave3": [
      { "counts": 8,"type": "gvcv5:ga","gun": "ak47" },
      { "counts": 6,"type": "gvcv5:ga","gun": "mp40" },
      { "counts": 2,"type": "gvcv5:ga","gun": "p90" },
      { "counts": 2,"type": "gvcv5:gb1" },
      { "counts": 1,"type": "gvcv5:gb3" }
    ],
    "wave4": [
      {
        "counts": 1,
        "type": "gvcv5:ga",
        "gun": "an94",
        "armor": "plastic",
        "isBoss":true,
        "Ench":[
          {
            "id":"power",
            "lv":3
          },
          {
            "id":"flame",
            "lv":1
          },
          {
            "id":"unbreaking",
            "lv":3
          }

        ]
      },
      { "counts": 8,"type": "gvcv5:ga","gun": "ak47" },
      { "counts": 8,"type": "gvcv5:ga","gun": "mp40" },
      { "counts": 8,"type": "gvcv5:ga","gun": "uzi" },
      { "counts": 2,"type": "gvcv5:ga","gun": "p90" },
      { "counts": 2,"type": "gvcv5:gb1" },
      { "counts": 2,"type": "gvcv5:gb3" },
      { "counts": 2,"type": "gvcv5:gb2" }
    ],
    "wave5": [
      {
        "counts": 2,
        "type": "gvcv5:ga",
        "gun": "rpk",
        "armor": "plastic",
        "isBoss":true,
        "Ench":[
          {
            "id":"power",
            "lv":3
          },
          {
            "id":"flame",
            "lv":1
          },
          {
            "id":"unbreaking",
            "lv":3
          }

        ]
      },
      {
        "counts": 1,
        "type": "gvcv5:ga",
        "gun": "rpg",
        "armor": "plastic",
        "isBoss":true,
        "Ench":[
          {
            "id":"power",
            "lv":3
          },
          {
            "id":"unbreaking",
            "lv":3
          }

        ]
      },
      { "counts": 12,"type": "gvcv5:ga","gun": "ak47" },
      { "counts": 6,"type": "gvcv5:ga","gun": "svd" },
      { "counts": 6,"type": "gvcv5:ga","gun": "uzi" },
      { "counts": 4,"type": "gvcv5:ga","gun": "p90" },
      { "counts": 2,"type": "gvcv5:gb1" },
      { "counts": 2,"type": "gvcv5:gb3" },
      { "counts": 3,"type": "gvcv5:gb2" },
      { "counts": 1,"type": "gvcv5:gb4" },
      { "counts": 1,"type": "gvcv5:gb5" }
    ]
  },
  "infantry_i_sub": {
    "wave1": [
      { "counts": 3,"type": "gvcv5:ga","gun": "m1911" },
      { "counts": 1,"type": "gvcv5:ga","gun": "mp40" }
    ],
    "wave2": [
      { "counts": 1,"type": "gvcv5:ga","gun": "ak47" },
      { "counts": 3,"type": "gvcv5:ga","gun": "uzi" }
    ],
    "wave3": [
      { "counts": 2,"type": "gvcv5:ga","gun": "ak47" },
      { "counts": 4,"type": "gvcv5:ga","gun": "mp40" }
    ],
    "wave4": [
      { "counts": 3,"type": "gvcv5:ga","gun": "ak47" },
      { "counts": 2,"type": "gvcv5:ga","gun": "mp40" },
      { "counts": 2,"type": "gvcv5:ga","gun": "uzi" }
    ],
    "wave5": [
      { "counts": 3,"type": "gvcv5:ga","gun": "ak47" },
      { "counts": 1,"type": "gvcv5:ga","gun": "svd" },
      { "counts": 2,"type": "gvcv5:ga","gun": "uzi" },
      { "counts": 1,"type": "gvcv5:gb2" }
    ]
  },
  "infantry_ii": {
    "wave1": [
      { "counts": 8,"type": "gvcv5:ga","gun": "an94" },
      { "counts": 2,"type": "gvcv5:gb1" },
      { "counts": 2,"type": "gvcv5:gb3" },
      { "counts": 3,"type": "gvcv5:ga","gun": "mp5" }
    ],
    "wave2": [
      { "counts": 12,"type": "gvcv5:ga","gun": "an94" },
      { "counts": 6,"type": "gvcv5:ga","gun": "mp5" },
      { "counts": 4,"type": "gvcv5:ga","gun": "p90" },
      { "counts": 2,"type": "gvcv5:gb1" },
      { "counts": 1,"type": "gvcv5:gb4" },
      { "counts": 1,"type": "gvcv5:gb2" },
      { "counts": 2,"type": "gvcv5:gb3" }
    ],
    "wave3": [
      { "counts": 12,"type": "gvcv5:ga","gun": "an94" },
      { "counts": 6,"type": "gvcv5:ga","gun": "mp5","armor": "iron" },
      { "counts": 6,"type": "gvcv5:ga","gun": "dp28" },
      { "counts": 4,"type": "gvcv5:ga","gun": "rpg" },
      { "counts": 2,"type": "gvcv5:ga","gun": "rpg","armor": "plastic" },
      { "counts": 6,"type": "gvcv5:gb1" },
      { "counts": 2,"type": "gvcv5:gb4" },
      { "counts": 3,"type": "gvcv5:gb2" },
      { "counts": 4,"type": "gvcv5:gb3" }
    ],
    "wave4": [
      {
        "counts": 2,
        "type": "gvcv5:ga",
        "gun": "ak12",
        "armor": "diamond",
        "isBoss":true,
        "Ench":[
          {
            "id":"power",
            "lv":4
          },
          {
            "id":"flame",
            "lv":1
          },
          {
            "id":"unbreaking",
            "lv":3
          }

        ]
      },
      { "counts": 4,"type": "gvcv5:ga","gun": "rpg","armor": "plastic" },
      { "counts": 4,"type": "gvcv5:ga","gun": "an94","armor": "iron" },
      { "counts": 4,"type": "gvcv5:ga","gun": "mp5","armor": "iron" },
      { "counts": 3,"type": "gvcv5:ga","gun": "dp28" },
      { "counts": 4,"type": "gvcv5:gb1" },
      { "counts": 4,"type": "gvcv5:gb2" },
      { "counts": 3,"type": "gvcv5:gb3" },
      { "counts": 3,"type": "gvcv5:gb4" },
      { "counts": 2,"type": "gvcv5:gb5" }
    ],
    "wave5": [
      {
        "counts": 2,
        "type": "gvcv5:ga",
        "gun": "pkm",
        "armor": "diamond",
        "isBoss":true,
        "Ench":[
          {
            "id":"power",
            "lv":5
          },
          {
            "id":"flame",
            "lv":1
          },
          {
            "id":"unbreaking",
            "lv":3
          }

        ]
      },
      {
        "counts": 1,
        "type": "gvcv5:ga",
        "gun": "m202",
        "armor": "netherite",
        "isBoss":true,
        "Ench":[
          {
            "id":"power",
            "lv":5
          },
          {
            "id":"unbreaking",
            "lv":3
          }

        ]
      },
      { "counts": 6,"type": "gvcv5:ga","gun": "an94","armor": "plastic"  },
      { "counts": 4,"type": "gvcv5:ga","gun": "dp28","armor": "iron" },
      { "counts": 4,"type": "gvcv5:ga","gun": "mp5","armor": "iron" },
      { "counts": 4,"type": "gvcv5:ga","gun": "svd" },
      { "counts": 4,"type": "gvcv5:ga","gun": "p90" },
      { "counts": 4,"type": "gvcv5:ga","gun": "rpg","armor": "plastic" },
      { "counts": 6,"type": "gvcv5:unks" },
      { "counts": 2,"type": "gvcv5:gb1" },
      { "counts": 2,"type": "gvcv5:gb3" },
      { "counts": 3,"type": "gvcv5:gb2" },
      { "counts": 1,"type": "gvcv5:gb4" },
      { "counts": 1,"type": "gvcv5:gb5" }
    ]
  },
  "infantry_ii_sub": {
    "wave1": [
      { "counts": 3,"type": "gvcv5:ga","gun": "an94" },
      { "counts": 1,"type": "gvcv5:ga","gun": "mp5" },
      { "counts": 1,"type": "gvcv5:gb1" },
      { "counts": 1,"type": "gvcv5:gb3" },
      { "counts": 1,"type": "gvcv5:gb2" }
    ],
    "wave2": [
      { "counts": 1,"type": "gvcv5:ga","gun": "an94" },
      { "counts": 3,"type": "gvcv5:ga","gun": "mp5" },
      { "counts": 1,"type": "gvcv5:gb1" },
      { "counts": 1,"type": "gvcv5:gb3" },
      { "counts": 1,"type": "gvcv5:gb2" }
    ],
    "wave3": [
      { "counts": 3,"type": "gvcv5:ga","gun": "an94" },
      { "counts": 4,"type": "gvcv5:ga","gun": "mp5" },
      { "counts": 2,"type": "gvcv5:gb1" },
      { "counts": 2,"type": "gvcv5:gb3" },
      { "counts": 2,"type": "gvcv5:gb2" }
    ],
    "wave4": [
      { "counts": 3,"type": "gvcv5:ga","gun": "an94" },
      { "counts": 4,"type": "gvcv5:ga","gun": "mp5" },
      { "counts": 2,"type": "gvcv5:ga","gun": "rpg","armor": "iron" },
      { "counts": 2,"type": "gvcv5:gb1" },
      { "counts": 2,"type": "gvcv5:gb3" },
      { "counts": 2,"type": "gvcv5:gb2" }
    ],
    "wave5": [
      { "counts": 3,"type": "gvcv5:ga","gun": "ak47" },
      { "counts": 4,"type": "gvcv5:ga","gun": "svd" },
      { "counts": 4,"type": "gvcv5:ga","gun": "rpg","armor": "iron" },
      { "counts": 2,"type": "gvcv5:gb1" },
      { "counts": 2,"type": "gvcv5:gb3" },
      { "counts": 2,"type": "gvcv5:gb2" }
    ]
  },
  "infantry_iii": {
    "wave1": [
      { "counts": 2,"type": "gvcv5:ga","gun": "ak12" },
      { "counts": 5,"type": "gvcv5:unks","armor": "plastic" },
      { "counts": 2,"type": "gvcv5:gb1","armor": "diamond" },
      { "counts": 2,"type": "gvcv5:gb3" },
      { "counts": 3,"type": "gvcv5:ga","gun": "mp7","armor": "plastic" }
    ],
    "wave2": [
      { "counts": 3,"type": "gvcv5:ga","gun": "ak12" },
      { "counts": 4,"type": "gvcv5:ga","gun": "mp7","armor": "plastic" },
      { "counts": 4,"type": "gvcv5:ga","gun": "rpg","armor": "plastic" },
      { "counts": 4,"type": "gvcv5:ga","gun": "xm8","armor": "plastic" },
      { "counts": 5,"type": "gvcv5:unks","armor": "plastic" },
      { "counts": 2,"type": "gvcv5:gb1","armor": "diamond" },
      { "counts": 1,"type": "gvcv5:gb4","armor": "diamond" },
      { "counts": 1,"type": "gvcv5:gb2","armor": "diamond" },
      { "counts": 2,"type": "gvcv5:gc1" }
    ],
    "wave3": [
      {
        "counts": 1,
        "type": "gvcv5:ga",
        "gun": "m202",
        "armor": "netherite",
        "isBoss":true,
        "Ench":[
          {
            "id":"power",
            "lv":5
          },
          {
            "id":"flame",
            "lv":1
          },
          {
            "id":"unbreaking",
            "lv":3
          }

        ]
      },
      { "counts": 4,"type": "gvcv5:ga","gun": "ak12" },
      { "counts": 3,"type": "gvcv5:ga","gun": "mp7","armor": "plastic" },
      { "counts": 2,"type": "gvcv5:ga","gun": "rpg","armor": "plastic" },
      { "counts": 2,"type": "gvcv5:ga","gun": "xm8","armor": "plastic" },
      { "counts": 4,"type": "gvcv5:unks","armor": "diamond" },
      { "counts": 6,"type": "gvcv5:gb1","armor": "diamond" },
      { "counts": 2,"type": "gvcv5:gb4","armor": "diamond" },
      { "counts": 4,"type": "gvcv5:gb2","armor": "diamond" },
      { "counts": 4,"type": "gvcv5:gc1" },
      { "counts": 4,"type": "gvcv5:gc2" }
    ],
    "wave4": [
      {
        "counts": 2,
        "type": "gvcv5:ga",
        "gun": "xm8",
        "armor": "netherite",
        "isBoss":true,
        "Ench":[
          {
            "id":"power",
            "lv":5
          },
          {
            "id":"flame",
            "lv":1
          },
          {
            "id":"unbreaking",
            "lv":3
          }

        ]
      },
      {
        "counts": 2,
        "type": "gvcv5:ga",
        "gun": "m249",
        "armor": "netherite",
        "isBoss":true,
        "Ench":[
          {
            "id":"power",
            "lv":5
          },
          {
            "id":"flame",
            "lv":1
          },
          {
            "id":"unbreaking",
            "lv":3
          }

        ]
      },
      { "counts": 4,"type": "gvcv5:ga","gun": "ak12" },
      { "counts": 4,"type": "gvcv5:ga","gun": "mp7","armor": "plastic" },
      { "counts": 4,"type": "gvcv5:ga","gun": "rpg","armor": "plastic" },
      { "counts": 4,"type": "gvcv5:ga","gun": "xm8","armor": "plastic" },
      { "counts": 10,"type": "gvcv5:unks","armor": "diamond" },
      { "counts": 6,"type": "gvcv5:gb1","armor": "diamond" },
      { "counts": 2,"type": "gvcv5:gb4","armor": "diamond" },
      { "counts": 4,"type": "gvcv5:gb2","armor": "diamond" },
      { "counts": 3,"type": "gvcv5:gc1","armor": "diamond" },
      { "counts": 1,"type": "gvcv5:gc1","armor": "netherite" },
      { "counts": 4,"type": "gvcv5:gc2" }
    ],
    "wave5": [
      {
        "counts": 4,
        "type": "gvcv5:ga",
        "gun": "mg42",
        "armor": "netherite",
        "isBoss":true,
        "Ench":[
          {
            "id":"power",
            "lv":5
          },
          {
            "id":"flame",
            "lv":1
          },
          {
            "id":"unbreaking",
            "lv":3
          }

        ]
      },
      {
        "counts": 4,
        "type": "gvcv5:ga",
        "gun": "m202",
        "armor": "netherite",
        "isBoss":true,
        "Ench":[
          {
            "id":"power",
            "lv":5
          },
          {
            "id":"unbreaking",
            "lv":3
          }

        ]
      },
      { "counts": 5,"type": "gvcv5:ga","gun": "ak12" },
      { "counts": 4,"type": "gvcv5:ga","gun": "mp7","armor": "netherite" },
      { "counts": 4,"type": "gvcv5:ga","gun": "rpg","armor": "plastic" },
      { "counts": 4,"type": "gvcv5:ga","gun": "xm8","armor": "plastic" },
      { "counts": 10,"type": "gvcv5:unks","armor": "diamond" },
      { "counts": 2,"type": "gvcv5:unks","armor": "netherite" },
      { "counts": 2,"type": "gvcv5:gb4","armor": "diamond" },
      { "counts": 4,"type": "gvcv5:gb2","armor": "netherite" },
      { "counts": 4,"type": "gvcv5:gc1","armor": "diamond" },
      { "counts": 2,"type": "gvcv5:gc1","armor": "netherite" },
      { "counts": 4,"type": "gvcv5:gc2" }
    ]
  },
  "infantry_iii_sub": {
    "wave1": [
      { "counts": 3,"type": "gvcv5:ga","gun": "ak12" },
      { "counts": 1,"type": "gvcv5:ga","gun": "mp7","armor": "plastic" },
      { "counts": 1,"type": "gvcv5:gb1","armor": "plastic" },
      { "counts": 2,"type": "gvcv5:gb2","armor": "plastic" }
    ],
    "wave2": [
      { "counts": 1,"type": "gvcv5:ga","gun": "ak12" },
      { "counts": 1,"type": "gvcv5:ga","gun": "mp7","armor": "plastic" },
      { "counts": 2,"type": "gvcv5:unks","armor": "diamond" },
      { "counts": 1,"type": "gvcv5:gb1","armor": "plastic" },
      { "counts": 2,"type": "gvcv5:gb2","armor": "plastic" },
      { "counts": 1,"type": "gvcv5:gc1" }
    ],
    "wave3": [
      { "counts": 1,"type": "gvcv5:ga","gun": "ak12" },
      { "counts": 1,"type": "gvcv5:ga","gun": "mp7","armor": "plastic" },
      { "counts": 2,"type": "gvcv5:unks","armor": "diamond" },
      { "counts": 1,"type": "gvcv5:gb1","armor": "plastic" },
      { "counts": 2,"type": "gvcv5:gb2","armor": "diamond" },
      { "counts": 1,"type": "gvcv5:gc1","armor": "diamond" }
    ],
    "wave4": [
      { "counts": 1,"type": "gvcv5:ga","gun": "ak12" },
      { "counts": 1,"type": "gvcv5:ga","gun": "mp7","armor": "plastic" },
      { "counts": 2,"type": "gvcv5:unks","armor": "diamond" },
      { "counts": 1,"type": "gvcv5:gb1","armor": "plastic" },
      { "counts": 2,"type": "gvcv5:gb2","armor": "diamond" },
      { "counts": 1,"type": "gvcv5:gc1","armor": "diamond" }
    ],
    "wave5": [
      { "counts": 2,"type": "gvcv5:ga","gun": "ak12" },
      { "counts": 3,"type": "gvcv5:ga","gun": "mp7","armor": "plastic" },
      { "counts": 4,"type": "gvcv5:unks","armor": "diamond" },
      { "counts": 4,"type": "gvcv5:gb1","armor": "plastic" },
      { "counts": 2,"type": "gvcv5:gb2","armor": "diamond" },
      { "counts": 2,"type": "gvcv5:gc1","armor": "netherite" }
    ]
  }
};