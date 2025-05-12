import { world, system, EquipmentSlot, EntityComponentTypes  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import "./teamCompornents";
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
	world.setDynamicProperty(`${team}Leader`,`${user.nameTag}`);
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

world.afterEvents.playerSpawn.subscribe( e => {
	const p = e.player;
	const redJail = world.getDynamicProperty(`redJail`); 
	const blueJail = world.getDynamicProperty(`blueJail`); 
	const greenJail = world.getDynamicProperty(`greenJail`);
	const yellowJail = world.getDynamicProperty(`yellowJail`);

	if( ( p.hasTag(`downedbyred`) || p.hasTag(`redSub`) ) && world.getDynamicProperty(`teamJail`) ){
		p.teleport(redJail);
		if(  p.hasTag(`downedbyred`) ){
			world.scoreboard.getObjective("DeathTime").setScore(p,24000);
			p.addTag(`redSub`);
			p.addTag(`onDeath`);
			p.runCommand(`give @s rotten_flesh 4`);
		}
	}

	else if(( p.hasTag(`downedbyblue`) || p.hasTag(`blueSub`) ) && world.getDynamicProperty(`teamJail`) ){
		p.teleport(blueJail);
		if(  p.hasTag(`downedbyblue`) ){
			world.scoreboard.getObjective("DeathTime").setScore(p,24000);
			p.addTag(`blueSub`);
			p.addTag(`onDeath`);
			p.runCommand(`give @s rotten_flesh 4`);
		}
	}
	else if( (p.hasTag(`downedbygreen`) || p.hasTag(`greenSub`)) && world.getDynamicProperty(`teamJail`) ){
		p.teleport(greenJail);
		if(  p.hasTag(`downedbygreen`) ){
			world.scoreboard.getObjective("DeathTime").setScore(p,24000);
			p.addTag(`greenSub`);
			p.addTag(`onDeath`);
			p.runCommand(`give @s rotten_flesh 4`);
		}
	}
	else if( (p.hasTag(`downedbyyellow`) || p.hasTag(`yellowSub`)) && world.getDynamicProperty(`teamJail`) ){
		p.teleport(yellowJail);
		if(  p.hasTag(`downedbyyellow`) ){
			world.scoreboard.getObjective("DeathTime").setScore(p,24000);
			p.addTag(`yellowSub`);
			p.addTag(`onDeath`);
			p.runCommand(`give @s rotten_flesh 4`);
		}
	}
	p.runCommand(`inputpermission set @s movement enabled`);
	p.removeTag(`downedbyred`);
	p.removeTag(`downedbyblue`);
	p.removeTag(`downedbygreen`);
	p.removeTag(`downedbyyellow`);
} )

world.beforeEvents.playerLeave.subscribe( e => {
	if( e.player.hasTag(`onDeath`) ){
		e.player.setDynamicProperty(`cTime`,world.getAbsoluteTime());
	}
} )
world.afterEvents.playerJoin.subscribe( e => {
	const player = world.getPlayers( { name : e.playerName } )[0];
	if( player.hasTag(`onDeath`) ){
		const score = world.getAbsoluteTime() - player.getDynamicProperty(`cTime`);
		world.scoreboard.getObjective("DeathTime").setScore(player,score);
	}
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
		form.title(`script.gvcv5.phone_noteam.name`);
		form.button(`script.gvcv5.howToGun.name`);
		form.button(`script.gvcv5.howToVechile.name`);
		form.button(`script.gvcv5.phone_howToTeam.name`);
		form.button(`script.gvcv5.phone_teamList.name`);
		if( team == `noteam` ){
			form.button(`script.gvcv5.select_team.name`);
		}
		form.show(user).then( r => {
			if (!r.canceled) {
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
					form.button(`script.gvcv5.autoReloadOn.name`);
					form.button(`script.gvcv5.autoReloadOff.name`);
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection == 0 ){
								user.addTag(`autoReload`)
								user.sendMessage({ translate: `script.gvcv5.autoReloadOn.name` });
							}
							if( result.selection == 1 ){
								user.removeTag(`autoReload`)
								user.sendMessage({ translate: `script.gvcv5.autoReloadOff.name` });
							}
							user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
						}
					} )
				}
				else if( r.selection == 1 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howToVechile.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc0.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc1.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc2.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc3.name` });
					itemRawText.push({ text: `\n\n` });
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
						}
					} )
				}
				else if( r.selection == 2 ){
					user.runCommand(`scriptevent gvcv5:phone_howToTeam ${team}`);
				}
				else if( r.selection == 3 ){
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
				else if( r.selection == 4 ){
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
		form.button(`script.gvcv5.phone_howToTeam3.name`);
		form.button(`script.gvcv5.phone_howToTeam4.name`);
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
					form.title(`script.gvcv5.phone_howToTeam3.name`);
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
					user.runCommand(`scriptevent gvcv5:phone_noteam ${team}`);
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
						user.sendMessage({ translate: `script.gvcv5.invaid_password.name`});
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
		form.title(`script.gvcv5.phone_tp_block.name`);
		for( let i = 0; i < 5; i++ ){
			form.button(`${phone.getDynamicProperty(`slot${i}_name`)}`);
		}
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == 5 ){
					user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
				}
				else if( phone.getDynamicProperty(`slot${result.selection}`) != undefined ){
					user.teleport(phone.getDynamicProperty(`slot${result.selection}`),{ dimension: world.getDimension(phone.getDynamicProperty(`slot${result.selection}_dimension`))} )
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
		form.title(`script.gvcv5.phone_set_tp_block.name`);
		for( let i = 0; i < 5; i++ ){
			form.button(`${phone.getDynamicProperty(`slot${i}_name`)}`);
		}
		form.show(user).then( result => {
			if ( !result.canceled ){
				const form = new ModalFormData()
				const PreName = `${phone.getDynamicProperty(`slot${result.selection}_name`)}`
				form.title(`script.gvcv5.phone_set_tp_block_name.name`)
				form.textField(`script.gvcv5.phone_set_tp_block_name.name`,`${PreName}`,`${PreName}`);
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
	else if( e.id == "gvcv5:phone_teamChat" ){
		const userFamily = e.message;
		const user = e.sourceEntity;
		const form = new ActionFormData();
		let text = world.getDynamicProperty(`${userFamily}chat`);
		form.title(`script.gvcv5.phone_teamChat.name`);
		form.button(`script.gvcv5.phone_sendmessage.name`);
		form.button(`script.gvcv5.phone_back.name`);
		if( user.nameTag == world.getDynamicProperty(`${userFamily}Leader`) || user.hasTag(`${userFamily}Leader`)  ){
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
		form.title(`script.gvcv5.phone.name`);
		form.button(`script.gvcv5.phone_tp.name`);
		form.button(`script.gvcv5.phone_tp_block.name`);
		form.button(`script.gvcv5.phone_teamChat.name`);
		form.button(`script.gvcv5.phone_menber_list.name`);
		form.button(`script.gvcv5.phone_password.name`);
		form.button(`script.gvcv5.phone_leave.name`);
		form.button(`script.gvcv5.phone_howTo.name`);
		if( user.hasTag(`${userFamily}Leader`) ){
			form.button(`script.gvcv5.phone_accept_to_join.name`);
			form.button(`script.gvcv5.phone_kick_member.name`);
		}
		if( user.nameTag == world.getDynamicProperty(`${userFamily}Leader`) ){
			form.button(`script.gvcv5.phone_transfer_leader.name`);
		}
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == 0 ){ // teleport to player
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
								user.teleport(phoneArray[result.selection].location,{ dimension : phoneArray[result.selection].dimension });
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
					user.runCommand(`scriptevent gvcv5:phone_tp_block ${userFamily}`);
				}
				else if( result.selection == 2 ){ // team chat
					user.runCommand(`scriptevent gvcv5:phone_teamChat ${userFamily}`);
				}
				else if( result.selection == 3 ){ //menber list
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
				else if( result.selection == 4 ){ //change password
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
				else if( result.selection == 5 ){ //leave team
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

								if( user.nameTag == world.getDynamicProperty(`${userFamily}Leader`) ){
									gvcv5RemoveTeam(userFamily);
								}
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				else if( result.selection == 6 ){ //how to use phone
					user.runCommand(`scriptevent gvcv5:phone_noteam ${userFamily}`);
				}
				else if( result.selection == 7 ){ //accept to join team
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
				else if( result.selection == 8 ){ //kick member
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
				else if( result.selection == 9 ){ //transfer leader
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
			form.textField(`Red team Password`, `${world.getDynamicProperty(`redPass`)}`,`${world.getDynamicProperty(`redPass`)}`);
			form.textField(`Blue team Password`, `${world.getDynamicProperty(`bluePass`)}`,`${world.getDynamicProperty(`bluePass`)}`);
			form.textField(`Green team Password`, `${world.getDynamicProperty(`greenPass`)}`,`${world.getDynamicProperty(`greenPass`)}`);
			form.textField(`Yellow team Password`, `${world.getDynamicProperty(`yellowPass`)}`,`${world.getDynamicProperty(`yellowPass`)}`);
			form.toggle(`Delete Red Team`, false);
			form.toggle(`Delete Blue Team`, false);
			form.toggle(`Delete Green Team`, false);
			form.toggle(`Delete Yellow Team`, false);
			form.toggle(`Team Jail`, world.getDynamicProperty(`teamJail`));
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
				}
			} )
		}

	}
},)