
# Breaking blocks every 2.5 seconds
scoreboard objectives add break dummy
scoreboard players set @s[tag=!ed] break 50
tag @s[tag=!ed] add ed
scoreboard players add @s[scores={break=..49}] break 1
execute at @s if entity @s[scores={break=50..}] unless block ^^^1 minecraft:air run fill ^^0.5^1 ^^1.5^1 air destroy
execute at @s if entity @s[scores={break=50..}] unless block ^^^1 minecraft:air run scoreboard players set @s break 0

#Across the river and buiding the bridge
execute as @s at @s unless block ~~-1~ minecraft:air run fill ^^-1^1 ^^-1^1 gvcv5:gvcv5_scaffold keep
execute as @s at @s unless block ~~-1~ minecraft:air if block ~~~ minecraft:air run fill ^^-1^1 ^^-1^1 gvcv5:gvcv5_scaffold replace minecraft:water
execute as @s at @s unless block ~~-1~ minecraft:air if block ~~~ minecraft:air run fill ^^-1^1 ^^-1^1 gvcv5:gvcv5_scaffold replace minecraft:lava