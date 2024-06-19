execute as @a[tag=reload] run function reload

execute as @a[tag=autoreact] run function autoreact

execute as @a[scores={cooldown=1..}] run function cooldown

execute as @a[tag=!startedv4] run function gunstart

function sounds

execute as @a[tag=!nfeature] run function feature

execute at @e[type=fire:sar] run particle zex:iceball_wire_dust_particle ~~~
execute at @e[type=fire:iceboss] run particle zex:iceball_wire_dust_particle ~~~
execute at @e[type=fire:lazer] run particle minecraft:redstone_wire_dust_particle ~~~
execute at @e[type=fire:ads_lazer] run particle minecraft:redstone_wire_dust_particle ~~~
execute at @e[type=fire:fire] run particle minecraft:basic_flame_particle ~~~
execute at @e[type=fire:famas] run particle minecraft:basic_smoke_particle ~~~
execute at @e[type=fire:ads_famas] run particle minecraft:basic_smoke_particle ~~~

gamerule commandblockoutput false

