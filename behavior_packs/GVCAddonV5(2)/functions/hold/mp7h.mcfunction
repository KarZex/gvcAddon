titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§99mmHG§r "},{"score":{"name":"@s","objective":"mp7"}},{"text":"/40"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
hud @s[tag=!scope] reset crosshair
