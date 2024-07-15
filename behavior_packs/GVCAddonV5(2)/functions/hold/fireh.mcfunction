titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§6.22Cal§r "},{"score":{"name":"@s","objective":"fire"}},{"text":"/30"}]}
playanimation @s animation.onehand.first none 0 "!query.is_item_equipped"
execute if entity @s[tag=!reload,scores={fire=0},hasitem={item=zex:556m}] run scriptevent gvcv5:reload fire
