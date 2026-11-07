scoreboard players remove @a[tag=!noout] out 1
scoreboard players set @a[tag=noout] out 10
execute as @a[scores={out=..0},tag=!noout] run scriptevent zex:spawnpoint
title @a[tag=!noout] title §4OUT OF AREA!
tag @a remove noout