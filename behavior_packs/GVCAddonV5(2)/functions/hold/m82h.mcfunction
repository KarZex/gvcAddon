titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§c.50Cal§r "},{"score":{"name":"@s","objective":"m82"}},{"text":"/10"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,scores={m82=0},hasitem={item=zex:1270m}] run scriptevent gvcv5:reload m82
hud @s[tag=!scope] reset crosshair
