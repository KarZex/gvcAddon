event entity @s gvcv5:become_redteam
tag @s remove wantToBered
tellraw @a { "rawtext": [{"selector": "@s"},{ "translate": "script.gvcv5.youAreInredteam.name"}] }