titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§3.30Cal§r "},{"score":{"name":"@s","objective":"dp28"}},{"text":"/47"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,scores={dp28=0},hasitem={item=zex:762m}] run scriptevent gvcv5:reload dp28
hud @s[tag=!scope] reset crosshair
