import { world, system, EquipmentSlot, EntityComponentTypes, DamagedByEntityCondition, EntityDamageCause  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import "./teamCompornents";
import { absVector2, getTeam,DistanceVector3in2dim } from "./usefulFunction"

const Teams = [ "red","blue","green","yellow" ];
const worldDimensions = [ `overworld`, `nether`, `the_end` ];
//1 day
const CoolTime = 24000;
function gvcv5GetTime() {
    const time = world.getAbsoluteTime();
    let day = Math.floor(time / 24000); // 1日 = 24000ティック
    let hour = Math.floor((time % 24000) / 1000) + 6; // 1時間 = 1000ティック、午前6時開始
    let minute = Math.floor((time % 1000) / 1000 * 60); // 1分 = 60秒

    // 時間が24以上の場合、次の日に繰り上げ
    if (hour >= 24) {
        hour -= 24;
        day += 1;
    }

    // 日、時間、分を2桁に整形
    if (day < 10) { day = `0${day}`; }
    if (hour < 10) { hour = `0${hour}`; }
    if (minute < 10) { minute = `0${minute}`; }

    return `${day}:${hour}:${minute}`;
}
async function tpWithDelay( user, location,dimension, delay){
	user.sendMessage(`you will be teleported in ${delay/20} seconds`);
	user.runCommand(`inputpermission set @s movement disabled`);
	await system.waitTicks(delay);
	user.runCommand(`inputpermission set @s movement enabled`);
	user.teleport(location, { dimension: dimension });
}

function gvcv5becomeTeam( user,team ){
	if( world.getDynamicProperty(`${team}Leader`) == undefined ){
		if( world.getDynamicProperty(`${team}Pass`) != undefined ){
			const form = new ModalFormData();
			form.title(`script.gvcv5.input_password.name`);
			form.textField(`script.gvcv5.input_password.name`,``);
			form.show(user).then( r => {
				if (!r.canceled) {
					if( world.getDynamicProperty(`${team}Pass`) == r.formValues[0] ){
						gvcv5CreateTeam(user,team);
					}
					else{
						user.sendMessage({ translate: `script.gvcv5.invaid_password.name`});
					}
				}
			},)
		}
		else{
			gvcv5CreateTeam(user,team);
		}
	}
	else{
		if( user.hasTag(`bannedFrom${team}`) ){
			user.sendMessage({ translate: `script.gvcv5.bannedFrom${team}.name`});
		}
		else {
			user.addTag(`wantToBe${team}`);
			user.runCommand(`tellraw @a[tag=${team}Leader] {\"rawtext\":[{\"text\":\"${user.nameTag}\"},{\"translate\":\"script.gvcv5.wantToBe.name\"}]}`)
		}
	}
}

function gvcv5CreateTeam( user,team ){
	user.triggerEvent(`gvcv5:become_${team}team`);
	world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.youAreIn${team}team.name`}]);
	world.setDynamicProperty(`${team}chat`,``);
	world.setDynamicProperty(`${team}list`,`${user.nameTag}`);
	world.setDynamicProperty(`${team}Leader`,`${user.name}`);
	user.addTag(`${team}Leader`);
	if( world.getDynamicProperty(`teamJail`) ){
		user.runCommand(`give @s gvcv5:building_${team}jail_b`)
	}
}
function gvcv5RemoveTeam( team ){
	world.setDynamicProperty(`${team}Leader`,undefined);
	world.setDynamicProperty(`${team}list`,``);
	for( const myAlly of world.getPlayers({ families: [ team ] }) ){
		myAlly.triggerEvent(`gvcv5:become_noteam`);
		myAlly.removeTag(`${team}Leader`);
		myAlly.runCommand(`clear @s zex:phone_${team}`);
	}
	world.sendMessage([{ translate: `script.gvcv5.phone_dismantle_${team}.name`}]);
}
function gvcv5AddTeamList( user,team ){
	if( world.getDynamicProperty(`${team}list`) == undefined ){
		world.setDynamicProperty(`${team}list`,`${user.nameTag}`);
	}
	else{
		world.setDynamicProperty(`${team}list`,`${world.getDynamicProperty(`${team}list`)}\n${user.nameTag}`);
	}
}
function gvcv5RemoveTeamList( user,team ){
	if( world.getDynamicProperty(`${team}list`) != undefined ){
		world.setDynamicProperty(`${team}list`,`${world.getDynamicProperty(`${team}list`).replace(`\n${user.nameTag}`,"")}`);
	}
}


async function startAttack(user, attacker, defender, attackFlag){
	//world.setDynamicProperty(`${userFamily}_attackCool`,world.getAbsoluteTime());
	world.setDynamicProperty(`gvcv5:flagAttacker`,attacker);
	world.setDynamicProperty(`gvcv5:flagDefender`,defender);
	world.setDynamicProperty(`gvcv5:flagDimension`,user.dimension.id);
	world.setDynamicProperty(`gvcv5:flagAttackFlag`,attackFlag);
	print(defender);
	world.scoreboard.getObjective(`ALLFlags`).setScore(`Prepare`,3600);
	// 3 minutes until start, you can change this time by changing the score of "Prepare"
	world.sendMessage([{ translate: `script.gvcv5:${attacker}team2.name` },{ translate: `script.gvcv5:${defender}_team.name` },{ text: `_${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `03:00` }]);
	await system.waitTicks(1200); // 1 minutes in ticks
	// 2 minutes until start
	world.sendMessage([{ translate: `script.gvcv5:${attacker}team2.name` },{ translate: `script.gvcv5:${defender}_team.name` },{ text: `_${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `02:00` }]);
	await system.waitTicks(1200); // 1 minutes in ticks
	// 1 minute until start
	world.sendMessage([{ translate: `script.gvcv5:${attacker}team2.name` },{ translate: `script.gvcv5:${defender}_team.name` },{ text: `_${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `01:00` }]);
	await system.waitTicks(600); // 30s in ticks
	world.sendMessage([{ translate: `script.gvcv5:${attacker}team2.name` },{ translate: `script.gvcv5:${defender}_team.name` },{ text: `_${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:30` }]);
	await system.waitTicks(300); // 15s in ticks
	world.sendMessage([{ translate: `script.gvcv5:${attacker}team2.name` },{ translate: `script.gvcv5:${defender}_team.name` },{ text: `_${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:15` }]);
	await system.waitTicks(100); // 5s in ticks
	world.sendMessage([{ translate: `script.gvcv5:${attacker}team2.name` },{ translate: `script.gvcv5:${defender}_team.name` },{ text: `_${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:10` }]);
	await system.waitTicks(100); // 5s in ticks
	world.sendMessage([{ translate: `script.gvcv5:${attacker}team2.name` },{ translate: `script.gvcv5:${defender}_team.name` },{ text: `_${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:05` }]);
	await system.waitTicks(20);
	world.sendMessage([{ translate: `script.gvcv5:${attacker}team2.name` },{ translate: `script.gvcv5:${defender}_team.name` },{ text: `_${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:04` }]);
	await system.waitTicks(20);
	world.sendMessage([{ translate: `script.gvcv5:${attacker}team2.name` },{ translate: `script.gvcv5:${defender}_team.name` },{ text: `_${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:03` }]);
	await system.waitTicks(20);
	world.sendMessage([{ translate: `script.gvcv5:${attacker}team2.name` },{ translate: `script.gvcv5:${defender}_team.name` },{ text: `_${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:02` }]);
	await system.waitTicks(20);
	world.sendMessage([{ translate: `script.gvcv5:${attacker}team2.name` },{ translate: `script.gvcv5:${defender}_team.name` },{ text: `_${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlag.name` },{ text: `00:01` }]);
	await system.waitTicks(20);
	world.setDynamicProperty(`gvcv5:flagAttackStart`,true);
	world.sendMessage([{ translate: `script.gvcv5:${attacker}team2.name` },{ translate: `script.gvcv5:${defender}_team.name` },{ text: `_${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlagStart1.name` }]);
	world.scoreboard.getObjective(`ALLFlags`).removeParticipant(`Prepare`);
	world.scoreboard.getObjective(`ALLFlags`).setScore(`Battle`,12000);
}


// world.beforeEvents.playerLeave.subscribe( e => {
// 	if( e.player.hasTag(`onDeath`) ){
// 		e.player.setDynamicProperty(`cTime`,world.getAbsoluteTime());
// 	}
// } )
// world.afterEvents.playerJoin.subscribe( e => {
// 	const player = world.getPlayers( { name : e.playerName } )[0];
// 	if( player.hasTag(`onDeath`) ){
// 		const score = world.getAbsoluteTime() - player.getDynamicProperty(`cTime`);
// 		world.scoreboard.getObjective("DeathTime").setScore(player,score);
// 	}
// } )

