titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§99mmHG§r "},{"score":{"name":"@s","objective":"uzi"}},{"text":"/30"}]}
playanimation @s animation.onehand.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,scores={uzi=0},hasitem={item=zex:mm9}] run scriptevent gvcv5:reload uzi
hud @s[tag=!scope] reset crosshair
