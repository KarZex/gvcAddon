event entity @s gvcv5:become_greenteam
tag @s remove wantToBegreen
tellraw @a { "rawtext": [{"selector": "@s"},{ "translate": "script.gvcv5.youAreIngreenteam.name"}] }