titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§b.Rocket§r "},{"score":{"name":"@s","objective":"rpg"}},{"text":"/1"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
hud @s[tag=!scope] reset crosshair
