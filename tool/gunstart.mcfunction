scoreboard objectives add cooldown dummy
scoreboard objectives add mcool dummy
scoreboard objectives add scool dummy
scoreboard objectives add reloading dummy
scoreboard objectives add flag dummy

execute as @s[tag=!startedv4] run scoreboard players set @s mcool 20
execute as @s[tag=!startedv4] run scoreboard players set @s scool 0
execute as @s[tag=!startedv4] run scoreboard players set @s flag 0
execute as @s run scoreboard players set @s reloading 0

scoreboard objectives add fire dummy
execute as @s[tag=!startedv4] run scoreboard players set @s fire 30

execute at @s[tag=!startedv4] run fill ^^^2 ^^^2 gvcv5:supplies
#guns

