titleraw @s[tag=!railcharged,tag=!railcharging,tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"§c.50Cal§r "},{"score":{"name":"@s","objective":"lazer"}},{"text":"/5"}]}
title @s[tag=railcharged] actionbar §eCharged
title @s[tag=railcharging] actionbar Charging
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={lazer=0},hasitem={item=zex:1270m}] run scriptevent gvcv5:reload lazer
hud @s[tag=!scope] reset crosshair