// world.afterEvents.playerSpawn.subscribe( e => {
// 	const player = e.player;
// 	if( player.hasTag(`withphone`) ){
// 		player.runCommand(`give @s zex:phone_noteam`);
// 	}
// });

//Colored nameTags
system.runInterval( () => {
	const players = world.getAllPlayers();
	for( const player of players ){
		if( player.hasTag(`down`) ){
			player.runCommand(`camera @s fade time 1 0 1 color 128 0 0`);
		}
		if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`redteam`) ){
			player.nameTag = `§c${player.name}§r`;
		}
		else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`blueteam`) ){
			player.nameTag = `§9${player.name}§r`;
		}
		else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`greenteam`) ){
			player.nameTag = `§a${player.name}§r`;
		}
		else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`yellowteam`) ){
			player.nameTag = `§e${player.name}§r`;
		}
		else{
			player.nameTag = `${player.name}`;
		}
	}
},40 );

//Down Damage
system.runInterval( () => {
	const players = world.getAllPlayers();
	for( const player of players ){
		if( player.hasTag(`down`) && !player.hasTag(`rise`) && world.getPlayers({name:`${player.getDynamicProperty(`killer`)}`}).length > 0 ){
			player.applyDamage(1,{ damagingEntity:world.getPlayers({name:`${player.getDynamicProperty(`killer`)}`})[0],cause:EntityDamageCause.magic });
		}
		else if( player.hasTag(`down`) && !player.hasTag(`rise`) ){
			player.applyDamage(1,{ cause:EntityDamageCause.magic });
			player.applyKnockback({ x:0, z:0 },0);
		}
	}
	if( world.getDynamicProperty("gvcv5:isBossFlag") ){
		for( const team of Teams ){
			for( const d of worldDimensions ){
				const flags = world.getDimension(d).getEntities({ type:`gvcv5:flag_${team}_main_base` });
				for( const flag of flags ){
					if( flag.getDynamicProperty(`TPBlockSlot`) != undefined
						&& ( !world.getDynamicProperty(`gvcv5:flagAttackStart`) || 
						(world.getDynamicProperty(`gvcv5:flagDefender`) != team && world.getDynamicProperty(`gvcv5:flagAttackFlag`) != flag.getDynamicProperty(`TPBlockSlot`))  )
					){
						flag.runCommand(`execute as @s run function boss/${team}`)
					}
				}
			}
		}

	}
},20 );

//player Revive 
world.afterEvents.entityHitEntity.subscribe( e => {
	const attacker = e.damagingEntity;
	const victim = e.hitEntity;
	if( attacker.typeId == "minecraft:player" && victim.typeId == "minecraft:player" ){
		if( victim.hasTag(`down`) && !attacker.hasTag(`down`) && getTeam(attacker) == getTeam(victim) ){
			attacker.runCommand(`function down/revive_attacker`);
			victim.runCommand(`function down/revive_victim`);
			victim.setDynamicProperty(`killer`,undefined);
			victim.setDynamicProperty(`downedBy`,undefined);
		}
	}
})

//on downed antiMining is scored to 999999 to prevent mining, but if the player is revived, it should be set back to 1. This is handled in the revive_victim.mcfunction file.
world.beforeEvents.itemUse.subscribe( e => {
	const player = e.source;
	if( player.hasTag(`down`) ){
		if( e.itemStack.typeId != "zex:selfkit" ){
			e.cancel = true;
		}
	}
})

world.beforeEvents.playerBreakBlock.subscribe( e => {
	const player = e.player;
	if( world.scoreboard.getObjective(`antiMining`).getScore(player) > 0 ){
		e.cancel = true;
	}
})

world.beforeEvents.playerInteractWithBlock.subscribe( e => {
	const player = e.player;
	if( world.scoreboard.getObjective(`antiMining`).getScore(player) > 0 ){
		e.cancel = true;
	}
})

world.afterEvents.playerInteractWithEntity.subscribe( e => {
	const entity = e.target;
	const player = e.player;
	const userFamily = getTeam(player).replace(`team`,``);
	//print(`player:${player.name}, entity:${entity.typeId}, userFamily:${userFamily}`);
	if( e.itemStack.typeId == `zex:bossflag` && entity.typeId == `gvcv5:flag_${userFamily}` && world.getDynamicProperty("gvcv5:isBossFlag") ){
		for( const Team of Teams ){
			for( let i = 0; i < 9; i++ ){
				if( world.getDynamicProperty(`${Team}_slot${i}`) == undefined ){
					continue;
				}
				else if( world.getDynamicProperty(`${Team}_slot${i}_dimension`) != entity.dimension.id ){
					continue;
				}
				else{
					//print(`${DistanceVector3in2dim( world.getDynamicProperty(`${Team}_slot${i}`),entity.location )}`)
					if( DistanceVector3in2dim( world.getDynamicProperty(`${Team}_slot${i}`),entity.location ) < 360 ){
						player.sendMessage([
							{ translate: `script.gvcv5:cant_place_boss_flag.name`},
							{ text: `\n`},
							{ translate: `script.gvcv5:${Team}_team.name`},
							{ text: `_${world.getDynamicProperty(`${Team}_slot${i}_name`)}§r`},
							{ text: `\n§cX:${Math.floor(world.getDynamicProperty(`${Team}_slot${i}`).x)},§aY:${Math.floor(world.getDynamicProperty(`${Team}_slot${i}`).y)},§9Z:${Math.floor(world.getDynamicProperty(`${Team}_slot${i}`).z)},§eDistance:${Math.floor(DistanceVector3in2dim( world.getDynamicProperty(`${Team}_slot${i}`),entity.location ))} [blocks]`}
						]);
						return;
					}
				}
			}
		}
		const form = new ActionFormData();
		let locateName = `unnamed`
		form.title(`.debug Home Menu`);	
		for( let i = 0; i < 9; i++ ){
			form.button(`${world.getDynamicProperty(`${userFamily}_slot${i}_name`)}`,`textures/ui/phone/number${i}`);
		}
		form.show(player).then( result => {
			if ( !result.canceled ){
				if( world.getDynamicProperty(`${userFamily}_slot${result.selection}`) != undefined ){
					player.sendMessage([{ translate: `script.gvcv5:dup_flag.name`}])
					return;
				}
				const form = new ModalFormData();
				const PreName = `${world.getDynamicProperty(`${userFamily}_slot${result.selection}_name`)}`;
				form.title(`script.gvcv5.phone_set_tp_block_name.name`);
				form.textField(`script.gvcv5.phone_set_tp_block_name.name`,`${PreName}`, {defaultValue: `${PreName}`});
				form.show(player).then( r => {
					if (!r.canceled) {
						const bossFlag = world.getDimension(entity.dimension.id).spawnEntity(`gvcv5:flag_${userFamily}_main_base`,entity.location);
						locateName = r.formValues[0]
						bossFlag.nameTag = `${locateName}`;
						bossFlag.setDynamicProperty(`TPBlockSlot`,result.selection);
						world.setDynamicProperty(`${userFamily}_slot${result.selection}`,entity.location);
						world.setDynamicProperty(`${userFamily}_slot${result.selection}_flag`,true);
						world.setDynamicProperty(`${userFamily}_slot${result.selection}_dimension`,entity.dimension.id);
						world.setDynamicProperty(`${userFamily}_slot${result.selection}_name`,locateName);
						player.runCommand(`clear @s zex:bossflag 0 1`);

						entity.remove();
						//Set team main base flag if flag lost, Tp block will be lost.
						//you cant set same number of flag because of this, but you can set same flag in different team.
					}
				},)
			}
		},)

	}
	else if( e.itemStack.typeId == `zex:phone_${userFamily}` && entity.typeId == `gvcv5:flag_${userFamily}_main_base` && world.getDynamicProperty("gvcv5:isBossFlag") ){
		const form = new ActionFormData();
		form.title(`script.gvcv5:boss_flag.name`);
		form.button(`script.gvcv5:boss_name.name`);
		form.button(`script.gvcv5:boss_kill.name`);
		form.button(`script.gvcv5:boss_end.name`);
		form.show( player ).then( r => {
			if( r.selection == 0 ){
				const form = new ModalFormData();
				const bossId = entity.getDynamicProperty(`TPBlockSlot`);
				const PreName = `${world.getDynamicProperty(`${userFamily}_slot${bossId}_name`)}`;
				form.title(`script.gvcv5.boss_name.name`);
				form.textField(`script.gvcv5.phone_set_tp_block_name.name`,`${PreName}`, {defaultValue: `${PreName}`});
				form.show(player).then( r => {
					if (!r.canceled) {
						let locateName = `unnamed`
						locateName = r.formValues[0]
						entity.nameTag = `${locateName}`;
						world.setDynamicProperty(`${userFamily}_slot${bossId}_name`,locateName);
						//Set team main base flag if flag lost, Tp block will be lost.
						//you cant set same number of flag because of this, but you can set same flag in different team.
					}
				},)
			}
			if( r.selection == 1 ){
				const form = new ActionFormData();
				form.title(`script.gvcv5.boss_kill.name`);
				form.body(`script.gvcv5.boss_kill_body.name`)
				form.button(`script.gvcv5.phone_accept.name`);
				form.button(`script.gvcv5.phone_back.name`);
				form.show(player).then( r => {
					if (!r.canceled) {
						if( r.selection == 0 ){
							entity.kill();
						}
					}
				},)
			}
		} )
	}
} )

