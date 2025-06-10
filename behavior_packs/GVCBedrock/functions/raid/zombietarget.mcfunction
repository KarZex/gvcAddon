#使用するスコアボード
scoreboard objectives add blocky dummy
scoreboard objectives add blockx dummy
scoreboard objectives add break dummy
scoreboard players set @s[tag=!ed] break 50
tag @s[tag=!ed] add ed
scoreboard players add @s[scores={break=..49}] break 1
execute at @s if entity @s[scores={break=50..}] unless block ^^^1 minecraft:air run fill ^^0.5^1 ^^1.5^1 air destroy
execute at @s if entity @s[scores={break=50..}] unless block ^^^1 minecraft:air run scoreboard players set @s break 0

scoreboard players set @s[tag=!blockx] blockx 0
scoreboard players set @s[tag=blockxplace] blockx 0
scoreboard players set @s[tag=!blocky] blocky 0


#ターゲットが上にあるとき
execute as @s at @s[tag=!blocky,tag=!blockx,rx=-31,rxm=-90] run tag @s add blocky
execute as @s at @s[scores={blocky=0},rx=45,rxm=-30] run tag @s add blockxplace
execute as @s at @s[scores={blocky=0},tag=blocky,rx=45,rxm=-30] run tag @s remove blocky


execute as @s at @s[tag=blocky] run fill ~~2~ ~~2~ air destroy

execute as @s at @s[tag=blockxplace] unless block ~~-1~ minecraft:air run fill ^^-1^1 ^^-1^1 gvcv5:gvcv5_scaffold replace minecraft:water

tag @s[tag=blockxplace] remove blockxplace