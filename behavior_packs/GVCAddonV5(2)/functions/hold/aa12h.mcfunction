titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"§412Gauge§r "},{"score":{"name":"@s","objective":"aa12"}},{"text":"/24"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,tag=!down,scores={aa12=0},hasitem={item=zex:12m}] run scriptevent gvcv5:reload aa12
hud @s[tag=!scope] reset crosshair
