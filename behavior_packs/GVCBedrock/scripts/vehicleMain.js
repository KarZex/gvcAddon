import { world, system, EquipmentSlot, EntityComponentTypes,GameMode, EntityInitializationCause, ItemComponent, ItemComponentTypes, TicksPerSecond, EffectType, EffectTypes, EntityDamageCause  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";
import { vehicleData } from "./vehicle";
import { absVector2,getVector2E,absVector3,isMoving,DistanceVector3,getUnderBlocksTo,Vector3Sub,getVector3E,Vector3Add,turning,turning2,DistanceVector3in2dim} from "./usefulFunction"

export const tankImmuneEntities = [
    `armor_stand`,
    `area_effect_cloud`,
    `item`,
    `xp_orb`
]

function getEnemies( player ){
    if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`SOVteam`) ){
        return [ `axis_soldier` ];
    }
    else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`GERteam`) ){
        return [ `allied_soldier` ];
    }
    else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`USAteam`) ){
        return [ `axis_soldier` ];
    }
    else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`JAPteam`) ){
        return [ `allied_soldier` ];
    }
    else if( player.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`ENGteam`) ){
        return [ `axis_soldier` ];
    }
}

function getInventoryItem(player,typeId){
	let c = 0
	for(let j = 0; j < 36; j++){
		let Haditem = player.getComponent("inventory").container.getItem(j);
		if( Haditem != undefined && Haditem.typeId == typeId ){
			c += player.getComponent("inventory").container.getItem(j).amount;
		}
	}
	return c;
}

function airCraftlader( player ){
	const V = player.getViewDirection();
	const P0 = player.location;
	const d0 = Math.atan2(V.z, V.x);
	let team = `noteam`;
	let print = [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ];
	if( player.hasTag(`red`) ){ team = `red`; }
	else if( player.hasTag(`blue`) ){ team = `blue`; }
	else if( player.hasTag(`green`) ){ team = `green`; }
	else if( player.hasTag(`yellow`) ){ team = `yellow`; }
	const allPlayers = world.getAllPlayers();
	for( let i of allPlayers ){
		const Pi = i.location;
		if( i.hasTag(`${team}`) || i.nameTag == player.nameTag || (!i.hasTag(`air`) && !i.hasTag(`heri`) )){
			continue;
		}
		const ri = Math.sqrt( (Pi.x - P0.x) * (Pi.x - P0.x) + (Pi.z - P0.z) * (Pi.z - P0.z) );
		const adi = Math.atan2((Pi.z - P0.z)/ri, (Pi.x - P0.x)/ri);
		const di = Math.atan2((Pi.z - P0.z)/ri, (Pi.x - P0.x)/ri) - d0;
		for( let j = 0; j < 21; j++ ){
			if( - Math.PI/2 + j * Math.PI / 21 <= di && di < - Math.PI/2 + (j + 1) * Math.PI / 21 ){
				if( 1024 <= ri && ri < 2048  && print[j] < 1 ){
					print[j] = 1;
				}
				else if( (512 <= ri && ri < 1024) && print[j] < 2 ){
					print[j] = 2;
				}
				else if( (256 <= ri && ri < 512) && print[j] < 3 ){
					print[j] = 3;
				}
				else if( (64 <= ri && ri < 256) && print[j] < 4 ){
					print[j] = 4;
				}
				else if( (ri < 64) && print[j] < 5 ){
					print[j] = 5;
				}

			}
		}

	}
	for( let j = 0; j < 21; j++ ){
		if( print[j] == 0 ){
			print[j] = `§7`;
		}
		else if( print[j] == 1 ){
			print[j] = `§f`;
		}
		else if( print[j] == 2 ){
			print[j] = `§e`;
		}
		else if( print[j] == 3 ){
			print[j] = `§g`;
		}
		else if( print[j] == 4 ){
			print[j] = `§6`;
		}
		else if( print[j] == 5 ){
			print[j] = `§4`;
		}
	}
	return `{"text":"${print[0]}|${print[1]}|${print[2]}|${print[3]}|${print[4]}|${print[5]}|${print[6]}|${print[7]}|${print[8]}|${print[9]}| ${print[10]}${Math.floor(-180*d0/Math.PI)} ${print[11]}|${print[12]}|${print[13]}|${print[14]}|${print[15]}|${print[16]}|${print[17]}|${print[18]}|${print[19]}|${print[20]}|\n"}`;
}

