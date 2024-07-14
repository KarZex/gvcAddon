titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§3.30Cal§r "},{"score":{"name":"@s","objective":"mosin"}},{"text":"/5"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
hud @s[tag=!scope] reset crosshair
