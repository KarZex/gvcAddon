#values definistion
scoreboard objectives add cooldown dummy
scoreboard objectives add weapon1 dummy
scoreboard objectives add weapon1_cool dummy
scoreboard objectives add weapon1_max dummy
scoreboard objectives add weapon1_reload dummy
scoreboard objectives add weapon2 dummy
scoreboard objectives add weapon2_cool dummy
scoreboard objectives add weapon2_max dummy
scoreboard objectives add weapon2_reload dummy
scoreboard objectives add weapon3 dummy
scoreboard objectives add weapon3_cool dummy
scoreboard objectives add weapon3_max dummy
scoreboard objectives add weapon3_reload dummy
scoreboard objectives add weapon4 dummy
scoreboard objectives add weapon4_cool dummy
scoreboard objectives add weapon4_max dummy
scoreboard objectives add weapon4_reload dummy
scoreboard objectives add reloading dummy
scoreboard objectives add flag dummy
scoreboard objectives add antiMining dummy
scoreboard objectives add mtype dummy
scoreboard objectives add maxsubcool dummy
scoreboard objectives add printDamage dummy

scoreboard objectives add DeathTime dummy
scoreboard objectives add rise dummy
scoreboard objectives add out dummy
scoreboard objectives add building dummy
scoreboard objectives add lockon dummy
#initialize
execute as @s[tag=!startedv5] run scoreboard players set @s weapon1_cool 20
execute as @s[tag=!startedv5] run scoreboard players set @s weapon1 0
execute as @s[tag=!startedv5] run scoreboard players set @s weapon1_max 0
execute as @s[tag=!startedv5] run scoreboard players set @s weapon1_reload 0
execute as @s[tag=!startedv5] run scoreboard players set @s weapon2_cool 20
execute as @s[tag=!startedv5] run scoreboard players set @s weapon2 0
execute as @s[tag=!startedv5] run scoreboard players set @s weapon2_max 0
execute as @s[tag=!startedv5] run scoreboard players set @s weapon2_reload 0
execute as @s[tag=!startedv5] run scoreboard players set @s weapon3_cool 20
execute as @s[tag=!startedv5] run scoreboard players set @s weapon3 0
execute as @s[tag=!startedv5] run scoreboard players set @s weapon3_max 0
execute as @s[tag=!startedv5] run scoreboard players set @s weapon3_reload 0
execute as @s[tag=!startedv5] run scoreboard players set @s weapon4_cool 20
execute as @s[tag=!startedv5] run scoreboard players set @s weapon4 0
execute as @s[tag=!startedv5] run scoreboard players set @s weapon4_max 0
execute as @s[tag=!startedv5] run scoreboard players set @s weapon4_reload 0
execute as @s[tag=!startedv5] run scoreboard players set @s flag 0
execute as @s[tag=!startedv5] run scoreboard players set @s rise 0
execute as @s[tag=!startedv5] run scoreboard players set @s out 10
execute as @s[tag=!startedv5] run scoreboard players set @s antiMining 0
execute as @s[tag=!startedv5] run scoreboard players set @s DeathTime 0
execute as @s[tag=!startedv5] run scoreboard players set @s mtype 0
execute as @s[tag=!startedv5] run scoreboard players set @s printDamage 30
execute as @s[tag=!startedv5] run scoreboard players set @s lockon 0
execute as @s run scoreboard players set @s reloading 0
scoreboard objectives add fire dummy
execute as @s[tag=!startedv5] run scoreboard players set @s fire 30
#suppies
execute at @s[tag=!startedv5] run fill ^^^2 ^^^2 gvcv5:supplies
#scriptevent
scriptevent zex:start
scriptevent gvcv5:phone
#guns