function vehicleHp( HP,HPMax ){
	let hpbar = ``;
	if( HP >= HPMax * 0.5 ){
		hpbar = `§a${Math.floor(HP)}/${Math.floor(HPMax)}§r\n`;
	}
	else if( HP >= HPMax * 0.25 ){
		hpbar = `§g${Math.floor(HP)}/${Math.floor(HPMax)}§r\n`;
	}
	else{
		hpbar = `§4${Math.floor(HP)}/${Math.floor(HPMax)}§r\n`;
	}
	return hpbar;
}

function Weapon1( player,vehicle,mtype ){
	//world.sendMessage(`§aSelected Slot Index: ${mtype}`);
	const Weapon = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon1`];
	const WeaponName = `{"translate":"gvcv5.${Weapon}.name"}`;
	const WeaponScore = world.scoreboard.getObjective(`weaponi`).getScore(player);
	const WeaponScoreMax = world.scoreboard.getObjective(`weaponi_max`).getScore(player);
	const WeaponCool = world.scoreboard.getObjective(`weaponi_cool`).getScore(player);
	let TypeData = ``;
	if( mtype == 0){
		TypeData = `{"text":"§e"},`;
	}
	let WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax}§r\n"}`;
	if( WeaponCool <= 20 ){
		WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax}§r\n"}`;
	}
	else if( WeaponCool > 20 ){
		WeaponData = `{"text":": §cCOOL ${WeaponCool}§r\n"}`;
	}
	return `${TypeData}${WeaponName},${WeaponData}`;
}
function Weapon2( player,vehicle,mtype ){
	const Weapon = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon2`];
	const WeaponName = `{"translate":"gvcv5.${Weapon}.name"}`;
	const WeaponScore = world.scoreboard.getObjective(`weaponii`).getScore(player);
	const WeaponScoreMax = world.scoreboard.getObjective(`weaponii_max`).getScore(player);
	const WeaponCool = world.scoreboard.getObjective(`weaponii_cool`).getScore(player);
	let TypeData = ``;
	if( mtype == 1){
		TypeData = `{"text":"§e"},`;
		if( Weapon == `` ){
			world.scoreboard.getObjective(`mtype`).setScore(player,0);
		}
	}
	let WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax}§r\n"}`;
	if( WeaponCool <= 20 ){
		WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax}§r\n"}`;
	}
	else if( WeaponCool > 20 ){
		WeaponData = `{"text":": §cCOOL ${WeaponCool}§r\n"}`;
	}
	return `${TypeData}${WeaponName},${WeaponData}`;
}
function Weapon3( player,vehicle,mtype ){
	const Weapon = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon3`];
	const WeaponName = `{"translate":"gvcv5.${Weapon}.name"}`;
	const WeaponScore = world.scoreboard.getObjective(`weaponiii`).getScore(player);
	const WeaponScoreMax = world.scoreboard.getObjective(`weaponiii_max`).getScore(player);
	const WeaponCool = world.scoreboard.getObjective(`weaponiii_cool`).getScore(player);
	let TypeData = ``;
	if( mtype == 2){
		TypeData = `{"text":"§e"},`;
		if( Weapon == `` ){
			world.scoreboard.getObjective(`mtype`).setScore(player,0);
		}
	}
	let WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax}§r\n"}`;
	if( WeaponCool <= 20 ){
		WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax}§r\n"}`;
	}
	else if( WeaponCool > 20 ){
		WeaponData = `{"text":": §cCOOL ${WeaponCool}§r\n"}`;
	}
	return `${TypeData}${WeaponName},${WeaponData}`;
}
function Weapon4( player,vehicle,mtype ){
	const Weapon = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon4`];
	const WeaponName = `{"translate":"gvcv5.${Weapon}.name"}`;
	const WeaponScore = world.scoreboard.getObjective(`weaponiv`).getScore(player);
	const WeaponScoreMax = world.scoreboard.getObjective(`weaponiv_max`).getScore(player);
	const WeaponCool = world.scoreboard.getObjective(`weaponiv_cool`).getScore(player);
	let TypeData = ``;
	if( mtype == 3){
		TypeData = `{"text":"§e"},`;
		if( Weapon == `` ){
			world.scoreboard.getObjective(`mtype`).setScore(player,0);
		}
	}
	let WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax}§r\n"}`;
	if( WeaponCool <= 20 ){
		WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax}§r\n"}`;
	}
	else if( WeaponCool > 20 ){
		WeaponData = `{"text":": §cCOOL ${WeaponCool}§r\n"}`;
	}
	return `${TypeData}${WeaponName},${WeaponData}`;
}

