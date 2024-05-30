title @s[tag=reload,scores={reloading=1..}] actionbar Reloading...
scoreboard players remove @s[scores={reloading=1..}] reloading 1
title @s[tag=reload,scores={reloading=0}] actionbar §eReloaded
tag @s[tag=reload,scores={reloading=0}] remove reload