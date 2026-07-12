scoreboard players remove @s[scores={antiMining=1..}] antiMining 1
tellraw @s[scores={antiMining=0}] {"rawtext":[{"translate":"gvcv5:can_break.name"}]}
tag @s[scores={antiMining=0}] remove antiMining
