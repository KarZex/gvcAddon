titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§6.22Cal§r "},{"score":{"name":"@s","objective":"ak47"}},{"text":"/30"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,scores={ak47=0},hasitem={item=zex:556m}] run scriptevent gvcv5:reload ak47
hud @s[tag=!scope] reset crosshair
