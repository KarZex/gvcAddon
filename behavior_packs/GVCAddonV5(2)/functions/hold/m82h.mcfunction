titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§c.50Cal§r "},{"score":{"name":"@s","objective":"m82"}},{"text":"/10"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
hud @s[tag=!scope] reset crosshair
