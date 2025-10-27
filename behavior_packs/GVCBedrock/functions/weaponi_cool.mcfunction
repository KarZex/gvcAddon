execute if score @s weaponi > @s weaponi_max run scoreboard players set @s weaponi_cool 100
execute if score @s weaponi > @s weaponi_max run scoreboard players set @s[scores={weaponi_cool=51..}] weaponi 0
scoreboard players remove @s[scores={weaponi_cool=1..}] weaponi_cool 1
scoreboard players remove @s[tag=!weaponiattack,scores={weaponi=1..}] weaponi 1
playsound reload.c @s[scores={weaponi_cool=20}]