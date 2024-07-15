titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§6.22Cal§r "},{"score":{"name":"@s","objective":"m4a1"}},{"text":"/30"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,scores={m4a1=0},hasitem={item=zex:556m}] run scriptevent gvcv5:reload m4a1
hud @s[tag=!scope] reset crosshair
