scoreboard objectives add precv dummy
scoreboard players set @s[tag=!precv] precv 0
tag @s[scores={precv=0}] add precv

execute at @s[scores={precv=0}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.precv.crashed0.name" } ] }
execute at @s[scores={precv=60}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.precv.crashed1.name" } ] }
execute at @s[scores={precv=120}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.precv.crashed2.name" } ] }
execute at @s[scores={precv=180}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.precv.crashed3.name" } ] }
execute at @s[scores={precv=240}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.precv.crashed4.name" } ] }
execute at @s[scores={precv=300}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.precv.crashed5.name" } ] }

scoreboard players add @s[scores={precv=..301}] precv 1