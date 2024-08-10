scoreboard objectives add mr_cpt_talk dummy
scoreboard players set @s[tag=!mr_cpt_talk] mr_cpt_talk 0
scoreboard players set @s[scores={mr_cpt_talk=8..}] mr_cpt_talk 0
tag @s[scores={mr_cpt_talk=0}] add mr_cpt_talk

execute unless entity @e[type=gvcv5:jamming,r=120] run event entity @s nocrash
execute unless entity @e[type=gvcv5:jamming,r=120] run scoreboard players set @s[tag=!jamming_destroy] mr_cpt_talk 0
execute unless entity @e[type=gvcv5:jamming,r=120] run tag @s add jamming_destroy

execute at @s[scores={mr_cpt_talk=0},tag=jamming_destroy] run tellraw @a[r=5] { "rawtext": [ { "translate": "gvcv5.mr_cpt.jamming_destroy0.name" } ] }
execute at @s[scores={mr_cpt_talk=1},tag=jamming_destroy] run tellraw @a[r=5] { "rawtext": [ { "translate": "gvcv5.mr_cpt.jamming_destroy1.name" } ] }
execute at @s[scores={mr_cpt_talk=2},tag=jamming_destroy] run tellraw @a[r=5] { "rawtext": [ { "translate": "gvcv5.mr_cpt.jamming_destroy2.name" } ] }


execute at @s[scores={mr_cpt_talk=0},tag=!jamming_destroy] run tellraw @a[r=5] { "rawtext": [ { "translate": "gvcv5.mr_cpt.talk0.name" } ] }
execute at @s[scores={mr_cpt_talk=1},tag=!jamming_destroy] run tellraw @a[r=5] { "rawtext": [ { "translate": "gvcv5.mr_cpt.talk1.name" } ] }
execute at @s[scores={mr_cpt_talk=2},tag=!jamming_destroy] run tellraw @a[r=5] { "rawtext": [ { "translate": "gvcv5.mr_cpt.talk2.name" } ] }
execute at @s[scores={mr_cpt_talk=3},tag=!jamming_destroy] run tellraw @a[r=5] { "rawtext": [ { "translate": "gvcv5.mr_cpt.talk3.name" } ] }
execute at @s[scores={mr_cpt_talk=4},tag=!jamming_destroy] run tellraw @a[r=5] { "rawtext": [ { "translate": "gvcv5.mr_cpt.talk4.name" } ] }
execute at @s[scores={mr_cpt_talk=5},tag=!jamming_destroy] run tellraw @a[r=5] { "rawtext": [ { "translate": "gvcv5.mr_cpt.talk5.name" } ] }
execute at @s[scores={mr_cpt_talk=6},tag=!jamming_destroy] run tellraw @a[r=5] { "rawtext": [ { "translate": "gvcv5.mr_cpt.talk6.name" } ] }
execute at @s[scores={mr_cpt_talk=7},tag=!jamming_destroy] run tellraw @a[r=5] { "rawtext": [ { "translate": "gvcv5.mr_cpt.talk7.name" } ] }

scoreboard players add @s mr_cpt_talk 1

