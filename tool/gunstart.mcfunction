scoreboard objectives add cooldown dummy
scoreboard objectives add reloading dummy
scoreboard objectives add flag dummy

execute as @a[tag=!startedv4] run scoreboard players set @s cooldown 20
execute as @a[tag=!startedv4] run scoreboard players set @s flag 0
execute as @a[tag=!startedv4] run scoreboard players set @s reloading 0

fill ^^^2 ^^^2 hkz:firstitem
tag @a[tag=!startedv4] add startedv4 
#guns

