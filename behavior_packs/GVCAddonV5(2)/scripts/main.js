import { world, system, EntityDamageCause, EquipmentSlot, EntityComponentTypes  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";
import { craftData } from "./crafts";

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
	else if( itemName.includes("netherite") ){ return 0.125 }
	else { return 0 }
}

world.afterEvents.projectileHitEntity.subscribe( e => {
	if( e.projectile.typeId.includes("fire")){
		let vict = e.getEntityHit().entity;
		let def = 0;
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
		let gunName = e.projectile.typeId
		if( gunName.includes("fire:ads_") ){ gunName = gunName.replace("fire:ads_",""); }
		else if( gunName.includes("fire:") ){ gunName = gunName.replace("fire:",""); }
		
		if (def > 1){ def = 1 }
		let damage = gunData[`${gunName}`]["damage"] *  (1 - def);
		let damageType = gunData[`${gunName}`]["damageType"];
        if( vict.getEffect("resistance") == undefined && vict.hasTag("antiBullet") == false ){
            vict.applyDamage(damage,{ cause: damageType,damagingEntity: e.source });
            vict.applyKnockback(0, 0, 0, 0);
        }
		e.projectile.triggerEvent("minecraft:explode");
	}
})

system.afterEvents.scriptEventReceive.subscribe( e => {
	if (e.id === "zex:recoil"){
		let pos = e.sourceEntity.getRotation();
		pos.x = pos.x - Number(e.message)
		e.sourceEntity.setRotation(pos)
		e.sourceEntity.sendMessage(`${e.message}`)
		e.sourceEntity.sendMessage(`x:${pos.x} y:${pos.y}`)
		e.sourceEntity.setRotation({x:0, y:0})
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
	else if( e.id == "gvcv5:phone_noteam" ){
		const user = e.sourceEntity;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const form = new ActionFormData();
		let alreadyTeam = false
		form.title(`script.gvcv5.select_team.name`);
		form.body(`script.gvcv5.select_team_body.name`);
		form.button(`script.gvcv5.become_red.name`);
		form.button(`script.gvcv5.become_blue.name`);
		form.button(`script.gvcv5.become_green.name`);
		form.button(`script.gvcv5.become_yellow.name`);
		form.show(user).then( r => {
			if (!r.canceled) {
				if( r.selection == 0 ){
					for( const myAlly of world.getPlayers({ families: [ `red` ] }) ){
						if ( myAlly.hasTag(`redleader`) ){
							alreadyTeam = true
						}
					}
					if(alreadyTeam){
						user.addTag(`wantToBered`);
					}
					else{
						const form = new ModalFormData();
						form.title(`script.gvcv5.input_password.name`);
						form.textField(`script.gvcv5.input_password.name`,``);
						form.show(user).then( r => {
							if (!r.canceled) {
								if( r.formValues[0] == `1e4ac6b8` ){
									user.triggerEvent(`gvcv5:become_redteam`);
									user.addTag(`redleader`);
									user.sendMessage({ translate: `script.gvcv5.youAreInredteam.name`});
									world.setDynamicProperty(`redchat`,``)
								}
								else{
									user.sendMessage({ translate: `script.gvcv5.invaid_password.name`});
								}
							}
						},)
					}
				}
				else if( r.selection == 1 ){
					for( const myAlly of world.getPlayers({ families: [ `blue` ] }) ){
						if ( myAlly.hasTag(`blueleader`) ){
							alreadyTeam = true
						}
					}
					if(alreadyTeam){
						user.addTag(`wantToBeblue`);
					}
					else{
						const form = new ModalFormData();
						form.title(`script.gvcv5.input_password.name`);
						form.textField(`script.gvcv5.input_password.name`,``);
						form.show(user).then( r => {
							if (!r.canceled) {
								if( r.formValues[0] == `4586ce6a` ){
									user.triggerEvent(`gvcv5:become_blueteam`);
									user.addTag(`blueleader`);
									user.sendMessage({ translate: `script.gvcv5.youAreInblueteam.name`});
									world.setDynamicProperty(`bluechat`,``)
								}
								else{
									user.sendMessage({ translate: `script.gvcv5.invaid_password.name`});
								}
							}
						},)
					}
				}
				else if( r.selection == 2 ){
					for( const myAlly of world.getPlayers({ families: [ `green` ] }) ){
						if ( myAlly.hasTag(`greenleader`) ){
							alreadyTeam = true
						}
					}
					if(alreadyTeam){
						user.addTag(`wantToBegreen`);
					}
					else{
						const form = new ModalFormData();
						form.title(`script.gvcv5.input_password.name`);
						form.textField(`script.gvcv5.input_password.name`,``);
						form.show(user).then( r => {
							if (!r.canceled) {
								if( r.formValues[0] == `fa477c83` ){
									user.triggerEvent(`gvcv5:become_greenteam`);
									user.addTag(`greenleader`);
									user.sendMessage({ translate: `script.gvcv5.youAreIngreenteam.name`});
									world.setDynamicProperty(`greenchat`,``)
								}
								else{
									user.sendMessage({ translate: `script.gvcv5.invaid_password.name`});
								}
							}
						},)
					}
				}
				else if( r.selection == 3 ){
					for( const myAlly of world.getPlayers({ families: [ `yellow` ] }) ){
						if ( myAlly.hasTag(`yellowleader`) ){
							alreadyTeam = true
						}
					}
					if(alreadyTeam){
						user.addTag(`wantToBeyellow`);
					}
					else{
						const form = new ModalFormData();
						form.title(`script.gvcv5.input_password.name`);
						form.textField(`script.gvcv5.input_password.name`,``);
						form.show(user).then( r => {
							if (!r.canceled) {
								if( r.formValues[0] == `2e8a6905` ){
									user.triggerEvent(`gvcv5:become_yellowteam`);
									user.addTag(`yellowleader`);
									user.sendMessage({ translate: `script.gvcv5.youAreInyellowteam.name`});
									world.setDynamicProperty(`yellowchat`,``)
								}
								else{
									user.sendMessage({ translate: `script.gvcv5.invaid_password.name`});
								}
							}
						},)
					}
				}
			}
		},)
	}
	else if( e.id == "gvcv5:phone_locked" ){
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
	else if( e.id == "gvcv5:phone_teamChat" ){
		const userFamily = e.message;
		const user = e.sourceEntity;
		const form = new ActionFormData();
		let text = world.getDynamicProperty(`${userFamily}chat`);
		form.title(`script.gvcv5.phone_teamChat.name`);
		form.button(`script.gvcv5.phone_sendmessage.name`);
		form.button(`script.gvcv5.phone_back.name`);
		if( user.hasTag(`${userFamily}leader`) ){
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
							world.setDynamicProperty(`${userFamily}chat`,text)
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
		form.button(`script.gvcv5.phone_teamChat.name`);
		form.button(`script.gvcv5.phone_password.name`);
		if( user.hasTag(`${userFamily}leader`) ){
			form.button(`script.gvcv5.phone_accept_to_join.name`);
			form.button(`script.gvcv5.phone_transfer_leader.name`);
		}
		form.show(user).then( result => {
			if ( !result.canceled ){
				if( result.selection == 0 ){
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_tp.name`);
					for( const myAlly of world.getPlayers({ families: [ userFamily ] }) ){
						phoneArray.push( myAlly.location );
						form_tp.button(myAlly.nameTag);
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection < phoneArray.length ){
								user.teleport(phoneArray[result.selection]);
							}
							else{
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
							}
						}
					} )
				}
				else if( result.selection == 1 ){
					user.runCommand(`scriptevent gvcv5:phone_teamChat ${userFamily}`);
				}
				else if( result.selection == 2 ){
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
				else if( result.selection == 3 ){
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
											target.sendMessage({ translate: `script.gvcv5.youAreIn${userFamily}team.name`});
											user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
										}
										else if(result.selection == 1){
											target.removeTag(`wantToBe${userFamily}`);
											target.sendMessage({ translate: `script.gvcv5.youAreDenied${userFamily}team.name`});
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
				if( result.selection == 4 ){
					const form_tp = new ActionFormData();
					form_tp.title(`script.gvcv5.phone_transfer_leader.name`);
					for( const myAlly of world.getPlayers({ families: [ userFamily ] }) ){
						phoneArray.push( myAlly );
						form_tp.button(myAlly.nameTag);
					}
					form_tp.button(`script.gvcv5.phone_back.name`);
					form_tp.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection < phoneArray.length ){
								user.removeTag(`${userFamily}leader`);
								phoneArray[result.selection].addTag(`${userFamily}leader`);
								user.runCommand(`scriptevent gvcv5:phone_unlocked ${userFamily}`);
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