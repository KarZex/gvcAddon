
# Breaking blocks every 2.5 seconds
scoreboard objectives add break dummy
scoreboard objectives add blocky dummy
scoreboard players set @s[tag=!ed] break 50
tag @s[tag=!ed] add ed
scoreboard players add @s[scores={break=..49}] break 1
execute at @s if entity @s[scores={break=50..},rx=75,rxm=-90] unless block ^^^1 minecraft:air positioned ~~1~ run fill ^^^1 ^^2^1 air destroy
execute at @s if entity @s[scores={break=50..},rx=75,rxm=-90] unless block ^^^1 minecraft:air positioned ~~1~ run scoreboard players set @s break 0
#under 
execute at @s if entity @s[scores={break=50..},rx=90,rxm=75] unless block ~~-1~ minecraft:air run fill ~~-1~ ~~-1~ air destroy
execute at @s if entity @s[scores={break=50..},rx=90,rxm=75] unless block ~~-1~ minecraft:air run scoreboard players set @s break 0

#ターゲットが上にあるとき
execute as @s at @s[tag=!blocky,rx=-31,rxm=-90] run tag @s add blocky
execute as @s at @s[scores={blocky=0},tag=blocky,rx=45,rxm=-30] run tag @s remove blocky

scoreboard players add @s[tag=blocky] blocky 1
execute as @s at @s[tag=blocky,scores={blocky=1..3}] run tp @s ~~0.5~
execute as @s at @s[tag=blocky,scores={blocky=4..9}] if block ~~-1~ minecraft:air run fill ~~-1~ ~~-1~ gvcv5:gvcv5_scaffold destroy
execute as @s at @s[tag=blocky,scores={blocky=4..9}] if block ~~-1~ minecraft:air run fill ~~-1~ ~~-1~ gvcv5:gvcv5_scaffold replace snow_layer
scoreboard players set @s[scores={blocky=10..}] blocky 0

#Across the river and buiding the bridge
execute as @s[tag=!blocky] at @s unless block ~~-1~ minecraft:air run fill ^^-1^1 ^^-1^1 gvcv5:gvcv5_scaffold keep
execute as @s[tag=!blocky] at @s unless block ~~-1~ minecraft:air run fill ^^-1^1 ^^-1^1 gvcv5:gvcv5_scaffold replace minecraft:water
execute as @s[tag=!blocky] at @s unless block ~~-1~ minecraft:air if block ~~~ minecraft:air run fill ^^-1^1 ^^-1^1 gvcv5:gvcv5_scaffold replace minecraft:lava