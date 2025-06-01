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
scoreboard objectives add out dummy
scoreboard objectives add building dummy
#initialize
execute as @s[tag=!startedv5] run scoreboard players set @s mcool 20
execute as @s[tag=!startedv5] run scoreboard players set @s scool 0
execute as @s[tag=!startedv5] run scoreboard players set @s flag 0
execute as @s[tag=!startedv5] run scoreboard players set @s rise 0
execute as @s[tag=!startedv5] run scoreboard players set @s out 0
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

scoreboard objectives add aa12 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s aa12 24
scoreboard objectives add ak12 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s ak12 30
scoreboard objectives add ak47 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s ak47 30
scoreboard objectives add ak102 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s ak102 30
scoreboard objectives add an94 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s an94 30
scoreboard objectives add awm dummy
execute as @a[tag=!startedv5] run scoreboard players set @s awm 5
scoreboard objectives add dp28 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s dp28 47
scoreboard objectives add famas dummy
execute as @a[tag=!startedv5] run scoreboard players set @s famas 6
scoreboard objectives add g36 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s g36 30
scoreboard objectives add g3a3 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s g3a3 20
scoreboard objectives add glock17 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s glock17 20
scoreboard objectives add glock18 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s glock18 20
scoreboard objectives add hk416 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s hk416 30
scoreboard objectives add lazer dummy
execute as @a[tag=!startedv5] run scoreboard players set @s lazer 5
scoreboard objectives add m4 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m4 30
scoreboard objectives add m4a1 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m4a1 30
scoreboard objectives add m9 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m9 16
scoreboard objectives add m10 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m10 30
scoreboard objectives add m16a1 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m16a1 30
scoreboard objectives add m16a4 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m16a4 30
scoreboard objectives add m60 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m60 100
scoreboard objectives add m72 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m72 1
scoreboard objectives add m79 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m79 1
scoreboard objectives add m82 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m82 10
scoreboard objectives add m110 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m110 20
scoreboard objectives add m202 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m202 4
scoreboard objectives add m249 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m249 100
scoreboard objectives add m590 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m590 8
scoreboard objectives add m870 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m870 4
scoreboard objectives add m1014 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m1014 8
scoreboard objectives add m1911 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s m1911 8
scoreboard objectives add mg36 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s mg36 100
scoreboard objectives add mg42 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s mg42 75
scoreboard objectives add mosin dummy
execute as @a[tag=!startedv5] run scoreboard players set @s mosin 5
scoreboard objectives add mp5 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s mp5 30
scoreboard objectives add mp7 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s mp7 40
scoreboard objectives add mp40 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s mp40 20
scoreboard objectives add p90 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s p90 1
scoreboard objectives add pkm dummy
execute as @a[tag=!startedv5] run scoreboard players set @s pkm 100
scoreboard objectives add ppsh dummy
execute as @a[tag=!startedv5] run scoreboard players set @s ppsh 72
scoreboard objectives add rpg dummy
execute as @a[tag=!startedv5] run scoreboard players set @s rpg 1
scoreboard objectives add rpk dummy
execute as @a[tag=!startedv5] run scoreboard players set @s rpk 100
scoreboard objectives add saiga12 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s saiga12 6
scoreboard objectives add scar dummy
execute as @a[tag=!startedv5] run scoreboard players set @s scar 20
scoreboard objectives add svd dummy
execute as @a[tag=!startedv5] run scoreboard players set @s svd 10
scoreboard objectives add tt33 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s tt33 8
scoreboard objectives add uzi dummy
execute as @a[tag=!startedv5] run scoreboard players set @s uzi 30
scoreboard objectives add vz61 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s vz61 20
scoreboard objectives add xm8 dummy
execute as @a[tag=!startedv5] run scoreboard players set @s xm8 8
tag @a[tag=!startedv5] add startedv5
