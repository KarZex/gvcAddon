titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"§99mmHG§r "},{"score":{"name":"@s","objective":"glock17"}},{"text":"/20"}]}
playanimation @s animation.onehand.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,tag=!down,scores={glock17=0},hasitem={item=zex:mm9}] run scriptevent gvcv5:reload glock17
hud @s[tag=!scope] reset crosshair
