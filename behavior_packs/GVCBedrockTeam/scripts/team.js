import { world, system, EquipmentSlot, EntityComponentTypes  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import "./teamCompornents";

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
		user.addTag(`wantToBe${team}`);
		user.runCommand(`tellraw @a[tag=${team}Leader] {\"rawtext\":[{\"text\":\"${user.nameTag}\"},{\"translate\":\"script.gvcv5.wantToBe.name\"}]}`)
	}
}

function gvcv5CreateTeam( user,team ){
	user.triggerEvent(`gvcv5:become_${team}team`);
	world.sendMessage([{text: `${user.nameTag}`},{ translate: `script.gvcv5.youAreIn${team}team.name`}]);
	world.setDynamicProperty(`${team}chat`,``);
	world.setDynamicProperty(`${team}Leader`,`${user.nameTag}`);
	user.addTag(`${team}Leader`);
}

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
						world.setDynamicProperty(`redLeader`,undefined);
						world.setDynamicProperty(`redMember`,``);
						for( const myAlly of world.getPlayers({ families: [ `red` ] }) ){
							myAlly.triggerEvent(`gvcv5:become_noteam`);
							myAlly.runCommand(`clear @s zex:phone_red`);
						}
						world.sendMessage([{ translate: `script.gvcv5.phone_dismantle_red.name`}]);
					}
					if( result.formValues[5] ){
						world.setDynamicProperty(`blueLeader`,undefined);
						world.setDynamicProperty(`blueMember`,``);
						for( const myAlly of world.getPlayers({ families: [ `blue` ] }) ){
							myAlly.triggerEvent(`gvcv5:become_noteam`);
							myAlly.runCommand(`clear @s zex:phone_blue`);
						}
						world.sendMessage([{ translate: `script.gvcv5.phone_dismantle_blue.name`}]);
					}
					if( result.formValues[6] ){
						world.setDynamicProperty(`greenLeader`,undefined);
						world.setDynamicProperty(`greenMember`,``);
						for( const myAlly of world.getPlayers({ families: [ `green` ] }) ){
							myAlly.triggerEvent(`gvcv5:become_noteam`);
							myAlly.runCommand(`clear @s zex:phone_green`);
						}
						world.sendMessage([{ translate: `script.gvcv5.phone_dismantle_green.name`}]);
					}
					if( result.formValues[7] ){
						world.setDynamicProperty(`yellowLeader`,undefined);
						world.setDynamicProperty(`yellowMember`,``);
						for( const myAlly of world.getPlayers({ families: [ `yellow` ] }) ){
							myAlly.triggerEvent(`gvcv5:become_noteam`);
							myAlly.runCommand(`clear @s zex:phone_yellow`);
						}
						world.sendMessage([{ translate: `script.gvcv5.phone_dismantle_yellow.name`}]);
					}
				}
			} )
		}

	}
},)