system.runInterval( () => {
	const overTanks = world.getDimension(`minecraft:overworld`).getEntities({families:[`plate`]});
	const netherTanks = world.getDimension(`minecraft:nether`).getEntities({families:[`plate`]});
	const endTanks = world.getDimension(`minecraft:the_end`).getEntities({families:[`plate`]});
	for( let t of overTanks ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 && isMoving(t) ){
			world.getDimension(`minecraft:overworld`).playSound(`sound.gvcv5.tank`,t.location,{ volume:8 })
		}
	}
	for( let t of netherTanks ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 && isMoving(t) ){
			world.getDimension(`minecraft:nether`).playSound(`sound.gvcv5.tank`,t.location,{ volume:8 })
		}
	}
	for( let t of endTanks ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 && isMoving(t) ){
			world.getDimension(`minecraft:the_end`).playSound(`sound.gvcv5.tank`,t.location,{ volume:8 })
		}
	}
},16)
system.runInterval( () => {
	const overAirs = world.getDimension(`minecraft:overworld`).getEntities({families:[`air`]});
	const netherAirs = world.getDimension(`minecraft:nether`).getEntities({families:[`air`]});
	const endAirs = world.getDimension(`minecraft:the_end`).getEntities({families:[`air`]});
	for( let t of overAirs ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 && isMoving(t) ){
			world.getDimension(`minecraft:overworld`).playSound(`sound.gvcww2.air`,t.location,{ volume:8 })
		}
	}
	for( let t of netherAirs ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 && isMoving(t)  ){
			world.getDimension(`minecraft:nether`).playSound(`sound.gvcww2.air`,t.location,{ volume:8 })
		}
	}
	for( let t of endAirs ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 && isMoving(t)  ){
			world.getDimension(`minecraft:the_end`).playSound(`sound.gvcww2.air`,t.location,{ volume:8 })
		}
	}
},7)