//Frequently used events
world.beforeEvents.entityHurt.subscribe( e => {
	let attacker = e.damageSource.damagingEntity;
	const victim = e.hurtEntity;
	let isDown = false
	//print(`dmg:${e.damage}vshealth:${victim.getComponent(EntityComponentTypes.Health).currentValue}`);
	//down
	if( victim.typeId == "minecraft:player" ){
		if( attacker != undefined ){
			try{
				if( attacker.getComponent(EntityComponentTypes.Projectile).owner != undefined ){
					attacker = e.damageSource.damagingEntity.getComponent(EntityComponentTypes.Projectile).owner
				}
			}
			catch{}
			if( victim.hasTag(`down`) && attacker.typeId != "minecraft:player" ){
				e.cancel = true;
				return;
			}

			else if( getTeam(attacker) == `noteam` ){
				e.cancel = true;
				return;
			}
			// Cancel damage if the attacker and victim are on the same team
			else if( getTeam(attacker) == getTeam(victim) ){
				e.cancel = true;
				return;
			}
		}
		//add scoreboard for team kill
		if( !victim.hasTag(`down`) ){
			//if the victim's health is greater than the damage dealt, it means the victim is not downed yet
			//down
			if( !victim.hasTag(`nodownable`) && victim.getComponent(EntityComponentTypes.Health).currentValue < 0 ){
				e.cancel = true;
				isDown = true
				system.runTimeout( () => {
					victim.addTag(`down`);
					victim.runCommand(`function down/start_down`);
					victim.addEffect(`instant_health`,20,{ amplifier:2, showParticles: false });
				})
				
			}
		}
	}
	if( victim.typeId == "minecraft:player" && attacker != undefined ){
		//print(`downedBy:${victim.getDynamicProperty(`downedBy`)}`)
		//print(`dmg:${e.damage}`)
		//print(attacker.getComponent(EntityComponentTypes.TypeFamily).getTypeFamilies())
		//print(`isDown = ${isDown}, attacker = ${getTeam(attacker)}`);
		// Cancel damage if the attacker is on the same team as the victim or if the attacker has no team
		if( ( isDown || victim.hasTag(`down`)) && getTeam(attacker) != `noteam` && victim.getDynamicProperty(`downedBy`) == undefined  ){
			system.runTimeout( () => {
				if( attacker.typeId == "minecraft:player" ){
					victim.setDynamicProperty(`killer`,attacker.name);
					world.sendMessage([
						{text: `${victim.nameTag}`},
						{ translate: `script.gvcv5.downed_by.name`},
						{text: `${attacker.nameTag}`},
						{ translate: `script.gvcv5.downed_by2.name`}
					]);
				}
				//print(`downedBy:${getTeam(attacker).replace(`team`,``)}`)
				victim.setDynamicProperty(`downedBy`,`${getTeam(attacker).replace(`team`,``)}`);
			})
		}
	}
} )

world.afterEvents.entityDie.subscribe( e => {
	const player = e.deadEntity;
	if( player.typeId == "minecraft:player" && player.hasTag(`down`) ){
		player.runCommand(`function down/end_down`);
		player.setDynamicProperty(`killer`,undefined);
		//player.setDynamicProperty(`downedBy`,undefined);
	}
	else if( player.typeId.includes(`_main_base`) ){
		const team = getTeam(player).replace(`team`,``);
		const N = player.getDynamicProperty(`TPBlockSlot`);
		world.setDynamicProperty(`${team}_slot${N}`,undefined);
		world.setDynamicProperty(`${team}_slot${N}_flag`,false);
		world.setDynamicProperty(`${team}_slot${N}_dimension`,undefined);
		world.sendMessage([{ translate: `script.gvcv5:${team}_team.name` },{ text: `_${world.getDynamicProperty(`${team}_slot${N}_name`)}` },{ translate: `script.gvcv5.flag_destroyed.name` }]);
		world.setDynamicProperty(`${team}_slot${N}_name`,undefined);
		if( player.getDynamicProperty(`TPBlockSlot`) != undefined
			&& ( !world.getDynamicProperty(`gvcv5:flagAttackStart`) || 
			(world.getDynamicProperty(`gvcv5:flagDefender`) == team && world.getDynamicProperty(`gvcv5:flagAttackFlag`) == player.getDynamicProperty(`TPBlockSlot`))  )
		){
			player.runCommand(`scriptevent gvcv5:win`);
		}
	}
})


world.afterEvents.playerSpawn.subscribe( e => {
	const p = e.player;

	for( const team of Teams ){
		const teamJail = world.getDynamicProperty(`${team}Jail`);
		if( teamJail != undefined && world.getDynamicProperty(`teamJail`) && p.getDynamicProperty(`downedBy`) == team || p.hasTag(`${team}Sub`) ){
			p.teleport(teamJail);
			if( p.getDynamicProperty(`downedBy`) == team ){
				world.scoreboard.getObjective("DeathTime").setScore(p,24000);
				p.addTag(`${team}Sub`);
				p.addTag(`onDeath`);
				p.runCommand(`give @s rotten_flesh 4`);
				p.setDynamicProperty(`downedBy`,undefined);
			}
		}
		if( p.getDynamicProperty(`downedBy`) == team ){
			p.setDynamicProperty(`downedBy`,undefined);
		}
		p.removeTag(`downedby${team}`);
	}
	p.runCommand(`inputpermission set @s movement enabled`);
} )


