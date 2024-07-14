titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§e40mmGrenade§r "},{"score":{"name":"@s","objective":"xm8"}},{"text":"/4"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
hud @s[tag=!scope] reset crosshair
