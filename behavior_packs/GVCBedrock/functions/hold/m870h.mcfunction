titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"Åò412GaugeÅòr "},{"score":{"name":"@s","objective":"m870"}},{"text":"/4"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={m870=0},hasitem={item=zex:12m}] run scriptevent gvcv5:reload m870
hud @s[tag=!scope] reset crosshair
