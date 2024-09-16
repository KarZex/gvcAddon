execute at @s[scores={flag=0},family=redteam] run event entity @e[type=gvcv5:pmc_red,family=redteam,r=15] wait
execute at @s[scores={flag=1},family=redteam] run event entity @e[type=gvcv5:pmc_red,family=redteam,r=15] follow
execute at @s[scores={flag=2},family=redteam] run event entity @e[type=gvcv5:pmc_red,family=redteam,r=15] attack
execute at @s[scores={flag=2},family=redteam] run ride @e[family=redteam,type=!player,r=15] stop_riding

execute at @s[scores={flag=0},family=blueteam] run event entity @e[type=gvcv5:pmc_blue,family=blueteam,r=15] wait
execute at @s[scores={flag=1},family=blueteam] run event entity @e[type=gvcv5:pmc_blue,family=blueteam,r=15] follow
execute at @s[scores={flag=2},family=blueteam] run event entity @e[type=gvcv5:pmc_blue,family=blueteam,r=15] attack
execute at @s[scores={flag=2},family=blueteam] run ride @e[family=blueteam,type=!player,r=15] stop_riding

execute at @s[scores={flag=0},family=greenteam] run event entity @e[type=gvcv5:pmc_green,family=greenteam,r=15] wait
execute at @s[scores={flag=1},family=greenteam] run event entity @e[type=gvcv5:pmc_green,family=greenteam,r=15] follow
execute at @s[scores={flag=2},family=greenteam] run event entity @e[type=gvcv5:pmc_green,family=greenteam,r=15] attack
execute at @s[scores={flag=2},family=greenteam] run ride @e[family=greenteam,type=!player,r=15] stop_riding

execute at @s[scores={flag=0},family=yellowteam] run event entity @e[type=gvcv5:pmc_yellow,family=yellowteam,r=15] wait
execute at @s[scores={flag=1},family=yellowteam] run event entity @e[type=gvcv5:pmc_yellow,family=yellowteam,r=15] follow
execute at @s[scores={flag=2},family=yellowteam] run event entity @e[type=gvcv5:pmc_yellow,family=yellowteam,r=15] attack
execute at @s[scores={flag=2},family=yellowteam] run ride @e[family=yellowteam,type=!player,r=15] stop_riding

execute at @s[scores={flag=0}] run event entity @e[type=gvcv5:pmc,family=noteam,r=15] wait
tellraw @s[scores={flag=0}] {"rawtext":[{"translate":"gvcv5.order.wait.name"}]}
execute at @s[scores={flag=1}] run event entity @e[type=gvcv5:pmc,family=noteam,r=15] follow
tellraw @s[scores={flag=1}] {"rawtext":[{"translate":"gvcv5.order.follow.name"}]}
execute at @s[scores={flag=2}] run event entity @e[type=gvcv5:pmc,family=noteam,r=15] attack
tellraw @s[scores={flag=2}] {"rawtext":[{"translate":"gvcv5.order.attack.name"}]}
execute at @s[scores={flag=0}] run ride @e[family=noteam,type=!player,r=15] stop_riding
scoreboard players add @s flag 1
scoreboard players set @s[scores={flag=3..}] flag 0