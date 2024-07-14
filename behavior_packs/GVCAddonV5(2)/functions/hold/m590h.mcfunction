titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§412Gauge§r "},{"score":{"name":"@s","objective":"m590"}},{"text":"/8"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
hud @s[tag=!scope] reset crosshair
