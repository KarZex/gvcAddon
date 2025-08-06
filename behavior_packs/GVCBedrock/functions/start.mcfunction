execute as @a[tag=reload] run function reload

execute as @a[tag=onDeath] run function death
execute as @a[scores={mcool=1..}] run function mcool
execute as @a[scores={mcooli=1..}] run function mcooli
execute as @a[scores={mcoolii=1..}] run function mcoolii


execute as @a run function scool

execute as @a[tag=!startedv5] run function gunstart
execute as @a[tag=down] run function down
execute as @a[tag=rise] run function rise
execute as @e[tag=raid] run function raid/zombietarget

gamemode a @a[m=s,scores={antiMining=1..}]
execute as @a[m=a,scores={antiMining=1..}] run function antiMining

execute as @a[tag=!subattack,scores={subWeapon=1..}] run scoreboard players remove @s subWeapon 1

function sounds

execute if score P building matches 1 run tag @a[tag=!nobomb] add nobomb
execute if score P building matches 0 run tag @a[tag=nobomb] remove nobomb

#particle
execute at @e[type=fire:hauneb] run particle gvcv5:fire_hauneb_particle ~~~
execute at @e[type=fire:ads_lazer] run particle minecraft:redstone_wire_dust_particle ~~~
execute at @e[type=fire:lazer] run particle minecraft:redstone_wire_dust_particle ~~~
execute at @e[type=fire:fire] run particle minecraft:basic_flame_particle ~~~
execute at @e[type=fire:famas] run particle minecraft:basic_smoke_particle ~~~
execute at @e[family=ppbombbullet] run particle minecraft:basic_smoke_particle ~~~

execute at @e[type=fire:ads_famas] run particle minecraft:basic_smoke_particle ~~~

execute at @e[family=drop] run particle minecraft:basic_flame_particle ~~~

execute at @e[type=gvcv5:airstrike_red] run particle zex:red_strike ~~~
execute at @e[type=gvcv5:airstrike_blue] run particle zex:blue_strike ~~~
execute at @e[type=gvcv5:airstrike_green] run particle zex:green_strike ~~~
execute at @e[type=gvcv5:airstrike_yellow] run particle zex:yellow_strike ~~~
execute at @e[type=gvcv5:airstrike_noteam] run particle zex:noteam_strike ~~~
execute at @e[type=fire:agmissile] run particle minecraft:basic_flame_particle ~~~

kill @e[type=item,name=83a5bfca04b6b421d23c]

gamerule commandblockoutput false

