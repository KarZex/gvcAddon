##Red Boss Flag

effect @e[family=redteam,r=60] regeneration 1 2 false
effect @e[family=redteam,r=60] resistance 1 4 false

##kill another country's player
damage @a[family=blueteam,r=60] 2 override
damage @a[family=greenteam,r=60] 2 override
damage @a[family=yellowteam,r=60] 2 override

kill @e[family=blueteam,r=60,type=!player]
kill @e[family=greenteam,r=60,type=!player] 
kill @e[family=yellowteam,r=60,type=!player]

kill @e[family=monster] 


## Another country player cant mine or placing
scoreboard players set @a[r=60,family=!redteam,tag=!working] antiMining 200


## warning
title @a[r=60,family=!redteam,tag=!working] title "This is Red Base"