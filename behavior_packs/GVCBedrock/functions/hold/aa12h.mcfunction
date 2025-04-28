titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"Åò412GaugeÅòr "},{"score":{"name":"@s","objective":"aa12"}},{"text":"/24"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={aa12=0},hasitem={item=zex:12m}] run scriptevent gvcv5:reload aa12
hud @s[tag=!scope] reset crosshair
