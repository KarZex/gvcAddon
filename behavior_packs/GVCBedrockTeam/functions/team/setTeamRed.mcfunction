execute if entity @s[family=red] run scriptevent zex:transferTeam red red
execute if entity @s[family=blue] run scriptevent zex:transferTeam blue red
execute if entity @s[family=green] run scriptevent zex:transferTeam green red
execute if entity @s[family=yellow] run scriptevent zex:transferTeam yellow red
event entity @s gvcv5:become_redteam
tag @s remove wantToBered
tellraw @a { "rawtext": [{"selector": "@s"},{ "translate": "script.gvcv5.youAreInredteam.name"}] }