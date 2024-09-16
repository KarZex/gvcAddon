import { world, system, EquipmentSlot, EntityComponentTypes  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";
import { craftData } from "./crafts";
import "./compornents";

function setArmorValue( itemName ){
	if( itemName.includes("leather") ){ return 0.025 }
	else if( itemName.includes("chainmail") ){ return 0.05 }
	else if( itemName.includes("iron") ){ return 0.075 }
	else if( itemName.includes("golden") ){ return 0.075 }
	else if( itemName.includes("diamond") ){ return 0.1125 }
	else if( itemName.includes("plastic") ){ return 0.1 }
	else if( itemName.includes("ghilliesuit") ){ return 0.025 }
	else if( itemName.includes("trench") ){ return 0.075 }
	else if( itemName.includes("mghelmet") ){ return 0.075 }
	else if( itemName.includes("firemask") ){ return 0.025 }
	else if( itemName.includes("droneguided") ){ return 0.075 }
	else if( itemName.includes("netherite") ){ return 0.1125 }
	else { return 0 }
}

world.afterEvents.projectileHitEntity.subscribe( e => {
	if( e.projectile.typeId.includes("fire")){
		let vict = e.getEntityHit().entity;
		let def = 0;
		let gunName = e.projectile.typeId
		if( gunName.includes("fire:ads_") ){ gunName = gunName.replace("fire:ads_",""); }
		else if( gunName.includes("fire:") ){ gunName = gunName.replace("fire:",""); }
		let damageType = gunData[`${gunName}`]["damageType"];
		const equipmentComp = vict.getComponent(EntityComponentTypes.Equippable)
		if( equipmentComp ){
			def = 0.5;
			if( equipmentComp.getEquipment(EquipmentSlot.Head) != undefined ){ 
				def = def + setArmorValue(equipmentComp.getEquipmentSlot(EquipmentSlot.Head).typeId) 
			}
			if( equipmentComp.getEquipment(EquipmentSlot.Chest) != undefined  ){ 
				def = def + setArmorValue(equipmentComp.getEquipmentSlot(EquipmentSlot.Chest).typeId) 
			}
			if( equipmentComp.getEquipment(EquipmentSlot.Legs) != undefined  ){
				 def = def + setArmorValue(equipmentComp.getEquipmentSlot(EquipmentSlot.Legs).typeId) 
				}
			if( equipmentComp.getEquipment(EquipmentSlot.Feet) != undefined  ){
				 def = def + setArmorValue(equipmentComp.getEquipmentSlot(EquipmentSlot.Feet).typeId) 
			}
		}
		if (def > 1){ def = 1 }
		let damage = gunData[`${gunName}`]["damage"] *  (1 - def);
        if( vict.getEffect("resistance") == undefined && vict.hasTag("antiBullet") == false ){
            vict.applyDamage(damage,{ cause: damageType,damagingEntity: e.source });
            vict.applyKnockback(0, 0, 0, 0);
        }
		e.projectile.triggerEvent("minecraft:explode");
	}
})
world.beforeEvents.playerLeave.subscribe( e => {
	if( e.player.hasTag(`onDeath`) ){
		e.player.setDynamicProperty(`cTime`,world.getAbsoluteTime());
	}
} )
world.afterEvents.playerJoin.subscribe( e => {
	const player = world.getPlayers( { name : e.playerName } )
	if( player.hasTag(`onDeath`) ){
		const score = world.getAbsoluteTime() - player.getDynamicProperty(`cTime`);
		world.scoreboard.getObjective("DeathTime").setScore(player,score);
	}
} )
system.afterEvents.scriptEventReceive.subscribe( e => {
	if (e.id === "zex:start"){
		const player = e.sourceEntity;
		player.setDynamicProperty(`DeathCount`,0);
	}
	else if( e.id === `zex:time` ){
		const time = world.getAbsoluteTime();
		world.sendMessage(`${time}`);
	}
	else if (e.id === "zex:removeTeam"){
		const team = e.message;
		world.setDynamicProperty(`${team}Leader`,undefined);
	}
	else if( e.id === `zex:changeTeamPass` ){
		const M = e.message.split(` `);
		world.setDynamicProperty(`${M[0]}Pass`,`${M[1]}`);
	}
	else if( e.id === "gvcv5:TeamList" ){
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
	//ブロックを叩くことで、リロード
	else if (e.id === "gvcv5:reload"){
		let p = e.sourceEntity;
		const gunName = e.message;
		let maxGunAmmo = gunData[`${gunName}`]["maxGunAmmo"];
		let s = Number(world.scoreboard.getObjective(gunName).getScore(p));
		let d = Number(maxGunAmmo) - s;
		let reloadTime = gunData[`${gunName}`]["reloadTime"];
		let Ammo = gunData[`${gunName}`]["bullet"];
		let c = 0;
		if( d > 0 ){
			//インベントリから弾の個数を取得する
			for(let i = 0; i < 36; i++){
				let Haditem = p.getComponent("inventory").container.getItem(i);
				if( Haditem != undefined && Haditem.typeId === Ammo ){
					c += p.getComponent("inventory").container.getItem(i).amount;
				}
			}
			if (c > 0){
				if( c > d ){
					world.scoreboard.getObjective(gunName).setScore(p,Number(maxGunAmmo));
					p.runCommand(`clear @s ${Ammo} 0 ${d}`);
				}
				else{
					s = s + c;
					world.scoreboard.getObjective(gunName).setScore(p,s);
					p.runCommand(`clear @s ${Ammo} 0 ${c}`);
				}
				p.addEffect("slowness", reloadTime,{ amplifier: 2 });
				p.addTag("reload")
				world.scoreboard.getObjective("reloading").setScore(p,Number(reloadTime));
				p.runCommand("playsound reload.ak47 @s ~~~ ");
			}
		}
	}
	else if( e.id == "gvcv5:craft" ){
		const craftType = e.message;
		const player = e.sourceEntity;
		const form = new ActionFormData();
		form.title(`tile.gvcv5:${craftType}.name`);
		const sells = craftData[`${craftType}`][`sell`];
		const buys = craftData[`${craftType}`][`buy`];
		let itemRawText = []
		let sellItemCounts = []
		for( let i = 0; i < sells.length; i++ ){
			let c = 0
			for(let j = 0; j < 36; j++){
				let Haditem = player.getComponent("inventory").container.getItem(j);
				if( Haditem != undefined && Haditem.typeId == sells[i] ){
					c += player.getComponent("inventory").container.getItem(j).amount;
				}
			}
			itemRawText.push({ translate: `script.gvcv5.${sells[i]}.name` });
			itemRawText.push({ text: `:${c}\n` });
			sellItemCounts.push(c);
		}
		form.body({ rawtext: itemRawText});
		for(let i = 0; i < buys.length; i++){
			let buyData = [{ text:`§l`},{ translate: `item.${buys[i]["give"]}`},{ text:`x${buys[i]["count"]}§r\nneed:`}];
			for( let j = 0; j < sells.length; j++ ){
				if( buys[i]["cost"][j] > 0 ){
					buyData.push({ translate: `script.gvcv5.${sells[j]}.name` });
					buyData.push({ text: `x${buys[i]["cost"][j]}` });
				}
			}
			form.button({ rawtext: buyData},buys[i]["texture"]);
		}
		form.show(player).then( result => {
			if ( !result.canceled ){
				if( sellItemCounts.every( (value, index) => value >= buys[result.selection]["cost"][index] ) ){
					for( let i = 0; i < sells.length; i++ ){
						player.runCommand(`clear @s ${sells[i]} 0 ${buys[result.selection]["cost"][i]}`);
					}
					player.runCommand(`give @s ${buys[result.selection]["give"]} ${buys[result.selection]["count"]}`);
				}
				else{
					player.sendMessage({ translate: `script.gvcv5.no_ma.name`});
				}
				player.runCommand(`scriptevent gvcv5:craft ${craftType}`);
			}
		} )
		
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
					itemRawText.push({ text: `\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc1.name` });
					itemRawText.push({ text: `\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc2.name` });
					itemRawText.push({ text: `\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc3.name` });
					itemRawText.push({ text: `\n` });
					form.body({ rawtext: itemRawText});
					if( user.hasTag(`autoReload`) ){
						form.button(`script.gvcv5.autoReloadOff.name`);
					}
					else{
						form.button(`script.gvcv5.autoReloadOn.name`);
					}
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							
							if( r.selection == 0 ){
								if( user.hasTag(`autoReload`) ){
									user.removeTag(`autoReload`)
								}
								else{
									user.addTag(`autoReload`)
								}
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
					itemRawText.push({ text: `\n` });
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc1.name` });
					itemRawText.push({ text: `\n` });
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc2.name` });
					itemRawText.push({ text: `\n` });
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
					if( world.getDynamicProperty(`redLeader`) == undefined ){
						if( world.getDynamicProperty(`redPass`) != undefined ){
							const form = new ModalFormData();
							form.title(`script.gvcv5.input_password.name`);
							form.textField(`script.gvcv5.input_password.name`,``);
							form.show(user).then( r => {
								if (!r.canceled) {
									if( world.getDynamicProperty("redPass") == r.formValues[0] ){
										user.triggerEvent(`gvcv5:become_redteam`);
										world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.youAreInredteam.name`}]);
										world.setDynamicProperty(`redchat`,``);
										world.setDynamicProperty(`redLeader`,`${user.nameTag}`);
										user.addTag(`redLeader`);
									}
									else{
										user.sendMessage({ translate: `script.gvcv5.invaid_password.name`});
									}
								}
							},)
						}
						else{
							user.triggerEvent(`gvcv5:become_redteam`);
							world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.youAreInredteam.name`}]);
							world.setDynamicProperty(`redchat`,``);
							world.setDynamicProperty(`redLeader`,`${user.nameTag}`);
							user.addTag(`redLeader`);
						}
					}
					else{
						user.addTag(`wantToBered`);
						user.runCommand(`tellraw @a[tag=redLeader] {\"rawtext\":[{\"text\":\"${user.nameTag}\"},{\"translate\":\"script.gvcv5.wantToBe.name\"}]}`)
					}
				}
				else if( r.selection == 1 ){
					if( world.getDynamicProperty(`blueLeader`) == undefined ){
						if( world.getDynamicProperty(`bluePass`) != undefined ){
							const form = new ModalFormData();
							form.title(`script.gvcv5.input_password.name`);
							form.textField(`script.gvcv5.input_password.name`,``);
							form.show(user).then( r => {
								if (!r.canceled) {
									if( world.getDynamicProperty("bluePass") == r.formValues[0] ){
										user.triggerEvent(`gvcv5:become_blueteam`);
										world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.youAreInblueteam.name`}]);
										world.setDynamicProperty(`bluechat`,``);
										world.setDynamicProperty(`blueLeader`,`${user.nameTag}`);
										user.addTag(`blueLeader`);
									}
									else{
										user.sendMessage({ translate: `script.gvcv5.invaid_password.name`});
									}
								}
							},)
						}
						else{
							user.triggerEvent(`gvcv5:become_blueteam`);
							world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.youAreInblueteam.name`}]);
							world.setDynamicProperty(`bluechat`,``);
							world.setDynamicProperty(`blueLeader`,`${user.nameTag}`);
							user.addTag(`blueLeader`);
						}
					}
					else{
						user.addTag(`wantToBeblue`);
						user.runCommand(`tellraw @a[tag=blueLeader] {\"rawtext\":[{\"text\":\"${user.nameTag}\"},{\"translate\":\"script.gvcv5.wantToBe.name\"}]}`)
					}
				}
				else if( r.selection == 2 ){
					if( world.getDynamicProperty(`greenLeader`) == undefined ){
						if( world.getDynamicProperty(`greenPass`) != undefined ){
							const form = new ModalFormData();
							form.title(`script.gvcv5.input_password.name`);
							form.textField(`script.gvcv5.input_password.name`,``);
							form.show(user).then( r => {
								if (!r.canceled) {
									if( world.getDynamicProperty("greenPass") == r.formValues[0] ){
										user.triggerEvent(`gvcv5:become_greenteam`);
										world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.youAreIngreenteam.name`}]);
										world.setDynamicProperty(`greenchat`,``);
										world.setDynamicProperty(`greenLeader`,`${user.nameTag}`);
										user.addTag(`greenLeader`);
									}
									else{
										user.sendMessage({ translate: `script.gvcv5.invaid_password.name`});
									}
								}
							},)
						}
						else{
							user.triggerEvent(`gvcv5:become_greenteam`);
							world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.youAreIngreenteam.name`}]);
							world.setDynamicProperty(`greenchat`,``);
							world.setDynamicProperty(`greenLeader`,`${user.nameTag}`);
							user.addTag(`greenLeader`);
						}
					}
					else{
						user.addTag(`wantToBegreen`);
						user.runCommand(`tellraw @a[tag=greenLeader] {\"rawtext\":[{\"text\":\"${user.nameTag}\"},{\"translate\":\"script.gvcv5.wantToBe.name\"}]}`)
					}
				}
				else if( r.selection == 3 ){
					if( world.getDynamicProperty(`yellowLeader`) == undefined ){
						if( world.getDynamicProperty(`yellowPass`) != undefined ){
							const form = new ModalFormData();
							form.title(`script.gvcv5.input_password.name`);
							form.textField(`script.gvcv5.input_password.name`,``);
							form.show(user).then( r => {
								if (!r.canceled) {
									if( world.getDynamicProperty("yellowPass") == r.formValues[0] ){
										user.triggerEvent(`gvcv5:become_yellowteam`);
										world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.youAreInyellowteam.name`}]);
										world.setDynamicProperty(`yellowchat`,``);
										world.setDynamicProperty(`yellowLeader`,`${user.nameTag}`);
										user.addTag(`yellowLeader`);
									}
									else{
										user.sendMessage({ translate: `script.gvcv5.invaid_password.name`});
									}
								}
							},)
						}
						else{
							user.triggerEvent(`gvcv5:become_yellowteam`);
							world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.youAreInyellowteam.name`}]);
							world.setDynamicProperty(`yellowchat`,``);
							world.setDynamicProperty(`yellowLeader`,`${user.nameTag}`);
							user.addTag(`yellowLeader`);
						}
					}
					else{
						user.addTag(`wantToBeyellow`);
						user.runCommand(`tellraw @a[tag=yellowLeader] {\"rawtext\":[{\"text\":\"${user.nameTag}\"},{\"translate\":\"script.gvcv5.wantToBe.name\"}]}`)
					}
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
		for( let i = 0; i < 10; i++ ){
			form.button(`${phone.getDynamicProperty(`slot${i}_name`)}`);
		}
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == 10 ){
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
		for( let i = 0; i < 10; i++ ){
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
							text += `[${user.nameTag}]:${r.formValues[0]}\n`;
							world.setDynamicProperty(`${userFamily}chat`,text);
							user.runCommand(`tellraw @a[hasitem={item=zex:phone_${userFamily}},rm=1] {\"rawtext\":[{\"translate\":\"script.gvcv5.newMessage_${userFamily}.name\"}]}`);
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
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		let phoneArray = [];
		const form = new ActionFormData();
		form.title(`script.gvcv5.phone.name`);
		form.button(`script.gvcv5.phone_tp.name`);
		form.button(`script.gvcv5.phone_tp_block.name`);
		form.button(`script.gvcv5.phone_teamChat.name`);
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
				if( result.selection == 0 ){
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_tp.name`);
					for( const myAlly of world.getAllPlayers() ){
						if( myAlly.hasTag(`${userFamily}`) ){
							phoneArray.push( myAlly );
							form_tp.button(`${myAlly.nameTag}\nX:${Math.floor(myAlly.location.x)} Y:${Math.floor(myAlly.location.y)} Z:${Math.floor(myAlly.location.z)}`);
							continue;
						}
						for(let i = 0; i < 36; i++){
							let Haditem = myAlly.getComponent("inventory").container.getItem(i);
							if( Haditem != undefined && Haditem.typeId === `zex:phone_${userFamily}` ){
								world.sendMessage(`detected`);
								phoneArray.push( myAlly );
								form_tp.button(`§4${myAlly.nameTag}\nX:${Math.floor(myAlly.location.x)} Y:${Math.floor(myAlly.location.y)} Z:${Math.floor(myAlly.location.z)}§r`);
								break;
							}
						}
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection < phoneArray.length && user.hasTag(`${userFamily}`) ){
								user.teleport(phoneArray[result.selection].location,{ dimension : phoneArray[result.selection].dimension });
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				if( result.selection == 1 ){
					user.runCommand(`scriptevent gvcv5:phone_tp_block ${userFamily}`);
				}
				else if( result.selection == 2 ){
					user.runCommand(`scriptevent gvcv5:phone_teamChat ${userFamily}`);
				}
				else if( result.selection == 3 ){
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
				if( result.selection == 4 ){
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
								user.kill();
								user.removeTag(`${userFamily}Leader`);
								world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.phone_left_${userFamily}.name`}]);

								if( user.nameTag == world.getDynamicProperty(`${userFamily}Leader`) ){
									world.sendMessage([{ translate: `script.gvcv5.phone_dismantle_${userFamily}.name`}]);
									world.setDynamicProperty(`${userFamily}Leader`,undefined);
									world.setDynamicProperty(`${userFamily}Member`,``);
									for( const myAlly of world.getPlayers({ families: [ userFamily ] }) ){
										myAlly.triggerEvent(`gvcv5:become_noteam`);
										myAlly.runCommand(`clear @s zex:phone_${userFamily}`);
									}
								}
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				else if( result.selection == 5 ){
					user.runCommand(`scriptevent gvcv5:phone_noteam ${userFamily}`);
				}
				else if( result.selection == 6 ){
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
				if( result.selection == 7 ){ 
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
								phoneArray[result.selection].kill();
								phoneArray[result.selection].removeTag(`${userFamily}Leader`);
								world.sendMessage([{text: `${phoneArray[result.selection].nameTag}`},{ translate: `script.gvcv5.phone_left_${userFamily}.name`}]);
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				if( result.selection == 8 ){
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
},)