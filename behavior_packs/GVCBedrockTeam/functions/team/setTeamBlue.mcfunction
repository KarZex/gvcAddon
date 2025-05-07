execute if entity @s[family=red] run scriptevent zex:transferTeam red blue
execute if entity @s[family=blue] run scriptevent zex:transferTeam blue blue
execute if entity @s[family=green] run scriptevent zex:transferTeam green blue
execute if entity @s[family=yellow] run scriptevent zex:transferTeam yellow blue 
event entity @s gvcv5:become_blueteam
tag @s remove wantToBeblue
tellraw @a { "rawtext": [{"selector": "@s"},{ "translate": "script.gvcv5.youAreInblueteam.name"}] }