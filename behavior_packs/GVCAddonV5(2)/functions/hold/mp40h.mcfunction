titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§99mmHG§r "},{"score":{"name":"@s","objective":"mp40"}},{"text":"/20"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,scores={mp40=0},hasitem={item=zex:mm9}] run scriptevent gvcv5:reload mp40
hud @s[tag=!scope] reset crosshair
