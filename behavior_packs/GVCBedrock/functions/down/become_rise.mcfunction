inputpermission set @s[scores={rise=1..},tag=rise] movement disabled
inputpermission set @s[scores={rise=1..},tag=rise] camera disabled 
scoreboard players remove @s[scores={rise=1..},tag=rise] rise 1
execute as @s[scores={rise=0},tag=rise] run function down/become_rise2