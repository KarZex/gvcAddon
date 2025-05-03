execute as @a[tag=reload] run function reload

execute as @a[tag=onDeath] run function death
execute as @a[scores={mcool=1..}] run function mcool
execute as @a[scores={scool=1..}] run function scool

execute as @a[tag=!startedv5] run function gunstart
execute as @a[tag=down] run function down
execute as @a[tag=rise] run function rise

function sounds
tag @a[tag=!white] add white
 

#particle
execute at @e[type=fire:hauneb] run particle gvcv5:fire_hauneb_particle ~~~
execute at @e[type=fire:ads_lazer] run particle minecraft:redstone_wire_dust_particle ~~~
execute at @e[type=fire:lazer] run particle minecraft:redstone_wire_dust_particle ~~~
execute at @e[type=fire:fire] run particle minecraft:basic_flame_particle ~~~
execute at @e[type=fire:famas] run particle minecraft:basic_smoke_particle ~~~
execute at @e[type=fire:ads_famas] run particle minecraft:basic_smoke_particle ~~~

kill @e[type=item,name=83a5bfca04b6b421d23c]

gamerule commandblockoutput false