system.afterEvents.scriptEventReceive.subscribe( async e => {
	if( e.id == "zex:air"){
		const airCraft = e.sourceEntity;
        const Hasrider = Boolean(airCraft.getComponent(EntityComponentTypes.Rideable).getRiders()[0] != undefined)
		if( Hasrider ){
			const maxSpeed = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue;
			const player = airCraft.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
            if( player.typeId == "minecraft:player" ){
                let v = airCraft.getVelocity();
                let abs_v = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
                const turnRad = Number(vehicleData[`${airCraft.typeId.replace("vehicle:","")}`]["turn"]) * Math.PI / 180;
                const HP = airCraft.getComponent(EntityComponentTypes.Health).currentValue;
                const HPMax = airCraft.getComponent(EntityComponentTypes.Health).defaultValue;
				const selectedItemSlot = player.selectedSlotIndex;
                let r = {
                    x:v.x/abs_v,
                    y:v.y/abs_v,
                    z:v.z/abs_v
                }
                if( abs_v > maxSpeed ){
                    abs_v = maxSpeed
                }

                if( abs_v < 0.1 ){
                    abs_v = 0
                }
                else{
                    let d = player.getViewDirection();
                    airCraft.clearVelocity();
                    d = turning(d,r,turnRad);
                    if( world.getDynamicProperty(`gvcv5:worldLimit`) && airCraft.dimension.id == `minecraft:overworld` ){
                        
                        if( airCraft.location.x > world.getDynamicProperty(`gvcv5:worldLimitO`)/2 && d.x > 0 ){
                            d.x = 0;
                        }
                        if( airCraft.location.x < -world.getDynamicProperty(`gvcv5:worldLimitO`)/2 && d.x < 0 ){
                            d.x = 0;
                        }
                        if( airCraft.location.y > 320 && d.y > 0 ){
                            d.y = 0;
                        }
                        if( airCraft.location.y < -64 && d.y < 0 ){
                            d.y = 0;
                        }
                        if( airCraft.location.z > world.getDynamicProperty(`gvcv5:worldLimitO`)/2 && d.z > 0 ){
                            d.z = 0;
                        }
                        if( airCraft.location.z < -world.getDynamicProperty(`gvcv5:worldLimitO`)/2 && d.z < 0 ){
                            d.z = 0;
                        }

                    }
                    else if( world.getDynamicProperty(`gvcv5:worldLimit`) && airCraft.dimension.id == `minecraft:nether` ){
                        if( airCraft.location.x > world.getDynamicProperty(`gvcv5:worldLimitN`)/2 && d.x > 0 ){
                            d.x = 0;
                        }
                        if( airCraft.location.x < -world.getDynamicProperty(`gvcv5:worldLimitN`)/2 && d.x < 0 ){
                            d.x = 0;
                        }
                        if( airCraft.location.y > 128 && d.y > 0 ){
                            d.y = 0;
                        }
                        if( airCraft.location.y < 0 && d.y < 0 ){
                            d.y = 0;
                        }
                        if( airCraft.location.z > world.getDynamicProperty(`gvcv5:worldLimitN`)/2 && d.z > 0 ){
                            d.z = 0;
                        }
                        if( airCraft.location.z < -world.getDynamicProperty(`gvcv5:worldLimitN`)/2 && d.z < 0 ){
                            d.z = 0;
                        }

                    }
                    airCraft.applyImpulse({x:d.x*abs_v,y:d.y*abs_v,z:d.z*abs_v});
                    player.runCommand(`
                        titleraw @s[tag=!reload,tag=!down] 
                        actionbar {"rawtext":[${airCraftlader(player)},
                        {"text":"§f§rzex.gvc.v${Math.round(abs_v*20*100)/100}m/s\n"},
                        {"text":"HP: ${vehicleHp(HP,HPMax)}"},
                        ${Weapon1(player,airCraft,selectedItemSlot)},
                        ${Weapon2(player,airCraft,selectedItemSlot)},
                        ${Weapon3(player,airCraft,selectedItemSlot)},
                        ${Weapon4(player,airCraft,selectedItemSlot)}
                        ]}
                    `);
                }
            }
            else if( !player.hasTag(`has_target`) ){
                player.setDynamicProperty(`PreY`,undefined);
                let v = airCraft.getVelocity();
                let abs_v = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue;
                let r = getVector3E(v);
                if( absVector3(v) < 0.01 ){
                    v = airCraft.getViewDirection();
                    r = v;
                }
                const turnRad = Number(vehicleData[`${airCraft.typeId.replace("vehicle:","")}`]["turn"]) * Math.PI / 180;
                if( airCraft.getDynamicProperty(`gvcww2:Origin`) == undefined ){
                    airCraft.setDynamicProperty(`gvcww2:Origin`,airCraft.location);
                }
                let P_0 = airCraft.getDynamicProperty(`gvcww2:Origin`);
                const P = airCraft.location;
                if( player.getDynamicProperty(`targetId`) != undefined ){
                    try{
                        P_0 = player.getDynamicProperty(`targetlocation`)
                    }catch{}
                    
                }
                if(player.getDynamicProperty(`gvcww2:PreFlydirection`) == undefined ){
                    player.setDynamicProperty(`gvcww2:PreFlydirection`,player.getViewDirection());
                }

                if( DistanceVector3(P_0,P) <= 36 ){
                    let d = player.getViewDirection();
                    const r = player.getDynamicProperty(`gvcww2:PreFlydirection`);
                    d = turning2(d,r,Math.PI/36);
                    const underBlocksRatio = getUnderBlocksTo(airCraft.dimension,P,24,`minecraft:air`);
                    if( underBlocksRatio < 1 ){
                        d.y = 1-underBlocksRatio;
                    }
                    //rotate.y = setTruedeg(rotate.y);
                    abs_v = absVector3(d) * airCraft.getComponent(EntityComponentTypes.Movement).defaultValue;
                    airCraft.clearVelocity();
                    player.setDynamicProperty(`gvcww2:PreFlydirection`,d)
                    airCraft.applyImpulse({x:d.x*abs_v,y:d.y*abs_v,z:d.z*abs_v});
                }
                else if( DistanceVector3(P_0,P) > 36 ){
                    player.setDynamicProperty(`gvcww2:rotatey`,undefined)
                    const r = player.getDynamicProperty(`gvcww2:PreFlydirection`);
                    const P_target = Vector3Sub(P,P_0);
                    const P_target_E = getVector3E(P_target);
                    let d = turning2(P_target_E,r,Math.PI/36);
                    const underBlocksRatio = getUnderBlocksTo(airCraft.dimension,P,24,`minecraft:air`);
                    if( underBlocksRatio < 1 ){
                        d.y = 1-underBlocksRatio;
                    }
                    //rotate.y = setTruedeg(rotate.y);
                    abs_v = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue / absVector3(d);
                    player.lookAt(Vector3Add(player.location,d));
                    airCraft.lookAt(Vector3Add(player.location,d));
                    player.setDynamicProperty(`gvcww2:PreFlydirection`,d)
                    airCraft.clearVelocity();
                    airCraft.applyImpulse({x:d.x*abs_v,y:d.y*abs_v,z:d.z*abs_v});
                }

                //search target
                const target1 = player.dimension.getEntities({ excludeGameModes:["Spectator","Creative"],type:`player`,families:getEnemies(player),closest:1,location:player.location,maxDistance:120 });
                const target2 = player.dimension.getEntities({ excludeTypes:[`player`],families:getEnemies(player),closest:1,location:player.location,maxDistance:120 });
                const target = target1.concat(target2)[0];
                if( target != undefined ){
                    //print(`Find target! ${target.id}`)
                    player.applyDamage(1,{ cause:EntityDamageCause.entityAttack,damagingEntity:target });
                    player.setDynamicProperty(`targetId`,target.id);
                    player.setDynamicProperty(`targetlocation`,target.location)
                }
                

            }
            else if( player.hasTag(`has_target`) ){
                let v = airCraft.getVelocity();
                let abs_v = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue;
                let r = {
                    x:v.x/abs_v,
                    y:v.y/abs_v,
                    z:v.z/abs_v
                }
                if( absVector3(v) < 0.01 ){
                    v = player.getViewDirection();
                    r = v;
                }
                const turnRad = Number(vehicleData[`${airCraft.typeId.replace("vehicle:","")}`]["turn"]) * Math.PI / 180;
                const P = airCraft.location;
                
                if(player.getDynamicProperty(`gvcww2:PreFlydirection`) == undefined ){
                    player.setDynamicProperty(`gvcww2:PreFlydirection`,player.getViewDirection());
                }

                if( player.getDynamicProperty(`targetId`) != undefined ){
                    const target = world.getEntity(player.getDynamicProperty(`targetId`));
                    if( target != undefined ){
                        player.setDynamicProperty(`targetlocation`,target.location)
                        const P_0 = target.location;
                        const P_target = Vector3Sub(P,P_0);
                        const P_target_E = getVector3E(P_target);
                        const H = Math.sqrt(P_0.x*P_0.x + P_0.z*P_0.z);
                        
                        if( DistanceVector3in2dim(P_0,P) <= 24 && !player.getDynamicProperty(`gvcww2:attackend`) ){
                            const r = player.getDynamicProperty(`gvcww2:PreFlydirection`);
                            const b = airCraft.getViewDirection();
                            let d = turning2(P_target_E,r,turnRad);
                            if( DistanceVector3in2dim(P_0,P) < 12 ){
                                player.setDynamicProperty(`gvcww2:attackend`,true);
                            }
                            
                            const underBlocksRatio = getUnderBlocksTo(airCraft.dimension,P,12,`minecraft:air`);
                            if( underBlocksRatio < 1 ){
                                d.y = 1-underBlocksRatio;
                            }
                            //rotate.y = setTruedeg(rotate.y);
                            airCraft.clearVelocity();
                            player.lookAt(P_0);
                            airCraft.lookAt(P_0);
                            player.setDynamicProperty(`gvcww2:PreFlydirection`,d)
                            const abs_v_xz = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue * 0.5 / absVector2(d);
                            const abs_v_y = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue * 0.5;
                            airCraft.applyImpulse({x:d.x*abs_v_xz,y:d.y*abs_v_y,z:d.z*abs_v_xz});
                        }
                        else if( DistanceVector3in2dim(P_0,P) > 24 && !player.getDynamicProperty(`gvcww2:attackend`) ){
                            const b = airCraft.getViewDirection();
                            let thita;
                            let d = turning2(P_target_E,r,turnRad/3);
                            const underBlocksRatio = getUnderBlocksTo(airCraft.dimension,P,12,`minecraft:air`);
                            if( underBlocksRatio < 1 ){
                                d.y = 1-underBlocksRatio;
                            }
                            //rotate.y = setTruedeg(rotate.y);
                            abs_v = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue;
                            player.lookAt(Vector3Add(player.location,d));
                            airCraft.lookAt(Vector3Add(player.location,d));
                            player.setDynamicProperty(`gvcww2:PreFlydirection`,d)
                            airCraft.clearVelocity();
                            airCraft.applyImpulse({x:d.x*abs_v,y:d.y*abs_v,z:d.z*abs_v});
                        }
                        else if( player.getDynamicProperty(`gvcww2:attackend`) ){
                            const r = getVector2E(player.getDynamicProperty(`gvcww2:PreFlydirection`));
                            let d = getVector2E(r);
                            d = turning2(d,r,Math.PI/36);
                            const underBlocksRatio = getUnderBlocksTo(airCraft.dimension,P,24,`minecraft:air`);
                            if( underBlocksRatio < 1 ){
                                d.y = 1-underBlocksRatio;
                            }
                            //rotate.y = setTruedeg(rotate.y);
                            abs_v = absVector3(d) * airCraft.getComponent(EntityComponentTypes.Movement).defaultValue;
                            airCraft.clearVelocity();
                            player.lookAt(Vector3Add(player.location,d));
                            airCraft.lookAt(Vector3Add(player.location,d));
                            player.setDynamicProperty(`gvcww2:PreFlydirection`,d)
                            airCraft.applyImpulse({x:d.x*abs_v,y:d.y*abs_v,z:d.z*abs_v});
                            if( DistanceVector3in2dim(P_0,P) > 36 ){
                                player.setDynamicProperty(`gvcww2:attackend`,false);
                            }
                        }
                    }
                }
                else{
                    //search target
                    const target1 = player.dimension.getEntities({ excludeGameModes:["Spectator","Creative"],type:`player`,families:getEnemies(player),closest:1,location:player.location,maxDistance:120 });
                    const target2 = player.dimension.getEntities({ excludeTypes:[`player`],families:getEnemies(player),closest:1,location:player.location,maxDistance:120 });
                    const target = target1.concat(target2)[0];
                    if( target != undefined ){
                        //print(`Find target! ${target.id}`)
                        player.applyDamage(1,{ cause:EntityDamageCause.entityAttack,damagingEntity:target });
                        player.setDynamicProperty(`targetId`,target.id);
                    }
                }

            }
		}
	

	}
	else if( e.id == "zex:playerRotation" ){
		let player = e.sourceEntity;
		let rotation = e.message.split(" ");
		world.sendMessage(`§aX:${rotation[0]} Y:${rotation[1]}`);
		player.setRotation({x: Number(rotation[0]), y: Number(rotation[1])});
		//player.teleport( player.location, {rotation: {x: Number(rotation[0]), y: Number(rotation[1])} } );
	}
	else if( e.id == "zex:playerVfire" ){
		const player = e.sourceEntity;
		const selectedItemSlot = player.selectedSlotIndex;
		if( !player.hasTag(`reload`) ){
			if( selectedItemSlot == 0 && world.scoreboard.getObjective(`weaponi_cool`).getScore(player) <= 0 ){
				player.runCommand(`function weaponi`);
			}
			else if( selectedItemSlot == 1 && world.scoreboard.getObjective(`weaponii_cool`).getScore(player) <= 0 ){
				player.runCommand(`function weaponii`);
			}
			else if( selectedItemSlot == 2 && world.scoreboard.getObjective(`weaponiii_cool`).getScore(player) <= 0 ){
				player.runCommand(`function weaponiii`);
			}
			else if( selectedItemSlot == 3 && world.scoreboard.getObjective(`weaponiv_cool`).getScore(player) <= 0 ){
				player.runCommand(`function weaponiv`);
			}
		}
	}
	else if( e.id == "zex:vtext"){
		const vehicle = e.sourceEntity;
		const player = vehicle.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
		const selectedItemSlot = player.selectedSlotIndex;
		//world.sendMessage(`§aSelected Slot Index: ${selectedItemSlot}`);
		if( player.typeId == "minecraft:player" ){
			const attack = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`gattack`];
			const V = vehicle.dimension.getEntities({maxDistance:3,location:vehicle.location,excludeTypes:tankImmuneEntities,excludeNames:[`${player.nameTag}`],excludeFamilies:[`bullet`,`vehicle`]});
			if( V.length > 0 ){
				for( let vict of V ){
					vict.applyDamage(attack,{damagingEntity:player,cause:EntityDamageCause.entityAttack});
				}
			}
			let v = vehicle.getVelocity();
			let abs_v = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
			const HP = vehicle.getComponent(EntityComponentTypes.Health).currentValue;
			const HPMax = vehicle.getComponent(EntityComponentTypes.Health).defaultValue;
			let fuel = 0;
			let fuelSpendonThisTick = false;
			player.runCommand(`titleraw @s[tag=!reload,tag=!down] actionbar 
				{"rawtext":[{"text":"§f§rzex.gvc.v${Math.round(abs_v*20*100)/100}m/s\n"},
				{"text":"HP: ${vehicleHp(HP,HPMax)}"},
				${Weapon1(player,vehicle,selectedItemSlot)},
				${Weapon2(player,vehicle,selectedItemSlot)},
				${Weapon3(player,vehicle,selectedItemSlot)},
				${Weapon4(player,vehicle,selectedItemSlot)}
				]}`
			);
		}
		else if( player.hasTag(`raid`) && vehicle.hasTag(`is_enemy`) ){
			vehicle.remove();
		}
		else if( player.hasTag(`cantriding`) && vehicle.hasTag(`is_enemy`) ){
			vehicle.remove();
			player.removeTag(`cantriding`);
		}
	}
	else if( e.id == "zex:vheri"){
		let vehicle = e.sourceEntity;
		const player = vehicle.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
		if( player.typeId == "minecraft:player" ){
			const selectedItemSlot = player.selectedSlotIndex;
			const v = vehicle.getVelocity();
            const d = player.getRotation();
            let yup = 0;
            const V = 1.0;
            if( absVector2(v) / Math.abs(vehicle.getDynamicProperty(`gvcv5:herispeed`)) > V +0.03 ){
                yup = 0.5;
            }
            else if( absVector2(v) / Math.abs(vehicle.getDynamicProperty(`gvcv5:herispeed`)) < V -0.01 ){
                yup = -0.5;
            }
            //print(`${yup}`)

            vehicle.clearVelocity();
            let this_v = V;
            if( player.hasTag(`subattack`) ){
                this_v = 0;
            }
			else{
				vehicle.applyImpulse({
					x:-Math.sin(d.y*Math.PI/180) * this_v * Math.sin(d.x*Math.PI/180),
					y:yup,
					z:Math.cos(d.y*Math.PI/180) * this_v * Math.sin(d.x*Math.PI/180),
				})
				vehicle.setDynamicProperty(`gvcv5:herispeed`,Math.sin(d.x*Math.PI/180));
			}
			let abs_v = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
			player.runCommand(
                `titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[
                {"text":"§f§rzex.gvc.v${Math.round(abs_v*20*100)/100}m/s\n"},
				${Weapon1(player,vehicle,selectedItemSlot)},
				${Weapon2(player,vehicle,selectedItemSlot)},
				${Weapon3(player,vehicle,selectedItemSlot)},
				${Weapon4(player,vehicle,selectedItemSlot)}
				]}`
            );
		}
		else if( player.hasTag(`raid`) && vehicle.hasTag(`is_enemy`) ){
			vehicle.remove();
		}
		else if( player.hasTag(`cantriding`) && vehicle.hasTag(`is_enemy`) ){
			vehicle.remove();
			player.removeTag(`cantriding`);
		}
        /*
		else if( player.target != undefined ){
			let abs_v = vehicle.getComponent(EntityComponentTypes.Movement).defaultValue;
			vehicle.clearVelocity();
			const P_t = player.target.location;
			const P_v = vehicle.location;
			const target = {
				x: P_t.x - P_v.x,
				y: P_t.y - P_v.y,
				z: P_t.z - P_v.z
			}
			const distance = Math.sqrt(target.x*target.x + target.y*target.y + target.z*target.z);
			const E_target = {
				x: (P_t.x - P_v.x)/distance,
				y: (P_t.y - P_v.y)/distance,
				z: (P_t.z - P_v.z)/distance
			}
			const H = Math.sqrt(E_target.x*E_target.x + E_target.z*E_target.z);
			const rotate = {
				x: -Math.asin(E_target.y) * 180 / Math.PI,
				y: Math.atan2(E_target.z/H, E_target.x/H) * 180 / Math.PI
			}
			player.setRotation({x: rotate.x, y: rotate.y-90});
			if( distance > 16 ){
				let fly = 0.25;
				if( vehicle.isOnGround ){ fly = 10; }
				vehicle.applyImpulse({x:E_target.x*abs_v,y:E_target.y*abs_v+fly,z:E_target.z*abs_v});
			}

		}
        */
		else if( player.target == undefined ){
			vehicle.clearVelocity();
			let fly = 0;
			if( vehicle.isOnGround ){ fly = 10; }
			vehicle.applyImpulse({x:0,y:fly,z:0});
		}
	}
	else if( e.id == "zex:test" ){
		const player = e.sourceEntity;
		const a = Infinity;
		player.setDynamicProperty(`gvcv5:gunUsed`,0);
	}
	else if( e.id == "zex:chkride"){
		if( world.getDynamicProperty(`gvcv5:airCraftWithItem`) ){
			const airCraft = e.sourceEntity;
			const p = airCraft.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
			let noItem = true;
			for(let i = 0; i < 36; i++){
				let Haditem = p.getComponent("inventory").container.getItem(i);
				if( Haditem != undefined && Haditem.typeId != "minecraft:air" ){
					airCraft.runCommand(`ride @s evict_riders`);
					noItem = false;
					p.sendMessage(`§cYou can't ride this vehicle with items!`);
					p.runCommand(`clear @s minecraft:barrier`);
					break;
				}
			}
			if( noItem ){
				for(let i = 0; i < 36; i++){
					p.runCommand(`replaceitem entity @s slot.inventory ${i} gun:no 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				}
				p.addTag(`onAir`);
				p.runCommand(`give @s gun:mgg 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s gun:tank 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s gun:camera 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s zex:mtype 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s spyglass 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s gun:no 4 0 {"item_lock": { "mode": "lock_in_slot" } }`);
			}
		}
	}
},)