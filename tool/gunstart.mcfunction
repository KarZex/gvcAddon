#values definistion
scoreboard objectives add cooldown dummy
scoreboard objectives add mcool dummy
scoreboard objectives add scool dummy
scoreboard objectives add reloading dummy
scoreboard objectives add flag dummy
scoreboard objectives add antiMining dummy
scoreboard objectives add mtype dummy

scoreboard objectives add DeathTime dummy
scoreboard objectives add rise dummy
scoreboard objectives add building dummy
#initialize
execute as @s[tag=!startedv5] run scoreboard players set @s mcool 20
execute as @s[tag=!startedv5] run scoreboard players set @s scool 0
execute as @s[tag=!startedv5] run scoreboard players set @s flag 0
execute as @s[tag=!startedv5] run scoreboard players set @s rise 0
execute as @s[tag=!startedv5] run scoreboard players set @s antiMining 0
execute as @s[tag=!startedv5] run scoreboard players set @s DeathTime 0
execute as @s[tag=!startedv5] run scoreboard players set @s mtype 0
execute as @s run scoreboard players set @s reloading 0
scoreboard objectives add fire dummy
execute as @s[tag=!startedv5] run scoreboard players set @s fire 30
#suppies
execute at @s[tag=!startedv5] run fill ^^^2 ^^^2 gvcv5:supplies
#scriptevent
scriptevent zex:start
scriptevent gvcv5:phone
#guns

