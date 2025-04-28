titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"§412Gauge§r "},{"score":{"name":"@s","objective":"m1014"}},{"text":"/8"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={m1014=0},hasitem={item=zex:12m}] run scriptevent gvcv5:reload m1014
hud @s[tag=!scope] reset crosshair
