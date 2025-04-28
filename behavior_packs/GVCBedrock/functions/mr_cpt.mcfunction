scoreboard objectives add mr_cpt dummy
scoreboard players set @s[tag=!mr_cpt] mr_cpt 0
scoreboard players set @s[scores={mr_cpt=4..}] mr_cpt 0
tag @s[scores={mr_cpt=0}] add mr_cpt

execute at @s[scores={mr_cpt=0}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.mr_cpt.crashed0.name" } ] }
execute at @s[scores={mr_cpt=1}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.mr_cpt.crashed1.name" } ] }
execute at @s[scores={mr_cpt=2}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.mr_cpt.crashed2.name" } ] }
execute at @s[scores={mr_cpt=3}] run tellraw @a[r=60] { "rawtext": [ { "translate": "gvcv5.mr_cpt.crashed3.name" } ] }

scoreboard players add @s mr_cpt 1
scoreboard players set @s[scores={mr_cpt=4..}] mr_cpt 0