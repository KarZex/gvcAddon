execute if score @s weaponii > @s weaponii_max run scoreboard players set @s weaponii_cool 100
execute if score @s weaponii > @s weaponii_max run scoreboard players set @s[scores={weaponii_cool=51..}] weaponii 0
scoreboard players remove @s[scores={weaponii_cool=1..}] weaponii_cool 1
scoreboard players remove @s[tag=!weaponiiattack,scores={weaponii=1..}] weaponii 1
playsound reload.c @s[scores={weaponi_cool=20}]