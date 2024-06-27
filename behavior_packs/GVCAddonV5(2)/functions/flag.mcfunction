execute as @s[scores={flag=0}] run event entity @e[family=PMC,r=15] flag
execute as @s[scores={flag=1}] run event entity @e[family=PMC,r=15] wait
execute as @s[scores={flag=2}] run event entity @e[family=PMC,r=15] follow
execute as @s[scores={flag=3}] run event entity @e[family=PMC,r=15] attack
execute as @s[scores={flag=3}] run ride @e[family=player,type=!player,r=15] stop_riding
scoreboard players add @s flag 1
scoreboard players set @s[scores={flag=4}] flag 0