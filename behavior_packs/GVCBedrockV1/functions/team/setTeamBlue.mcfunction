event entity @s gvcv5:become_blueteam
tag @s remove wantToBeblue
tellraw @a { "rawtext": [{"selector": "@s"},{ "translate": "script.gvcv5.youAreInblueteam.name"}] }