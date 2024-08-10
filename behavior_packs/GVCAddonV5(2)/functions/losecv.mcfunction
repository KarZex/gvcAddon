scoreboard objectives add losecv dummy
scoreboard players set @s[tag=!losecv] losecv 0
tag @s[scores={losecv=0}] add losecv

execute at @s[scores={losecv=0}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.losecv.crashed0.name" } ] }
execute at @s[scores={losecv=60}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.losecv.crashed1.name" } ] }
execute at @s[scores={losecv=120}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.losecv.crashed2.name" } ] }
execute at @s[scores={losecv=120}] run kill @e[type=gvcv5:ca,r=120]
execute at @s[scores={losecv=120}] run kill @e[type=gvcv5:mr_cpt,r=120]

scoreboard players add @s losecv 1
kill @s[scores={losecv=121..}]