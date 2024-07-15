titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§99mmHG§r "},{"score":{"name":"@s","objective":"ppsh"}},{"text":"/72"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,scores={ppsh=0},hasitem={item=zex:mm9}] run scriptevent gvcv5:reload ppsh
hud @s[tag=!scope] reset crosshair
