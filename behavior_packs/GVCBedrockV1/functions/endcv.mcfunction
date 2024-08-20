scoreboard objectives add endcv dummy
scoreboard players set @s[tag=!endcv] endcv 0
tag @s[scores={endcv=0}] add endcv

execute at @s[scores={endcv=0}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.endcv.crashed0.name" } ] }
execute at @s[scores={endcv=60}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.endcv.crashed1.name" } ] }
execute at @s[scores={endcv=120}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.endcv.crashed2.name" } ] }
execute at @s[scores={endcv=180}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.endcv.crashed3.name" } ] }
execute at @s[scores={endcv=180}] run structure load bosschest_cv ~~1~

scoreboard players add @s endcv 1
kill @s[scores={endcv=181..}]