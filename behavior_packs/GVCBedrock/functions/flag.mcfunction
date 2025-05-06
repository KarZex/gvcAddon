execute at @s[scores={flag=0}] run event entity @e[type=gvcv5:pmc,family=noteam,r=15] wait
tellraw @s[scores={flag=0}] {"rawtext":[{"translate":"gvcv5.order.wait.name"}]}
execute at @s[scores={flag=1}] run event entity @e[type=gvcv5:pmc,family=noteam,r=15] follow
tellraw @s[scores={flag=1}] {"rawtext":[{"translate":"gvcv5.order.follow.name"}]}
execute at @s[scores={flag=2}] run event entity @e[type=gvcv5:pmc,family=noteam,r=15] attack
tellraw @s[scores={flag=2}] {"rawtext":[{"translate":"gvcv5.order.attack.name"}]}
execute at @s[scores={flag=0}] run ride @e[family=noteam,type=!player,r=15] stop_riding
scoreboard players add @s flag 1
scoreboard players set @s[scores={flag=3..}] flag 0