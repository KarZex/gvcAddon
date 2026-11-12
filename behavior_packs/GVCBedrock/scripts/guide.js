import { world, system, EquipmentSlot, EntityComponentTypes, DamagedByEntityCondition, EntityDamageCause  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { absVector2, getTeam,DistanceVector3in2dim } from "./usefulFunction"
import { gunGuide } from "./gunguide";

const Teams = [ "red","blue","green","yellow" ];
const worldDimensions = [ `overworld`, `nether`, `the_end` ];
const GUN_TYPES = Object.keys(gunGuide.gun_types);
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

function createDesc(translate,lines){
	let itemRawText = []
	for(let i = 0; i < lines; i++){
		itemRawText.push({ translate: `script.gvcv5.${translate}${i}.name` });
		itemRawText.push({ text: `\n\n` });
	}
	return itemRawText;
}

system.afterEvents.scriptEventReceive.subscribe( e => {
	if( e.id == "gvcv5:phone_guide" && !e.sourceEntity.hasTag(`down`) ){
		const user = e.sourceEntity;
		const team = e.message;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const form = new ActionFormData();
		form.title(`.debug Home Menu`);
		form.button(`script.gvcv5.guide_gun.name`,`textures/ui/phone/ak47`);
		form.button(`script.gvcv5.howToVechile.name`,`textures/ui/phone/t34`);
		form.button(`script.gvcv5.phone_howToTeam.name`,`textures/ui/phone/missing_item`);
		form.button(`script.gvcv5.phone_buildings.name`,`textures/ui/phone/missing_item`);
		form.button(`script.gvcv5.phone_buildings.name`,`textures/ui/phone/missing_item`);
		form.show(user).then( r => {
			if (!r.canceled) {
				// Gun
				if( r.selection == 0 ){
					user.runCommand(`scriptevent gvcv5:guide_gun 0`);
				}
				// Vechile
				else if( r.selection == 1 ){
					user.runCommand(`scriptevent gvcv5:guide_vechile ${team}`);
				}
			}
		},)
	}
	if( e.id == "gvcv5:guide_gun" && !e.sourceEntity.hasTag(`down`) ){
		const number = e.message;
		if( number == `0` ){
			const user = e.sourceEntity;
			const form = new ActionFormData();
			form.title(`script.gvcv5.guide_gun.name`);
			form.body(`script.gvcv5.guide_gun_desc.name`);
			form.button(`script.gvcv5.how_to_gun.name`);
			form.button(`script.gvcv5.show_guns.name`);
			form.button(`script.gvcv5.show_attachs.name`);
			form.button(`script.gvcv5.show_gren.name`);
			form.button(`script.gvcv5.show_fight.name`);
			form.button(`script.gvcv5.back.name`);
			form.show(user).then( result => {
				if ( !result.canceled ){
					// Gun
					if( result.selection != 5 ){
						user.runCommand(`scriptevent gvcv5:guide_gun ${result.selection+1}`);
					}
					else{
						user.runCommand(`scriptevent gvcv5:phone_guide`);
					}
				}
			} )
		}
		else if( number == `1` ){
			const user = e.sourceEntity;
			const form = new ActionFormData();
			form.title(`script.gvcv5.how_to_gun.name`);
			form.body({ rawtext: createDesc(`howToGunDesc`,4) });
			form.button(`script.gvcv5.back.name`);
			form.show(user).then( result => {
				if ( !result.canceled ){
					user.runCommand(`scriptevent gvcv5:guide_gun 0`);
				}
			} )
		}
		else if( number == `2` ){
			const user = e.sourceEntity;
			const form = new ActionFormData();
			form.title(`script.gvcv5.show_guns.name`);
			for( const gunType of GUN_TYPES ){
				form.button(`script.gvcv5:gun_type.${gunType}.name`);
			}
			form.button(`script.gvcv5.back.name`);
			form.show(user).then( result => {
				if ( !result.canceled ){
					if( result.selection != GUN_TYPES.length ){
						print(`${GUN_TYPES[result.selection]}`)
						user.runCommand(`scriptevent gvcv5:guide_show_gun ${GUN_TYPES[result.selection]}`);
					}
					else{
						user.runCommand(`scriptevent gvcv5:guide_gun 0`);
					}
				}
			} )
		}
	}
	else if( e.id == "gvcv5:guide_show_gun" && !e.sourceEntity.hasTag(`down`) ){
		const message = e.message;
		const user = e.sourceEntity;
		if( message in gunGuide["gun_types"] ){
			const form = new ActionFormData();
			form.title(`script.gvcv5.guide_show_gun.name`);
			const target_guns = gunGuide["gun_types"][`${message}`];
			for( const gun of target_guns ){
				let itemRawText = [];
				print(`${gun[`name`]}`)
				itemRawText.push({ translate: `item.gun:${gun[`name`]}` });
				itemRawText.push({ text: `\n` });	
				itemRawText.push({ translate: `script.gvcv5:rarelity.name` });
				itemRawText.push({ translate: `script.gvcv5:rarelity_${gun[`rarelity`]}.name` });
				form.button({ rawtext: itemRawText },`textures/items/gun/${gun[`name`]}`);
			}
			form.button(`script.gvcv5.back.name`);
			form.show(user).then( result => {
				if ( !result.canceled ){
					if( result.selection != target_guns.length ){
						user.runCommand(`scriptevent gvcv5:guide_show_gun ${target_guns[result.selection][`name`]}`);
					}
					else{
						user.runCommand(`scriptevent gvcv5:guide_gun 2`);
					}
				}
			} )

		}
		else if( message in gunGuide ){
			const form = new ActionFormData();
			const gun = message;
			form.title(`item.gun:${gun}`);
			const gunData = gunGuide[`${gun}`]
			let itemRawText = [];
			itemRawText.push( { translate:`script.gvcv5:gun_spec.power.name` } );
			itemRawText.push({ translate: `script.gvcv5:gun_spec.desc.name` });
			itemRawText.push({ translate: `script.gvcv5:gun_spec.${gun}_desc.name` });
			itemRawText.push({ text: `\n\n` });
			itemRawText.push({ translate: `script.gvcv5:gun_spec.damage.name` });
			if( gunData[`shotgun`] > 1 ){
				itemRawText.push({ text: `${gunData[`damage`]} x ${gunData[`shotgun`]}\n` });
			}
			else{
				itemRawText.push({ text: `${gunData[`damage`]}\n` });
			}
			itemRawText.push({ translate: `script.gvcv5:gun_spec.basedps.name` });
			itemRawText.push({ text: `${(20 / (gunData[`interval`] + 1)) * gunData[`damage`] * gunData[`shotgun`]}\n` });
			itemRawText.push({ translate: `script.gvcv5:gun_spec.damageIgnoreDef.name` });
			itemRawText.push({ text: `${gunData[`damageIgnoreDef`]}\n` });
			itemRawText.push({ translate: `script.gvcv5:gun_spec.bomb.name` });
			itemRawText.push({ text: `${gunData[`bomb`]}\n` });
			itemRawText.push({ translate: `script.gvcv5:gun_spec.interval.name` });
			itemRawText.push({ text: `${gunData[`interval`]+1}\n` });
			itemRawText.push({ text: `\n` });
			
			itemRawText.push( { translate:`script.gvcv5:gun_spec.use.name` } );
			itemRawText.push({ translate: `script.gvcv5:gun_spec.speed.name` });
			itemRawText.push({ text: `${Math.floor(100*gunData[`speed`])/100}\n` });
			itemRawText.push({ translate: `script.gvcv5:gun_spec.recoil.name` });
			itemRawText.push({ text: `${Math.floor(100*gunData[`recoil`])/100}\n` });
			itemRawText.push({ translate: `script.gvcv5:gun_spec.slowness.name` });
			itemRawText.push({ text: `${gunData[`slowness`]}\n` });
			itemRawText.push({ translate: `script.gvcv5:gun_spec.maxGunAmmo.name` });
			itemRawText.push({ text: `${gunData[`maxGunAmmo`]}\n` });
			itemRawText.push({ translate: `script.gvcv5:gun_spec.fullauto.name` });
			itemRawText.push({ text: `${Boolean(gunData[`fullauto`] == 1)}\n` });
			itemRawText.push({ translate: `script.gvcv5:gun_spec.reloadTime.name` });
			itemRawText.push({ text: `${gunData[`reloadTime`]}\n` });
			itemRawText.push({ translate: `script.gvcv5:gun_spec.bullet.name` });
			itemRawText.push({ translate: `item.${gunData[`bullet`]}` });
			itemRawText.push({ text: `\n` });
			itemRawText.push({ translate: `script.gvcv5:gun_spec.damageType.name` });
			itemRawText.push({ text: `${Boolean(gunData[`damageType`])}\n` });
			itemRawText.push({ translate: `script.gvcv5:gun_spec.get.name` });
			itemRawText.push({ translate: `script.gvcv5:gun_spec.${gun}_get.name` });
			form.body({ rawtext: itemRawText });
			form.button(`script.gvcv5.back.name`);
			form.show(user).then( result => {
				if ( !result.canceled ){
					user.runCommand(`scriptevent gvcv5:guide_gun 2`);
				}
			} )

		}
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
},)