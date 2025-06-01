tag @a[family=red,x=-3200,y=-64,z=-3200,dx=3200,dy=384,dz=6400] add noout
tag @a[family=blue,x=0,y=-64,z=-3200,dx=3200,dy=384,dz=6400] add noout
scoreboard players remove @a[tag=!noout] out 1
scoreboard players set @a[tag=noout] out 10
execute as @a[scores={out=..0},tag=!noout] run scriptevent zex:firstspawn
title @a[tag=!noout] title §4OUT OF AREA!
tag @a remove noout