system.afterEvents.scriptEventReceive.subscribe( e => {
	if( e.id === "gvcv5:TeamList" ){
		let itemRawText = []
		for( const Ally of world.getPlayers({ families: [ "red" ] }) ){
			itemRawText.push({ text: `§c${Ally.nameTag}§r\n` });
		}
		for( const Ally of world.getPlayers({ families: [ "blue" ] }) ){
			itemRawText.push({ text: `§9${Ally.nameTag}§r\n` });
		}
		for( const Ally of world.getPlayers({ families: [ "green" ] }) ){
			itemRawText.push({ text: `§a${Ally.nameTag}§r\n` });
		}
		for( const Ally of world.getPlayers({ families: [ "yellow" ] }) ){
			itemRawText.push({ text: `§e${Ally.nameTag}§r\n` });
		}
		for( const Ally of world.getPlayers({ families: [ "noteam" ] }) ){
			itemRawText.push({ text: `${Ally.nameTag}\n` });
		}
		world.sendMessage({ rawtext: itemRawText});
	}
	else if( e.id == "gvcv5:BattleNotice" ){
		const M = e.message;
		const attacker = world.getDynamicProperty(`gvcv5:flagAttacker`);
		const defender = world.getDynamicProperty(`gvcv5:flagDefender`);
		const dimension = world.getDynamicProperty(`gvcv5:flagDimension`);
		const attackFlag = world.getDynamicProperty(`gvcv5:flagAttackFlag`);
		world.sendMessage([{ translate: `script.gvcv5:${defender}_team.name` },{ text: `_${world.getDynamicProperty(`${defender}_slot${attackFlag}_name`)}` },{ translate: `script.gvcv5.flagAttackFlagNow.name` },{ text: M }]);
	}
	else if( e.id == `zex:spawnpoint` ){
		const player = e.sourceEntity;
		const location = player.getSpawnPoint();
		const O = world.getDefaultSpawnLocation();
		player.removeTag(`redSub`);
		player.removeTag(`blueSub`);
		player.removeTag(`greenSub`);
		player.removeTag(`yellowSub`);
		if( player.getSpawnPoint() != undefined  ){
			player.teleport({ x:location.x,y:location.y,z:location.z },{ dimension:location.dimension } );
		}
		else if (player.hasTag(`red`) && world.getDynamicProperty(`redSpawn`) != undefined ){
			player.teleport(world.getDynamicProperty(`redSpawn`),{ dimension:world.getDimension(`overworld`) } );
		}
		else if (player.hasTag(`blue`) && world.getDynamicProperty(`blueSpawn`) != undefined ){
			player.teleport(world.getDynamicProperty(`blueSpawn`),{ dimension:world.getDimension(`overworld`) } );
		}
		else if (player.hasTag(`green`) && world.getDynamicProperty(`greenSpawn`) != undefined ){
			player.teleport(world.getDynamicProperty(`greenSpawn`),{ dimension:world.getDimension(`overworld`) } );
		}
		else if (player.hasTag(`yellow`) && world.getDynamicProperty(`yellowSpawn`) != undefined ){
			player.teleport(world.getDynamicProperty(`yellowSpawn`),{ dimension:world.getDimension(`overworld`) } );
		}
		else{
			player.teleport( {x:O.x,y:320,z:O.z} ,{ dimension:world.getDimension(`overworld`) } );
			player.addEffect(`resistance`,600,{ amplifier:255 } );
		}
	}
	else if( e.id === `zex:jailpoint` ){
		const block = e.sourceBlock;
		const dimension = block.dimension;
		const location = block.location;
		const team = e.message;
		world.setDynamicProperty(`${team}Jail`,location);
		dimension.setBlockType(location, "minecraft:air");
	}
	else if( e.id === `zex:execution` ){
		const user = e.sourceEntity;
		const location = user.location;
		const userFamily = e.message;
		const form = new ActionFormData();
		form.title(`script.gvcv5.execution.name`);
		const targets = world.getPlayers({tags: [`${userFamily}Sub`]});
		for( const target of targets ){
			form.button(`${target.nameTag}`);
		}
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( result => {
			if ( !result.canceled && result.selection < targets.length ){
				targets[result.selection].teleport(location);
				targets[result.selection].runCommand(`inputpermission set @s movement disabled`);
			}
		})
	}
	else if( e.id === `zex:jail` ){
		const user = e.sourceEntity;
		const location = user.location;
		const userFamily = e.message;
		const form = new ActionFormData();
		form.title(`script.gvcv5.jail.name`);
		const targets = world.getPlayers({tags: [`${userFamily}Sub`]});
		for( const target of targets ){
			form.button(`${target.nameTag}`);
		}
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( result => {
			if ( !result.canceled && result.selection < targets.length ){
				targets[result.selection].teleport(location);
				targets[result.selection].addEffect("slowness", 100,{ amplifier: 10 });
			}
		})
	}
	else if( e.id == "gvcv5:lose" ){
		world.scoreboard.getObjective(`ALLFlags`).setScore(`Battle`,-999);
		const attacker = world.getDynamicProperty(`gvcv5:flagAttacker`);
		const defender = world.getDynamicProperty(`gvcv5:flagDefender`);
		const dimension = world.getDynamicProperty(`gvcv5:flagDimension`);
		const attackFlag = world.getDynamicProperty(`gvcv5:flagAttackFlag`);
		// if( defender == `SOV` ){
		// 	world.scoreboard.getObjective(`ALLFlags`).addScore(`§cSoviet`,10*dateScore());
		// }
		// else if( defender == `GER` ){
		// 	world.scoreboard.getObjective(`ALLFlags`).addScore(`§8Germany`,10*dateScore());
		// }
		// else if( defender == `USA` ){
		// 	world.scoreboard.getObjective(`ALLFlags`).addScore(`§9America`,10*dateScore());
		// }
		// else if( defender == `JAP` ){
		// 	world.scoreboard.getObjective(`ALLFlags`).addScore(`§aJapan`,10*dateScore());
		// }
		// else if( defender == `ENG` ){
		// 	world.scoreboard.getObjective(`ALLFlags`).addScore(`§eBritain`,10*dateScore());
		// }
		world.setDynamicProperty(`gvcv5:flagAttackStart`,false);
		world.setDynamicProperty(`gvcv5:${attacker}_attackCool`,world.getAbsoluteTime());
		world.setDynamicProperty(`gvcv5:flagAttacker`,undefined);
		world.setDynamicProperty(`gvcv5:flagDefender`,undefined);
		world.setDynamicProperty(`gvcv5:flagDimension`,undefined);
		world.setDynamicProperty(`gvcv5:flagAttackFlag`,undefined);
		// const targetFlag = world.getDimension(dimension).getEntities( { type:`gvcv5:flag_${defender}_${attackFlag}` } )[0];
		// targetFlag.removeTag(`nowattack`);
		world.sendMessage([{ translate: `script.gvcv5:${defender}_team.name` },{ translate: `script.gvcv5.defenced.name` },{ translate: `script.gvcv5:${attacker}_team.name` },{ translate: `script.gvcv5.defenced2.name` }]);
	}
	else if( e.id == "gvcv5:win" ){
			world.scoreboard.getObjective(`ALLFlags`).setScore(`Battle`,-999);
			const attacker = world.getDynamicProperty(`gvcv5:flagAttacker`);
			const defender = world.getDynamicProperty(`gvcv5:flagDefender`);
			// if( attacker == `SOV` ){
			// 	world.scoreboard.getObjective(`ALLFlags`).addScore(`§cSoviet`,10*dateScore());
			// }
			// else if( attacker == `GER` ){
			// 	world.scoreboard.getObjective(`ALLFlags`).addScore(`§8Germany`,10*dateScore());
			// }
			// else if( attacker == `USA` ){
			// 	world.scoreboard.getObjective(`ALLFlags`).addScore(`§9America`,10*dateScore());
			// }
			// else if( attacker == `JAP` ){
			// 	world.scoreboard.getObjective(`ALLFlags`).addScore(`§aJapan`,10*dateScore());
			// }
			// else if( attacker == `ENG` ){
			// 	world.scoreboard.getObjective(`ALLFlags`).addScore(`§eBritain`,10*dateScore());
			// }
			world.setDynamicProperty(`gvcv5:flagAttacker`,undefined);
			world.setDynamicProperty(`gvcv5:flagDefender`,undefined);
			world.setDynamicProperty(`gvcv5:flagDimension`,undefined);
			world.setDynamicProperty(`gvcv5:flagAttackFlag`,undefined);
			world.setDynamicProperty(`gvcv5:${attacker}_attackCool`,0);
			world.setDynamicProperty(`gvcv5:flagAttackStart`,false);
			world.sendMessage([{ translate: `script.gvcv5:${attacker}_team.name` },{ translate: `script.gvcv5.defenced.name` },{ translate: `script.gvcv5:${defender}_team.name` },{ translate: `script.gvcv5.occupied.name` }]);
	}
	else if( e.id == "zex:transferTeam" ){
		const user = e.sourceEntity;
		const from = e.message.split(" ")[0];
		const to = e.message.split(" ")[1];
		if( world.getDynamicProperty(`${from}Leader`) == user.nameTag ){
			gvcv5RemoveTeam(from);
		}
		else{
			gvcv5RemoveTeamList(user,from);
			user.removeTag(`${from}Leader`);
			world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.phone_left_${from}.name`}]);
		}
		gvcv5AddTeamList(user,to);

	}
	else if( e.id == "gvcv5:phone_noteam" && !e.sourceEntity.hasTag(`down`) ){
		const user = e.sourceEntity;
		const team = e.message;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const form = new ActionFormData();
		form.title(`.debug Home Menu`);
		form.button(`script.gvcv5.howToGun.name`,`textures/ui/phone/ak47`);
		form.button(`script.gvcv5.howToVechile.name`,`textures/ui/phone/t34`);
		form.button(`script.gvcv5.howToAir.name`,`textures/ui/phone/f16`);
		form.button(`script.gvcv5.howToHeli.name`,`textures/ui/phone/ah6`);
		form.button(`script.gvcv5.howToShip.name`,`textures/ui/phone/cruiser`);
		form.button(`script.gvcv5.phone_howToTeam.name`,`textures/ui/phone/missing_item`);
		form.button(`script.gvcv5.phone_teamList.name`,`textures/ui/phone/icon_multiplayer`);
		form.button(`script.gvcv5.phone_progress.name`,`textures/ui/phone/icon_map`);
		form.button(`script.gvcv5.phone_noteam_setting.name`,`textures/ui/phone/settings_glyph_color_2x`);
		if( team == `noteam` ){
			form.button(`script.gvcv5.select_team.name`,`textures/ui/phone/team`);
		}
		form.show(user).then( r => {
			if (!r.canceled) {
				// Gun
				if( r.selection == 0 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howToGun.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc0.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc1.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc2.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc3.name` });
					itemRawText.push({ text: `\n\n` });
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
						}
					} )
				}
				// Vechile
				else if( r.selection == 1 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howToVechile.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc0.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc1.name` });
					itemRawText.push({ text: `\n\n` });
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
						}
					} )
				}
				// Air
				else if( r.selection == 2 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howToAir.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howToAirDesc0.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToAirDesc1.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToAirDesc2.name` });
					itemRawText.push({ text: `\n\n` });
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
						}
					} )
				}
				// Heli
				else if( r.selection == 3 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howToHeli.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howToHeliDesc0.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToHeliDesc1.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToHeliDesc2.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToHeliDesc3.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToHeliDesc4.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToHeliDesc5.name` });
					itemRawText.push({ text: `\n\n` });
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
						}
					} )
				}
				// Ship
				else if( r.selection == 4 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howToShip.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howToShipDesc0.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToShipDesc1.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToShipDesc2.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToShipDesc3.name` });
					itemRawText.push({ text: `\n\n` });
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
						}
					} )
				}
				// Team
				else if( r.selection == 5 ){
					user.runCommand(`scriptevent gvcv5:phone_howToTeam ${team}`);
				}
				// Team List
				else if( r.selection == 6 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.phone_teamList.name`);
					let itemRawText = []
					for( const Ally of world.getPlayers({ families: [ "red" ] }) ){
						itemRawText.push({ text: `§c${Ally.nameTag}§r\n` });
					}
					for( const Ally of world.getPlayers({ families: [ "blue" ] }) ){
						itemRawText.push({ text: `§9${Ally.nameTag}§r\n` });
					}
					for( const Ally of world.getPlayers({ families: [ "green" ] }) ){
						itemRawText.push({ text: `§a${Ally.nameTag}§r\n` });
					}
					for( const Ally of world.getPlayers({ families: [ "yellow" ] }) ){
						itemRawText.push({ text: `§e${Ally.nameTag}§r\n` });
					}
					for( const Ally of world.getPlayers({ families: [ "noteam" ] }) ){
						itemRawText.push({ text: `${Ally.nameTag}\n` });
					}
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
						}
					} )
				}
				// Progress
				else if( r.selection == 7 ){
					user.runCommand(`scriptevent gvcv5:phone_progress ${team}`);
				}
				// Settings
				else if( r.selection == 8 ){
					const form = new ModalFormData();
					const user = e.sourceEntity;
					form.title(`script.gvcv5.phone_noteam_setting.name`);
					form.toggle(`script.gvcv5.phone_noteam_setting_is_down.name`, {defaultValue: ( !user.hasTag(`nodownable`) )});
					form.toggle(`script.gvcv5.phone_noteam_setting_do_print_damage.name`, {defaultValue: ( !user.hasTag(`no_print`) )});
					form.toggle(`script.gvcv5.phone_noteam_setting_do_autoreload.name`, {defaultValue: ( user.hasTag(`autoReload`) )});
					form.toggle(`script.gvcv5.phone_noteam_setting_spawn_with_phone.name`, {defaultValue: ( user.hasTag(`withphone`) )});
					form.show(e.sourceEntity).then( result => {
						if ( !result.canceled ){
							if( user.hasTag(`nodownable`) && Boolean(result.formValues[0]) == true ){
								user.removeTag(`nodownable`);
								user.sendMessage({ rawtext: [{ translate: `script.gvcv5.phone_noteam_setting_now_down.name` }]});
							}
							if( !user.hasTag(`nodownable`) && Boolean(result.formValues[0]) == false ){
								user.addTag(`nodownable`);
								user.sendMessage({ rawtext: [{ translate: `script.gvcv5.phone_noteam_setting_dont_down.name` }]});
							}
							if( user.hasTag(`no_print`) && Boolean(result.formValues[1]) == true ){
								user.removeTag(`no_print`);
								user.sendMessage({ rawtext: [{ translate: `script.gvcv5.phone_noteam_setting_now_print.name` }]});
							}
							if( !user.hasTag(`no_print`) && Boolean(result.formValues[1]) == false ){
								user.addTag(`no_print`);
								user.sendMessage({ rawtext: [{ translate: `script.gvcv5.phone_noteam_setting_dont_print.name` }]});
							}
							if( !user.hasTag(`autoReload`) && Boolean(result.formValues[2]) == true ){
								user.addTag(`autoReload`);
								user.sendMessage({ rawtext: [{ translate: `script.gvcv5.phone_noteam_setting_now_autoreload.name` }]});
							}
							if( user.hasTag(`autoReload`) && Boolean(result.formValues[2]) == false ){
								user.removeTag(`autoReload`);
								user.sendMessage({ rawtext: [{ translate: `script.gvcv5.phone_noteam_setting_dont_autoreload.name` }]});
							}
							if( !user.hasTag(`withphone`) && Boolean(result.formValues[3]) == true ){
								user.addTag(`withphone`);
								user.sendMessage({ rawtext: [{ translate: `script.gvcv5.phone_noteam_setting_now_withphone.name` }]});
							}
							if( user.hasTag(`withphone`) && Boolean(result.formValues[3]) == false ){
								user.removeTag(`withphone`);
								user.sendMessage({ rawtext: [{ translate: `script.gvcv5.phone_noteam_setting_dont_withphone.name` }]});
							}
						}
					} )
				}
				// Select Team
				else if( r.selection == 9 ){
					user.runCommand(`scriptevent gvcv5:phone_noteam_selectteam`);
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_howToTeam" && !e.sourceEntity.hasTag(`down`) ){
		const user = e.sourceEntity;
		const team = e.message;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const form = new ActionFormData();
		form.title(`script.gvcv5.phone_howToTeam.name`);
		form.body(`script.gvcv5.phone_howToTeamDesc.name`);
		form.button(`script.gvcv5.phone_howToTeam1.name`);
		form.button(`script.gvcv5.phone_howToTeam2.name`);
		form.button(`script.gvcv5.phone_howTo_team.name`);
		form.button(`script.gvcv5.phone_howToTeam4.name`);
		form.button(`script.gvcv5.phone_howToTeam5.name`);
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( r => {
			if (!r.canceled) {
				if( r.selection == 0 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.phone_howToTeam1.name`);
					form.body(`script.gvcv5.phone_howToTeam1Desc.name`);
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_howToTeam ${team}`);
						}
					} )
				}
				else if( r.selection == 1 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.phone_howToTeam2.name`);
					form.body(`script.gvcv5.phone_howToTeam2Desc.name`);
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_howToTeam ${team}`);
						}
					} )
				}
				else if( r.selection == 2 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.phone_howTo_team.name`);
					form.body(`script.gvcv5.phone_howToTeam3Desc.name`);
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_howToTeam ${team}`);
						}
					} )
				}
				else if( r.selection == 3 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.phone_howToTeam4.name`);
					form.body(`script.gvcv5.phone_howToTeam4Desc.name`);
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_howToTeam ${team}`);
						}
					} )
				}
				else if( r.selection == 4 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.phone_howToTeam5.name`);
					form.body(`script.gvcv5.phone_howToTeam5Desc.name`);
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_howToTeam ${team}`);
						}
					} )
				}
				else if( r.selection == 5 ){
					user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_progress" && !e.sourceEntity.hasTag(`down`) ){
		const user = e.sourceEntity;
		const team = e.message;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const form = new ActionFormData();
		form.title(`script.gvcv5.phone_progress.name`);
		form.body({ rawtext: [{ translate:`script.gvcv5.phone_progress_c.name` },{ text:` ${world.getDynamicProperty(`gvcv5:progress`)}`}]});
		for( let i = 0; i < 6; i++ ){
			let buttontext = [];
			buttontext.push( { translate: `script.gvcv5.phone_progress_${i}.name` } )
			if( world.getDynamicProperty(`gvcv5:progress`) > i ){
				buttontext.push( { text:`\n§aCLEARED` } );
			}
			form.button({ rawtext:buttontext });
		}
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( r => {
			if (!r.canceled) {
				if( r.selection == 6 ){
					user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
				}
				else{
					const form2 = new ActionFormData();
					form2.title(`script.gvcv5.phone_progress_${r.selection}.name`);
					let bodyText = [];
					bodyText.push( { translate: `script.gvcv5.phone_progress_${r.selection}_main.name` } )
					bodyText.push( { text:`\n\n\n` } );
					bodyText.push( { translate: `script.gvcv5.phone_progress_${r.selection}_sub.name` } )
					form2.body({ rawtext:bodyText });
					form2.button(`script.gvcv5.phone_back.name`);
					form2.show(user).then( r2 => {
						if (!r.canceled) {
							user.runCommand(`scriptevent gvcv5:phone_progress ${team}`);
						}
					})
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_noteam_selectteam" && !e.sourceEntity.hasTag(`down`) ){
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const form = new ActionFormData();
		let alreadyTeam = false
		form.title(`script.gvcv5.select_team.name`);
		form.body(`script.gvcv5.select_team_body.name`);
		form.button({ rawtext: [ { translate: `script.gvcv5.become_red.name` },{ text : `\nleader:${world.getDynamicProperty(`redLeader`)}`} ]});
		form.button({ rawtext: [ { translate: `script.gvcv5.become_blue.name` },{ text : `\nleader:${world.getDynamicProperty(`blueLeader`)}`} ]});
		form.button({ rawtext: [ { translate: `script.gvcv5.become_green.name` },{ text : `\nleader:${world.getDynamicProperty(`greenLeader`)}`} ]});
		form.button({ rawtext: [ { translate: `script.gvcv5.become_yellow.name` },{ text : `\nleader:${world.getDynamicProperty(`yellowLeader`)}`} ]});
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( r => {
			if (!r.canceled) {								
				if( r.selection == 0 ){
					gvcv5becomeTeam(user,"red")
				}
				else if( r.selection == 1 ){
					gvcv5becomeTeam(user,"blue")
				}
				else if( r.selection == 2 ){
					gvcv5becomeTeam(user,"green")
				}
				else if( r.selection == 3 ){
					gvcv5becomeTeam(user,"yellow")
				}
				else if( r.selection == 4 ){
					user.runCommand(`scriptevent gvcv5:phone_noteam`);
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_locked" && !e.sourceEntity.hasTag(`down`)  ){
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const userFamily = e.message;
		if( phone.getDynamicProperty("password") != undefined ){
			const form = new ModalFormData();
			form.title(`script.gvcv5.input_password.name`);
			form.textField(`script.gvcv5.input_password.name`,``);
			form.show(user).then( r => {
				if (!r.canceled) {
					if( phone.getDynamicProperty("password") == r.formValues[0] ){
						user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
					}
					else{
						//user.sendMessage({ translate: `script.gvcv5.invaid_password.name`});
						user.sendMessage({ text: `${phone.getDynamicProperty("password")}`});
						user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
					}
				}
			},)
		}
		else{
			user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
		}
	}
	else if( e.id == "gvcv5:phone_tp_block" && !e.sourceEntity.hasTag(`down`)  ){
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const userFamily = e.message;
		const form = new ActionFormData();
		form.title(`.debug Home Menu`);
		for( let i = 0; i < 9; i++ ){
			form.button(`${phone.getDynamicProperty(`slot${i}_name`)}`,`textures/ui/phone/number${i}`);
		}
		form.button(`script.gvcv5.phone_back.name`,`textures/ui/phone/crossout`);
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == 9 ){
					user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
				}
				else if( phone.getDynamicProperty(`slot${result.selection}`) != undefined ){
					let location = phone.getDynamicProperty(`slot${result.selection}`);
					let dimension = world.getDimension(phone.getDynamicProperty(`slot${result.selection}_dimension`));
					user.teleport(location,{ dimension:dimension });
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_tp_teamblock" && !e.sourceEntity.hasTag(`down`)  ){
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const userFamily = e.message;
		const form = new ActionFormData();
		form.title(`.debug Home Menu`);
		for( let i = 0; i < 9; i++ ){
			form.button(`${world.getDynamicProperty(`${userFamily}_slot${i}_name`)}`,`textures/ui/phone/number${i}`);
		}
		form.button(`script.gvcv5.phone_back.name`,`textures/ui/phone/crossout`);
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == 9 ){
					user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
				}
				else if( world.getDynamicProperty(`${userFamily}_slot${result.selection}`) != undefined ){
					let location = world.getDynamicProperty(`${userFamily}_slot${result.selection}`);
					let dimension = world.getDimension(world.getDynamicProperty(`${userFamily}_slot${result.selection}_dimension`));
					user.teleport(location,{ dimension:dimension });
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_set_tp_block" && !e.sourceEntity.hasTag(`down`)  ){
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const userFamily = e.message;
		const form = new ActionFormData();
		let locateName = `unnamed`
		form.title(`.debug Home Menu`);	
		for( let i = 0; i < 9; i++ ){
			form.button(`${phone.getDynamicProperty(`slot${i}_name`)}`,`textures/ui/phone/number${i}`);
		}
		form.show(user).then( result => {
			if ( !result.canceled ){
				const form = new ModalFormData()
				const PreName = `${phone.getDynamicProperty(`slot${result.selection}_name`)}`
				form.title(`script.gvcv5.phone_set_tp_block_name.name`)
				form.textField(`script.gvcv5.phone_set_tp_block_name.name`,`${PreName}`, {defaultValue: `${PreName}`});
				form.show(user).then( r => {
					if (!r.canceled) {
						locateName = r.formValues[0]
						phone.setDynamicProperty(`slot${result.selection}`,user.location);
						phone.setDynamicProperty(`slot${result.selection}_dimension`,user.dimension.id);
						phone.setDynamicProperty(`slot${result.selection}_name`,locateName);
					}
				},)
			}
		},)
	}
	else if( e.id == "gvcv5:phone_tp_block_attack" && !e.sourceEntity.hasTag(`down`)  ){
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const userFamily = e.message;
		const form = new ActionFormData();
		let attack = [];
		form.title(`script.gvcv5.phone_tp_block.name`);
		for( const Team of Teams ){
			if( Team == userFamily ){ continue; }
			else{
				for( let i = 0; i < 9; i++ ){
					if( world.getDynamicProperty(`${Team}_slot${i}`) != undefined ){
						attack.push({ team: Team, slot: i, name: world.getDynamicProperty(`${Team}_slot${i}_name`) });
						const buttonText = { 
							rawtext: [ 
								{ translate: `script.gvcv5:${Team}_team.name` }, 
								{ text: `_${world.getDynamicProperty(`${Team}_slot${i}_name`)}` },
								{ text: `§r\n` }, 
								//Location and dimension info for debugging, can be removed later
								{ text: 
									`X:${Math.floor(world.getDynamicProperty(`${Team}_slot${i}`).x)},Y:${Math.floor(world.getDynamicProperty(`${Team}_slot${i}`).y)},Z:${Math.floor(world.getDynamicProperty(`${Team}_slot${i}`).z)},Dim:${world.getDynamicProperty(`${Team}_slot${i}_dimension`).replace(`minecraft:`,``)}` 
								},
							]
						};
						form.button(buttonText);
					}
				}
			}
		}
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == attack.length ){
					user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
				}
				else if( attack[result.selection] != undefined ){
					const attackFlag = attack[result.selection].slot;
					const attacker = userFamily;
					const defender = attack[result.selection].team;
					//const Escore = world.scoreboard.getObjective(`ALLFlags`).getScore(trueTeamName(defender));
					
					// Handle attack logic here
					print(`${world.getPlayers({ families: [ `${defender}team` ] }).length}`);
					if( world.getAbsoluteTime() - world.getDynamicProperty(`gvcv5:${userFamily}_attackCool`) < CoolTime ) {
						user.sendMessage(`§cYou are in cooldown! §7(${CoolTime - (world.getAbsoluteTime() - world.getDynamicProperty(`gvcv5:${userFamily}_attackCool`))} ticks left)`);
					}
					else if( world.getDynamicProperty(`gvcv5:flagAttackFlag`) != undefined ){
						user.sendMessage(`§cThere is already an attack in progress!`);
					}
					else if( world.getPlayers({ families: [ `${defender}team` ] }).length <= 0 ){
						user.sendMessage(`§cYou cannot attack a team with 1 or less members!`);
					}
					else{
						startAttack(user, attacker, defender, attackFlag);
					}
					
					// else if( Escore > 0 && attackFlag.includes(`mainbase`) ){
					// 	user.sendMessage(`§cYou cannot attack the main base!`);
					// }
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_teamChat" ){
		const userFamily = e.message;
		const user = e.sourceEntity;
		const form = new ActionFormData();
		let text = world.getDynamicProperty(`${userFamily}chat`);
		form.title(`script.gvcv5.phone_teamChat.name`);
		form.button(`script.gvcv5.phone_sendmessage.name`);
		form.button(`script.gvcv5.phone_back.name`);
		if( user.name == world.getDynamicProperty(`${userFamily}Leader`) || user.hasTag(`${userFamily}Leader`)  ){
			form.button(`script.gvcv5.phone_delete_chat.name`);
		}
		form.body(`${text}`);
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == 0 ){
					const form = new ModalFormData()
					form.title(`script.gvcv5.phone_sendmessage.name`)
					form.textField(`script.gvcv5.input_message.name`,``);
					form.show(user).then( r => {
						if (!r.canceled) {
							text += `[${user.nameTag}]:${r.formValues[0]} ${gvcv5GetTime()}\n`;
							const newText = `[${user.nameTag}]:${r.formValues[0]} ${gvcv5GetTime()}\n`;
							world.setDynamicProperty(`${userFamily}chat`,text);
							for( const myAlly of world.getAllPlayers() ){
								for(let i = 0; i < 36; i++){
									let Haditem = myAlly.getComponent("inventory").container.getItem(i);
									if( Haditem != undefined && Haditem.typeId === `zex:phone_${userFamily}` ){
										myAlly.sendMessage({ rawtext: [{ translate: `script.gvcv5.newMessage_${userFamily}.name` },{ text: `${newText}` }] });
										break;
									}
								}
							}
							
							user.runCommand(`scriptevent gvcv5:phone_teamChat ${userFamily}`);
						}
					},)
				}
				if( result.selection == 1 ){
					user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
				}
				if( result.selection == 2 ){
					world.setDynamicProperty(`${userFamily}chat`,``)
				}
			}
		} )
	}
	else if( e.id == "gvcv5:phone_unlocked" ){
		const userFamily = e.message;
		const user = e.sourceEntity;
		if( !user.hasTag(`${userFamily}`) ){
			let itemRawText = []
			const userLocationStr = `X:${Math.floor(user.location.x)} Y:${Math.floor(user.location.y)} Z:${Math.floor(user.location.z)}`
			itemRawText.push({ translate: `script.gvcv5.newMessage_${userFamily}.name` });
			itemRawText.push({ translate: `script.gvcv5.phoneAbuse0.name` }); //warning
			itemRawText.push({ text: `${userLocationStr}` });
			itemRawText.push({ translate: `script.gvcv5.phoneAbuse1.name` }); //at
			itemRawText.push({ text: `${user.nameTag}` });
			itemRawText.push({ translate: `script.gvcv5.phoneAbuse2.name` }); //enemy using phone by
			for( const myAlly of world.getPlayers({ families: [ userFamily ] }) ){
				myAlly.sendMessage({ rawtext: itemRawText });
				world.setDynamicProperty(`${userFamily}chat`,`${world.getDynamicProperty(`${userFamily}chat`)}\n[System]:${user.nameTag} using phone at ${userLocationStr} in ${gvcv5GetTime()}`);
			}
		}
		if( world.scoreboard.getObjective("DeathTime").getScore(user) > 0 ){
			let itemRawText = []
			let jail = `noteam`
			if( user.hasTag(`redSub`) ){ jail = `red`; }
			else if( user.hasTag(`blueSub`) ){ jail = `blue`; }
			else if( user.hasTag(`greenSub`) ){ jail = `green`; }
			else if( user.hasTag(`yellowSub`) ){ jail = `yellow`; }
			world.scoreboard.getObjective("DeathTime").setScore(user,0);
			itemRawText.push({ translate: `script.gvcv5.newMessage_${jail}.name` });
			itemRawText.push({ translate: `script.gvcv5.phoneAbuse0.name` }); //warning
			itemRawText.push({ text: `${user.nameTag}` });
			itemRawText.push({ translate: `script.gvcv5.releasedJail0.name` }); //is released
			for( const myAlly of world.getPlayers({ families: [ jail ] }) ){
				myAlly.sendMessage({ rawtext: itemRawText });
			}
			user.sendMessage({ translate: `script.gvcv5.youreleased.name` })
		}
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		let phoneArray = [];
		const form = new ActionFormData();
		form.title(`.debug Home Menu`);
		form.button(`script.gvcv5.phone_tp.name`,`textures/ui/phone/icon_alex`);
		form.button(`script.gvcv5.phone_tp_block.name`,`textures/ui/phone/spawn_${userFamily}`);
		form.button(`script.gvcv5.phone_tp_block_team.name`,`textures/ui/phone/flag_${userFamily}`);
		form.button(`script.gvcv5.phone_teamChat.name`,`textures/ui/phone/message`);
		form.button(`script.gvcv5.phone_menber_list.name`,`textures/ui/phone/jail`);
		form.button(`script.gvcv5.phone_password.name`,`textures/ui/phone/icon_lock`);
		form.button(`script.gvcv5.phone_leave.name`,`textures/ui/phone/crossout`);
		form.button(`script.gvcv5.phone_howTo.name`,`textures/ui/phone/missing_item`);
		if( user.hasTag(`${userFamily}Leader`) ){
			form.button(`script.gvcv5.phone_attack.name`,`textures/ui/phone/attack`);
			form.button(`script.gvcv5.phone_accept_to_join.name`,`textures/ui/phone/confirm`);
			form.button(`script.gvcv5.phone_kick_member.name`,`textures/ui/phone/hammer_l`);
		}
		if( user.name == world.getDynamicProperty(`${userFamily}Leader`) ){
			form.button(`script.gvcv5.phone_transfer_leader.name`,`textures/ui/phone/permissions_op_crown`);
		}
		form.show(user).then( result => {
			if ( !result.canceled ){
			print(`${user.dimension.getPlayers({ excludeFamilies:[`noteam`,`${getTeam(user)}`],location:user.location,maxDistance:128 }).length}`)
				if( result.selection == 0 ){ // teleport to player
					if( user.dimension.getPlayers({ excludeFamilies:[`noteam`,`${getTeam(user)}`],location:user.location,maxDistance:128 }).length > 0 ){
						user.sendMessage({ rawtext:[ { translate: `script.gvcv5:no_teleport.name` } ] });
						return;
					}
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_tp.name`);
					for( const myAlly of world.getAllPlayers() ){
						if( myAlly.hasTag(`${userFamily}`) && world.scoreboard.getObjective("DeathTime").getScore(myAlly) <= 0 ){
							phoneArray.push( myAlly );
							form_tp.button(`${myAlly.nameTag}\nX:${Math.floor(myAlly.location.x)} Y:${Math.floor(myAlly.location.y)} Z:${Math.floor(myAlly.location.z)}`);
							continue;
						}
						for(let i = 0; i < 36; i++){
							let Haditem = myAlly.getComponent("inventory").container.getItem(i);
							if( Haditem != undefined && Haditem.typeId === `zex:phone_${userFamily}` ){
								phoneArray.push( myAlly );
								form_tp.button(`§4${myAlly.nameTag}\nX:${Math.floor(myAlly.location.x)} Y:${Math.floor(myAlly.location.y)} Z:${Math.floor(myAlly.location.z)}§r`);
								break;
							}
						}
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection < phoneArray.length ){
								const targetLocation = phoneArray[result.selection].location;
								const targetDimension = phoneArray[result.selection].dimension;
								user.teleport(targetLocation,{ dimension:targetDimension });
								if( !user.hasTag(`${userFamily}`) ){
									user.sendMessage({ translate: `script.gvcv5.phoneAbuse.name` }); //warning
									user.runCommand(`clear @s zex:phone_${userFamily} 0 1`);
								}
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				else if( result.selection == 1 ){ // teleport to block
					if( user.dimension.getPlayers({ excludeFamilies:[`noteam`,`${getTeam(user)}`],location:user.location,maxDistance:128 }).length > 0 ){
						user.sendMessage({ rawtext:[ { translate: `script.gvcv5:no_teleport.name` } ] });
						return;
					}
					else{
						user.runCommand(`scriptevent gvcv5:phone_tp_block ${userFamily}`);
					}
				}
				else if( result.selection == 2 ){ // teleport to Team Base
					if( user.dimension.getPlayers({ excludeFamilies:[`noteam`,`${getTeam(user)}`],location:user.location,maxDistance:128 }).length > 0 ){
						user.sendMessage({ rawtext:[ { translate: `script.gvcv5:no_teleport.name` } ] });
						return;
					}
					else{
						user.runCommand(`scriptevent gvcv5:phone_tp_teamblock ${userFamily}`);
					}
				}
				else if( result.selection == 3 ){ // team chat
					user.runCommand(`scriptevent gvcv5:phone_teamChat ${userFamily}`);
				}
				else if( result.selection == 4 ){ //menber list
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_menber_list.name`);
					for( const myAlly of world.getPlayers({ tags:[ `${userFamily}Sub` ] }) ){
						phoneArray.push( myAlly );
						form_tp.button(`${myAlly.nameTag}`);
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( r => {
						if( r.selection < phoneArray.length ){
							const form_jail = new ActionFormData();
							form_jail.title(`script.gvcv5.phone_menber_list.name`);
							form_jail.button(`script.gvcv5.phone_to_menber.name`);
							form_jail.button(`script.gvcv5.phone_from_menber.name`);
							form_jail.button(`script.gvcv5.phone_release_menber.name`);
							form_jail.show(user).then( re => {
								if( re.selection == 0 ){ user.teleport(phoneArray[r.selection].location,{ dimension : phoneArray[r.selection].dimension }); }
								else if( re.selection == 1 ){ phoneArray[r.selection].teleport(user.location,{ dimension : user.dimension }); }
								else if( re.selection == 2 ){ 
									world.scoreboard.getObjective("DeathTime").setScore(phoneArray[r.selection],0); 
									world.sendMessage([
										{text:`${phoneArray[r.selection].nameTag}`},
										{ translate:`script.gvcv5.released0.name` },
										{text:`${user.nameTag}`},
										{ translate:`script.gvcv5.released1.name` }
									])
								}
							} )
						}
						else{
							user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
						}
					} )
				}
				else if( result.selection == 5 ){ //change password
					const form = new ModalFormData()
					form.title(`script.gvcv5.phone_password.name`)
					form.textField(`script.gvcv5.input_password.name`,`${phone.getDynamicProperty("password")}`);
					form.show(user).then( r => {
						if (!r.canceled) {
							phone.setDynamicProperty("password",r.formValues[0]);
							user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
						}
					},)
				}
				else if( result.selection == 6 ){ //leave team
					const form = new ActionFormData();
					form.title(`script.gvcv5.phone_leave.name`);
					form.body(`script.gvcv5.leave_team_body.name`);
					form.button(`script.gvcv5.phone_accept.name`);
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection == 0 ){
								user.triggerEvent(`gvcv5:become_noteam`);
								user.runCommand(`clear @s zex:phone_${userFamily}`);
								gvcv5RemoveTeamList(user,userFamily);
								user.kill();
								user.removeTag(`${userFamily}Leader`);
								world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.phone_left_${userFamily}.name`}]);

								if( user.name == world.getDynamicProperty(`${userFamily}Leader`) ){
									gvcv5RemoveTeam(userFamily);
								}
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				else if( result.selection == 7 ){ //how to use phone
					user.runCommand(`scriptevent gvcv5:phone_noteam ${userFamily}`);
				}
				else if( result.selection == 8 ){ // Attack Boss Flag
					user.runCommand(`scriptevent gvcv5:phone_tp_block_attack ${userFamily}`);
				}
				else if( result.selection == 9 ){ //accept to join team
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_accept_to_join.name`);
					for( const myAlly of world.getPlayers({ tags: [ `wantToBe${userFamily}` ],families: [ `noteam` ] }) ){
						phoneArray.push( myAlly );
						form_tp.button(myAlly.nameTag);
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection < phoneArray.length ){
								const form_accept = new ActionFormData();
								const target = phoneArray[result.selection];
								form_accept.title(`script.gvcv5.phone_player_accept.name`);
								form_accept.button(`script.gvcv5.phone_accept.name`);
								form_accept.button(`script.gvcv5.phone_deny.name`);
								form_accept.show(user).then( result => {
									if ( !result.canceled ){
										if(result.selection == 0){
											target.triggerEvent(`gvcv5:become_${userFamily}team`);
											gvcv5AddTeamList(target,userFamily);
											target.removeTag(`wantToBe${userFamily}`);
											world.sendMessage([{text: `${target.nameTag}`},{ translate: `script.gvcv5.youAreIn${userFamily}team.name`}]);
										}
										else if(result.selection == 1){
											target.removeTag(`wantToBe${userFamily}`);
											target.sendMessage({ translate: `script.gvcv5.wantToBe_deny.name`});
											user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
										}
									}
								} )
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				else if( result.selection == 10 ){ //kick member
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_kick_member.name`);
					for( const myAlly of world.getPlayers({ families: [ userFamily ] }) ){
						if( myAlly.nameTag != world.getDynamicProperty(`${userFamily}Leader`)){
							phoneArray.push( myAlly );
							form_tp.button(myAlly.nameTag);
						}
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection < phoneArray.length ){
								phoneArray[result.selection].triggerEvent(`gvcv5:become_noteam`);
								phoneArray[result.selection].runCommand(`clear @s zex:phone_${userFamily}`);
								gvcv5RemoveTeamList(phoneArray[result.selection],userFamily);
								phoneArray[result.selection].kill();
								phoneArray[result.selection].addTag(`bannedFrom${userFamily}`);
								phoneArray[result.selection].removeTag(`${userFamily}Leader`);
								world.sendMessage([{text: `${phoneArray[result.selection].nameTag}`},{ translate: `script.gvcv5.phone_left_${userFamily}.name`}]);
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				else if( result.selection == 11 ){ //transfer leader
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_transfer_leader.name`);
					for( const myAlly of world.getPlayers({ families: [ userFamily ] }) ){
						if( myAlly.nameTag != world.getDynamicProperty(`${userFamily}Leader`)){
							phoneArray.push( myAlly );
							form_tp.button(myAlly.nameTag);
						}
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection < phoneArray.length ){
								const form_accept = new ActionFormData();
								const target = phoneArray[result.selection];
								form_accept.title(`script.gvcv5.phone_transfer_leader.name`);
								form_accept.button(`script.gvcv5.phone_set_leader.name`);
								if( target.hasTag(`${userFamily}Leader`) ){
									form_accept.button(`script.gvcv5.phone_remove_subleader.name`);
								}
								else{
									form_accept.button(`script.gvcv5.phone_set_subleader.name`);
								}
								form_accept.button(`script.gvcv5.phone_back.name`);
								form_accept.show(user).then( result => {
									if ( !result.canceled ){
										if(result.selection == 0){
											world.setDynamicProperty(`${userFamily}Leader`,`${target.nameTag}`)
											target.sendMessage(`script.gvcv5.phone_new_leader.name`);
											target.addTag(`${userFamily}Leader`);
											user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
										}
										else if(result.selection == 1){
											if( target.hasTag(`${userFamily}Leader`) ){
												target.removeTag(`${userFamily}Leader`);
												target.sendMessage(`script.gvcv5.phone_remove_subleader_m.name`);
											}
											else{
												target.addTag(`${userFamily}Leader`);
												target.sendMessage(`script.gvcv5.phone_new_subleader.name`);
											}
											user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
										}
										else{
											user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
										}
									}
								} )
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
			}
		} )
	}

	else if( e.id == `gvcv5:admin` ){
		if( e.message== `team` ){
			const form = new ModalFormData();
			form.title(`Admin Settings`);
			//world.getDynamicProperty("gvcv5:isBossFlag")
			form.textField(`Red team Password`, `${world.getDynamicProperty(`redPass`)}`,{defaultValue:`${world.getDynamicProperty(`redPass`)}`,tooltip:`Current is ${world.getDynamicProperty(`redPass`)}`});
			form.textField(`Blue team Password`, `${world.getDynamicProperty(`bluePass`)}`,{defaultValue:`${world.getDynamicProperty(`bluePass`)}`,tooltip:`Current is ${world.getDynamicProperty(`bluePass`)}`});
			form.textField(`Green team Password`, `${world.getDynamicProperty(`greenPass`)}`,{defaultValue:`${world.getDynamicProperty(`greenPass`)}`,tooltip:`Current is ${world.getDynamicProperty(`greenPass`)}`});
			form.textField(`Yellow team Password`, `${world.getDynamicProperty(`yellowPass`)}`,{defaultValue:`${world.getDynamicProperty(`yellowPass`)}`,tooltip:`Current is ${world.getDynamicProperty(`yellowPass`)}`});
			form.toggle(`Delete Red Team`, {defaultValue:false});
			form.toggle(`Delete Blue Team`, {defaultValue:false});
			form.toggle(`Delete Green Team`, {defaultValue:false});
			form.toggle(`Delete Yellow Team`, {defaultValue:false});
			form.toggle(`Team Jail`, {defaultValue:world.getDynamicProperty(`teamJail`)});
			form.toggle(`Boss Flag`, {defaultValue:world.getDynamicProperty("gvcv5:isBossFlag")});
			form.show(e.sourceEntity).then( result => {
				if ( !result.canceled ){
					if( world.getDynamicProperty(`redPass`) != result.formValues[0] && result.formValues[0] != `undefined` ){
						world.setDynamicProperty(`redPass`,result.formValues[0]);
						e.sourceEntity.sendMessage(`Red team Password is now ${result.formValues[0]}`);
					}
					if( world.getDynamicProperty(`bluePass`) != result.formValues[1] && result.formValues[1] != `undefined` ){
						world.setDynamicProperty(`bluePass`,result.formValues[1]);
						e.sourceEntity.sendMessage(`Blue team Password is now ${result.formValues[1]}`);
					}
					if( world.getDynamicProperty(`greenPass`) != result.formValues[2] && result.formValues[2] != `undefined` ){
						world.setDynamicProperty(`greenPass`,result.formValues[2]);
						e.sourceEntity.sendMessage(`Green team Password is now ${result.formValues[2]}`);
					}
					if( world.getDynamicProperty(`yellowPass`) != result.formValues[3] && result.formValues[3] != `undefined` ){
						world.setDynamicProperty(`yellowPass`,result.formValues[3]);
						e.sourceEntity.sendMessage(`Yellow team Password is now ${result.formValues[3]}`);
					}
					if( result.formValues[4] ){
						gvcv5RemoveTeam("red")
					}
					if( result.formValues[5] ){
						gvcv5RemoveTeam("blue")
					}
					if( result.formValues[6] ){
						gvcv5RemoveTeam("green")
					}
					if( result.formValues[7] ){
						gvcv5RemoveTeam("yellow")
					}
					if( world.getDynamicProperty(`teamJail`) != result.formValues[8] ){
						world.setDynamicProperty(`teamJail`,result.formValues[8]);
						e.sourceEntity.sendMessage(`Team Jail is now ${result.formValues[8]}`);
					}
					if( world.getDynamicProperty(`gvcv5:isBossFlag`) != result.formValues[9] ){
						world.setDynamicProperty(`gvcv5:isBossFlag`,result.formValues[9]);
						e.sourceEntity.sendMessage(`Boss Flag is now ${result.formValues[9]}`);
					}
				}
			} )
		}

	}
},)