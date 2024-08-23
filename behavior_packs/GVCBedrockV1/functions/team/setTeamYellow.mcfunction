event entity @s gvcv5:become_yellowteam
tag @s remove wantToBeyellow
tellraw @a { "rawtext": [{"selector": "@s"},{ "translate": "script.gvcv5.youAreInyellowteam.name"}] }