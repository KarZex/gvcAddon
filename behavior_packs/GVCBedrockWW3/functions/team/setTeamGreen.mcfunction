execute if entity @s[family=red] run scriptevent zex:transferTeam red green
execute if entity @s[family=blue] run scriptevent zex:transferTeam blue green
execute if entity @s[family=green] run scriptevent zex:transferTeam green green
execute if entity @s[family=yellow] run scriptevent zex:transferTeam yellow green
event entity @s gvcv5:become_greenteam
tag @s remove wantToBegreen
tellraw @a { "rawtext": [{"selector": "@s"},{ "translate": "script.gvcv5.youAreIngreenteam.name"}] }