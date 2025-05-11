inputpermission set @s[scores={rise=1..},tag=rise] movement disabled
inputpermission set @s[scores={rise=1..},tag=rise] camera disabled 
scoreboard players remove @s[scores={rise=1..},tag=rise] rise 1
inputpermission set @s[scores={rise=0},tag=rise] movement enabled
inputpermission set @s[scores={rise=0},tag=rise] camera enabled 
event entity @s[scores={rise=0},tag=rise] gvcv5:remove_down_true
tag @s[scores={rise=0},tag=rise] remove rise
effect @s[tag=rise] wither 0
effect @s[tag=rise] slowness 0
effect @s[tag=rise] weakness 0