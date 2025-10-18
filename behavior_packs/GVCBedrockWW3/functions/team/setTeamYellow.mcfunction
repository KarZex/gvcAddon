execute if entity @s[family=red] run scriptevent zex:transferTeam red yellow
execute if entity @s[family=blue] run scriptevent zex:transferTeam blue yellow
execute if entity @s[family=green] run scriptevent zex:transferTeam green yellow
execute if entity @s[family=yellow] run scriptevent zex:transferTeam yellow yellow
event entity @s gvcv5:become_yellowteam
tag @s remove wantToBeyellow
tellraw @a { "rawtext": [{"selector": "@s"},{ "translate": "script.gvcv5.youAreInyellowteam.name"}] }