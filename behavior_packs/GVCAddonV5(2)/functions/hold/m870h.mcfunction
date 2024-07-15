titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§412Gauge§r "},{"score":{"name":"@s","objective":"m870"}},{"text":"/4"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,scores={m870=0},hasitem={item=zex:12m}] run scriptevent gvcv5:reload m870
hud @s[tag=!scope] reset crosshair
