execute as @a[tag=reload] run function reload

execute as @a[scores={mcool=1..}] run function mcool
execute as @a[scores={scool=1..}] run function scool

execute as @a[tag=!startedv4] run function gunstart

function sounds


execute at @e[type=fire:lazer] run particle minecraft:redstone_wire_dust_particle ~~~
execute at @e[type=fire:ads_lazer] run particle minecraft:redstone_wire_dust_particle ~~~
execute at @e[type=fire:fire] run particle minecraft:basic_flame_particle ~~~
execute at @e[type=fire:famas] run particle minecraft:basic_smoke_particle ~~~
execute at @e[type=fire:ads_famas] run particle minecraft:basic_smoke_particle ~~~

gamerule commandblockoutput false

