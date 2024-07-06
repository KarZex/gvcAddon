execute at @s[scores={flag=0}] run event entity @e[type=gvcv5:pmc,r=15] wait
execute at @s[scores={flag=1}] run event entity @e[type=gvcv5:pmc,r=15] follow
execute at @s[scores={flag=2}] run event entity @e[type=gvcv5:pmc,r=15] attack
execute at @s[scores={flag=2}] run ride @e[family=playerp,type=!player,r=15] stop_riding
scoreboard players add @s flag 1
scoreboard players set @s[scores={flag=3..}] flag 0