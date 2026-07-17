import { world, system, EquipmentSlot, EntityComponentTypes,GameMode, EntityInitializationCause, ItemComponent, ItemComponentTypes, TicksPerSecond, EffectType, EffectTypes, EntityDamageCause, InputButton, ButtonState, LiquidType, InputPermissionCategory  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";
import { vehicleData } from "./vehicle";
import { absVector2,getVector2E,getEntityName,absVector3,Vector2Sub,isMoving,DistanceVector3,getUnderBlocksTo,Vector3Sub,getVector3E,Vector3Add,turning,turning2,DistanceVector3in2dim} from "./usefulFunction"

export const tankImmuneEntities = [
    `armor_stand`,
    `area_effect_cloud`,
    `item`,
    `xp_orb`
]

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

// 視線方向のコーン（円錐）範囲内のターゲットを探す
function findTargetInCone(player,entityOption,allies) {
    const headLocation = player.getHeadLocation();
    const viewDir = player.getViewDirection(); // 正規化されたベクトル (x, y, z)
	const DETECTION_ANGLE = Math.PI / 12; // ±30度 (約0.523ラジアン)

    // 周囲のエンティティを全取得（負荷軽減のため次元ベースで距離制限をかける）
    
	//const entities = player.dimension.getEntities(entityOption)
	const entities = world.getDimension("overworld").getEntities(entityOption)

    let closestTarget = null;

    for (const entity of entities) {
        // ターゲットへのベクトルを計算
        const entityLoc = entity.location;
        const toEntity = {
            x: entityLoc.x - headLocation.x,
            y: entityLoc.y - headLocation.y,
            z: entityLoc.z - headLocation.z
        };

        const distance = Math.sqrt(toEntity.x ** 2 + toEntity.y ** 2 + toEntity.z ** 2);
        if (distance === 0 ) continue;

        // ターゲットへの方向ベクトルを正規化
        const toEntityProj = {
            x: toEntity.x / distance,
            y: toEntity.y / distance,
            z: toEntity.z / distance
        };

        // 視線ベクトルとターゲットへのベクトルの内積を計算 (cosθ)
        const dotProduct = (viewDir.x * toEntityProj.x) + (viewDir.y * toEntityProj.y) + (viewDir.z * toEntityProj.z);
        
        // 内積から角度(ラジアン)を逆算
        const angle = Math.acos(Math.min(Math.max(dotProduct, -1), 1));

        // 角度が ±π/6 の範囲内か判定
        if (angle <= DETECTION_ANGLE) {
			const riders = entity.getComponent(EntityComponentTypes.Rideable).getRiders();
			if( (!world.scoreboard.getObjective(`maxsubcool`).hasParticipant(entity) || world.scoreboard.getObjective(`maxsubcool`).getScore(entity) <= 0 ) ){
				if( riders.length > 0  ){
					//print(`${riders[0].getComponent(EntityComponentTypes.TypeFamily).getTypeFamilies()} vs ${allies} `)
					if( !riders[0].getComponent(EntityComponentTypes.TypeFamily).getTypeFamilies().some( v => allies.includes(v) ) ){
						closestTarget = entity;
					}
				}
			}
        }
    }

    return closestTarget;
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

function Weapon( player,vehicle,selectedItemSlot ){
	let weapontext = ``;
	for( let i = 1; i <= 4; i++ ){
		//world.sendMessage(`§aSelected Slot Index: ${mtype}`);
		const Weapon = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon${i}`];
		const WeaponName = `{"translate":"gvcv5.${Weapon}.name"}`;
		const WeaponScore = world.scoreboard.getObjective(`weapon${i}`).getScore(player);
		const WeaponScoreMax = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon${i}_ammo`];
		const WeaponCool = world.scoreboard.getObjective(`weapon${i}_cool`).getScore(player);
		let TypeData = ``;
		if( selectedItemSlot == i-1){
			TypeData = `{"text":"§e"},`;
		}
		let WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax}§r\n"}`;
		if( WeaponCool <= 20 ){
			WeaponData = `{"text":": ${WeaponScore}/${WeaponScoreMax}§r\n"}`;
		}
		else if( WeaponCool > 20 ){
			WeaponData = `{"text":": §cCOOL ${WeaponCool}§r\n"}`;
		}

		if( Weapon == "aamissile" && selectedItemSlot == i-1 && WeaponCool == 0 && WeaponScore < WeaponScoreMax ){
			const intFamily = player.getComponent(`minecraft:type_family`).getTypeFamilies();
			const excludeList = [ "player","playerp","mod","mob" ];
			const allies = intFamily.filter(char => !excludeList.includes(char));
			const target = findTargetInCone(player,{families:["TofAA"],location:player.location,maxDistance:128},allies);
			if( target != null ){
				//maxsubcool
				if( world.scoreboard.getObjective(`lockon`).getScore(player) < 20 ){
					world.scoreboard.getObjective(`lockon`).addScore(player,1);
					WeaponData = `{"text":": §eLockOn.."},{"text":"${world.scoreboard.getObjective(`lockon`).getScore(player)}§r\n"}`
				}
				else{
					player.setDynamicProperty(`missileTarget`,target.id);
					WeaponData = `{"text":": §6TARGET FOUND§r"},{"text":"\n"}`
				}
				if( target.typeId == "minecraft:player" && !target.hasTag(`MissileAlert`) ){
					target.addTag(`MissileLockon`);
				}

				if( target.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 ){
					const p = target.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
					if( p.typeId == "minecraft:player" ){
						p.addTag("MissileLockon")
					}
				}

			}
			else{
				WeaponData = `{"text":": §cNO TARGET§r\n"}`
				world.scoreboard.getObjective(`lockon`).setScore(player,0);
				player.setDynamicProperty(`missileTarget`,undefined);
			}
			// if( targets.length > 0 ){
			// 	WeaponData = `{"text":": §eFIND TARGET§r\n"}`
			// }
			// else{
			// 	WeaponData = `{"text":": §cNO TARGET§r\n"}`
			// }
		}

		if( Weapon == "agmissile" && selectedItemSlot == i-1 && WeaponCool == 0 && WeaponScore < WeaponScoreMax ){
			const intFamily = player.getComponent(`minecraft:type_family`).getTypeFamilies();
			const excludeList = [ "player","playerp","mod","mob" ];
			const allies = intFamily.filter(char => !excludeList.includes(char));
			const target = findTargetInCone(player,{families:["tank"],location:player.location,maxDistance:128},allies);
			if( target != null ){
				//maxsubcool
				if( world.scoreboard.getObjective(`lockon`).getScore(player) < 20 ){
					world.scoreboard.getObjective(`lockon`).addScore(player,1);
					WeaponData = `{"text":": §eLockOn.."},{"text":"${world.scoreboard.getObjective(`lockon`).getScore(player)}§r\n"}`
				}
				else{
					player.setDynamicProperty(`missileTarget`,target.id);
					WeaponData = `{"text":": §6TARGET FOUND§r"},{"text":"\n"}`
				}
				if( target.typeId == "minecraft:player" && !target.hasTag(`MissileAlert`) ){
					target.addTag(`MissileLockon`);
				}

				if( target.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 ){
					const p = target.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
					if( p.typeId == "minecraft:player" ){
						p.addTag("MissileLockon")
					}
				}

			}
			else{
				WeaponData = `{"text":": §cNO TARGET§r\n"}`
				world.scoreboard.getObjective(`lockon`).setScore(player,0);
				player.setDynamicProperty(`missileTarget`,undefined);
			}
			// if( targets.length > 0 ){
			// 	WeaponData = `{"text":": §eFIND TARGET§r\n"}`
			// }
			// else{
			// 	WeaponData = `{"text":": §cNO TARGET§r\n"}`
			// }
		}

		weapontext += `${TypeData}${WeaponName},${WeaponData}`;
		if( i != 4 ){
			weapontext += `,`;
		}
	}
	return weapontext;
}

system.runInterval( () => {
	const overTanks = world.getDimension(`minecraft:overworld`).getEntities({families:[`land`]});
	const netherTanks = world.getDimension(`minecraft:nether`).getEntities({families:[`land`]});
	const endTanks = world.getDimension(`minecraft:the_end`).getEntities({families:[`land`]});
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
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 ){
			world.getDimension(`minecraft:overworld`).playSound(`sound.gvcv5.air`,t.location,{ volume:3 })
		}
	}
	for( let t of netherAirs ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0  ){
			world.getDimension(`minecraft:nether`).playSound(`sound.gvcv5.air`,t.location,{ volume:3 })
		}
	}
	for( let t of endAirs ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0  ){
			world.getDimension(`minecraft:the_end`).playSound(`sound.gvcv5.air`,t.location,{ volume:3 })
		}
	}
},5)
system.runInterval( () => {
	const overAirs = world.getDimension(`minecraft:overworld`).getEntities({families:[`heri`]});
	const netherAirs = world.getDimension(`minecraft:nether`).getEntities({families:[`heri`]});
	const endAirs = world.getDimension(`minecraft:the_end`).getEntities({families:[`heri`]});
	for( let t of overAirs ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 ){
			world.getDimension(`minecraft:overworld`).playSound(`sound.gvcv5.heri`,t.location,{ volume:3 })
		}
	}
	for( let t of netherAirs ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0  ){
			world.getDimension(`minecraft:nether`).playSound(`sound.gvcv5.heri`,t.location,{ volume:3 })
		}
	}
	for( let t of endAirs ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 ){
			world.getDimension(`minecraft:the_end`).playSound(`sound.gvcv5.heri`,t.location,{ volume:3 })
		}
	}
},5)

system.runInterval( () => {
	const overAirs = world.getDimension(`minecraft:overworld`).getEntities({families:[`ship`]});
	const netherAirs = world.getDimension(`minecraft:nether`).getEntities({families:[`ship`]});
	const endAirs = world.getDimension(`minecraft:the_end`).getEntities({families:[`ship`]});
	for( let t of overAirs ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 ){
			world.getDimension(`minecraft:overworld`).playSound(`sound.gvcv5.car`,t.location,{ volume:3 })
		}
	}
	for( let t of netherAirs ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0  ){
			world.getDimension(`minecraft:nether`).playSound(`sound.gvcv5.car`,t.location,{ volume:3 })
		}
	}
	for( let t of endAirs ){
		if( t.getComponent(EntityComponentTypes.Rideable).getRiders().length > 0 ){
			world.getDimension(`minecraft:the_end`).playSound(`sound.gvcv5.car`,t.location,{ volume:3 })
		}
	}
},5)

world.afterEvents.playerInteractWithEntity.subscribe( e => {
	if( e.target.typeId.includes(`vehicle:`) && !e.target.hasTag(`vehicle_lock`) ){
		e.target.triggerEvent(`vehicle_lock`);
	}
} )

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
					player.runCommand(`scriptevent zex:playerVreload`);
                    player.runCommand(`
                        titleraw @s[tag=!reload,tag=!down] 
                        actionbar {"rawtext":[${airCraftlader(player)},
                        {"text":"§f§rzex.gvc.v${Math.round(abs_v*20*100)/100}m/s\n"},
                        {"text":"HP: ${vehicleHp(HP,HPMax)}"},
                        ${Weapon(player,airCraft,selectedItemSlot)}
                        ]}
                    `);
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
		const vehicle = player.getComponent(EntityComponentTypes.Riding).entityRidingOn;
		const selectedItemSlot = player.selectedSlotIndex;
		let weaponNumber = 0;
		let bulletSpawn = false
		if( !player.hasTag(`reload`) ){
			weaponNumber = selectedItemSlot + 1;
			//world.sendMessage(`§aSelected Slot Index: ${selectedItemSlot}`);
			const weapon = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon${weaponNumber}`];

			if( weapon != `` && weaponNumber < 5 ){
				//world.sendMessage(`Fire Weapon${weaponNumber}!`);
				const weaponCool = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon${weaponNumber}_cool`];
				const weaponAmmo = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon${weaponNumber}_ammo`];
				if( world.scoreboard.getObjective(`weapon${weaponNumber}_cool`).getScore(player) <= 0 &&
					world.scoreboard.getObjective(`weapon${weaponNumber}`).getScore(player) < weaponAmmo ){
					if( weapon == `tankg` ){
						//world.sendMessage(`Fire Tank Gun!`);
						player.dimension.playSound(`random.anvil_land`,vehicle.location);
						vehicle.addEffect(`resistance`,100,{ amplifier:255, showParticles:true });
						world.scoreboard.getObjective(`maxsubcool`).setScore(vehicle,100);
						bulletSpawn = true;
					}
					else if( weapon == `aamissile` || weapon == `agmissile` ){
						if( player.getDynamicProperty(`missileTarget`) != undefined ){
							player.triggerEvent(`fire:${weapon}`);
							bulletSpawn = true;
						}
					}
					else if( weapon == `flare` ){
						world.scoreboard.getObjective(`maxsubcool`).setScore(player,100);
						world.scoreboard.getObjective(`maxsubcool`).setScore(vehicle,100);
						player.triggerEvent(`fire:${weapon}`);
						bulletSpawn = true;
					}
					else{
						player.triggerEvent(`fire:${weapon}`);
						bulletSpawn = true;
					}

					if( bulletSpawn ){
						world.scoreboard.getObjective(`weapon${weaponNumber}`).addScore(player,1);
						player.addTag(`weapon${weaponNumber}attack`);
						if( weaponCool > 0 ){
							world.scoreboard.getObjective(`weapon${weaponNumber}_cool`).setScore(player,weaponCool);
						}
					}
				}
			}
		}
	}
	else if( e.id == "zex:playerVreload" ){
		const player = e.sourceEntity;
		const vehicle = player.getComponent(EntityComponentTypes.Riding).entityRidingOn;
		const weapons = [  ]
		for( let i = 1; i <= 4; i++ ){
			const weapon = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon${i}`];
			const weaponAmmo = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon${i}_ammo`];
			const weaponCool = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`Weapon${i}_cool`];
			if( weapon != `` ){
				if( world.scoreboard.getObjective(`weapon${i}_cool`).getScore(player) > 0 ){
					world.scoreboard.getObjective(`weapon${i}_cool`).addScore(player,-1);
				}
				if( player.inputInfo.getButtonState(InputButton.Jump) == ButtonState.Released ){
					player.removeTag(`weapon${i}attack`);
				}
				if( !player.hasTag(`weapon${i}attack`) && world.scoreboard.getObjective(`weapon${i}`).getScore(player) > 0 ){
					//world.sendMessage(`§aReloading Weapon${world.scoreboard.getObjective(`weapon${i}_reload`).getScore(player)}...`);
					world.scoreboard.getObjective(`weapon${i}_reload`).addScore(player,1);
					if( world.scoreboard.getObjective(`weapon${i}_reload`).getScore(player) >= weaponCool * 2 ){
						world.scoreboard.getObjective(`weapon${i}`).addScore(player,-1);
						world.scoreboard.getObjective(`weapon${i}_reload`).setScore(player,0);
					}
				}
				else{
					const score = world.scoreboard.getObjective(`weapon${i}`).getScore(player);
					if( score >= weaponAmmo ){
						//world.sendMessage(`§aWeapon${i} is fully loaded! ${(weaponCool+1) * (weaponAmmo) * 2}`);
						player.removeTag(`weapon${i}attack`);
						world.scoreboard.getObjective(`weapon${i}_cool`).setScore(player,(weaponCool+1) * (weaponAmmo) * 2);
						world.scoreboard.getObjective(`weapon${i}`).setScore(player,0);
					}
				}
			}
		}
	}
	else if( e.id == "zex:playerNoRide" ){
		const player = e.sourceEntity;
		const isRide = player.getComponent(EntityComponentTypes.Riding) != undefined;
		if( !isRide ){
			for( let i = 1; i < 5; i++ ){
				world.scoreboard.getObjective(`weapon${i}_reload`).setScore(player,0);
				world.scoreboard.getObjective(`weapon${i}`).setScore(player,0);
				world.scoreboard.getObjective(`weapon${i}_cool`).setScore(player,0);
			}
		}
	}
	else if( e.id == "zex:vstart"){
		const entity = e.sourceEntity;
		const vehicle = entity.getComponent(EntityComponentTypes.Riding).entityRidingOn;
		if( vehicle.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`plate`) ){
			entity.addEffect(`resistance`,9999999,{ amplifier:255,showParticles:false });
		}

		if( entity.id == vehicle.getComponent(EntityComponentTypes.Rideable).getRiders()[0].id ){
			
			if( vehicle.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`TofAA`) ){
				entity.addTag(`air`);
			}

			if( entity.typeId == `minecraft:player` ){
				entity.addTag(`isRiding`);
				if( vehicle.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`tank`) ){
					entity.inputPermissions.setPermissionCategory(InputPermissionCategory.MoveLeft,false);
					entity.inputPermissions.setPermissionCategory(InputPermissionCategory.MoveRight,false);
				}
			}

			else{
				entity.triggerEvent(`${vehicleData[`${vehicle.typeId.split(`:`)[1]}`][`Weapon1`]}`);
				entity.addTag(`ride`);
			}
		}
	}
	else if( e.id == "zex:vend"){
		const entity = e.sourceEntity;
		entity.removeEffect(`resistance`);
		if( entity.typeId == `minecraft:player` ){
			entity.removeTag(`isRiding`);
			entity.inputPermissions.setPermissionCategory(InputPermissionCategory.MoveLeft,true);
			entity.inputPermissions.setPermissionCategory(InputPermissionCategory.MoveRight,true);
		}
		else{
			entity.triggerEvent(`gvcv5:set_have_gun_nt`);
			entity.removeTag(`ride`);
		}

		if( entity.hasTag(`air`) ){
			try{
				if(entity.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Chest).getItem() == undefined){
					const para = new ItemStack(`gvcv5:parachute`,1);
					entity.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Chest).setItem(para);
				}
			}catch{}
		}


		entity.removeTag(`air`);
	}
	else if( e.id == "zex:vtext"){
		const vehicle = e.sourceEntity;
		const player = vehicle.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
		//world.sendMessage(`§aSelected Slot Index: ${selectedItemSlot}`);
		if( player.typeId == "minecraft:player" ){
			const selectedItemSlot = player.selectedSlotIndex;
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
			player.runCommand(`scriptevent zex:playerVreload`);
			player.runCommand(`
				titleraw @s[tag=!reload,tag=!down] 
				actionbar {"rawtext":[{"text":"§f§rzex.gvc.v${Math.round(abs_v*20*100)/100}m/s\n"},
				{"text":"HP: ${vehicleHp(HP,HPMax)}"},
				${Weapon(player,vehicle,selectedItemSlot)}
				]}`
			);
		}
		// else if( player.hasTag(`raid`) && vehicle.hasTag(`is_enemy`) ){
		// 	vehicle.remove();
		// }
		else if( player.hasTag(`cantriding`) && vehicle.hasTag(`is_enemy`) ){
			vehicle.remove();
			player.removeTag(`cantriding`);
		}
	}
	else if( e.id == "zex:vship"){
		const vehicle = e.sourceEntity;
		const player = vehicle.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
		//world.sendMessage(`§aSelected Slot Index: ${selectedItemSlot}`);
		if( player.typeId == "minecraft:player" ){
			const selectedItemSlot = player.selectedSlotIndex;
			const attack = vehicleData[`${vehicle.typeId.replace("vehicle:","")}`][`gattack`];
			const turnRad = Number(vehicleData[`${vehicle.typeId.replace("vehicle:","")}`]["turn"]);
			
			//print(`jdt:${this_v} d.y:${d.y} v_dt:${v_dt}`); 
			//print(`${vehicle.dimension.getBlock({ x:vehicle.location.x,y:vehicle.location.y-1,z:vehicle.location.z }).typeId}`)
			if( vehicle.dimension.getBlock(vehicle.location).isLiquid || vehicle.dimension.getBlock(vehicle.location).isWaterlogged){

				vehicle.setRotation({ x:0,y:vehicle.getRotation().y-turnRad*player.inputInfo.getMovementVector().x })

				const r = vehicle.getRotation().y + 90;
				let Vi =  player.inputInfo.getMovementVector().y;
				const speed = vehicle.getComponent(EntityComponentTypes.Movement).defaultValue;
				//print(`${r}`);

				vehicle.clearVelocity();
				if( Vi < 0 ){
					Vi = Vi/4;
				}

				vehicle.applyImpulse({
					x: Math.cos(r*Math.PI/180) * Vi * speed,
					y:0,
					z: Math.sin(r*Math.PI/180) * Vi * speed
				})
			}
			else{
				vehicle.applyDamage(1)
			}
			let v = vehicle.getVelocity();
			let abs_v = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
			const HP = vehicle.getComponent(EntityComponentTypes.Health).currentValue;
			const HPMax = vehicle.getComponent(EntityComponentTypes.Health).defaultValue;
			let fuel = 0;
			let fuelSpendonThisTick = false;
			player.runCommand(`scriptevent zex:playerVreload`);
			player.runCommand(`
				titleraw @s[tag=!reload,tag=!down] 
				actionbar {"rawtext":[{"text":"§f§rzex.gvc.v${Math.round(abs_v*20*100)/100}m/s\n"},
				{"text":"HP: ${vehicleHp(HP,HPMax)}"},
				${Weapon(player,vehicle,selectedItemSlot)}
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
		const vehicle = e.sourceEntity;
		const player = vehicle.getComponent(EntityComponentTypes.Rideable).getRiders()[0];

		if( player.typeId == "minecraft:player" ){
			const selectedItemSlot = player.selectedSlotIndex;
			const HP = vehicle.getComponent(EntityComponentTypes.Health).currentValue;
			const HPMax = vehicle.getComponent(EntityComponentTypes.Health).defaultValue;
			const v = vehicle.getVelocity();
            const d = player.getRotation();
            let yup = 0;
			let xz = 0; //left:-1 right:1
            const V = vehicle.getComponent(EntityComponentTypes.Movement).defaultValue;
			const v_dt = Math.atan2(-v.x,v.z) * 180 / Math.PI;
			const jdt = v_dt - d.y;
			let x1=0,x2=0,z1=0,z2=0;

            let this_v = 0;

			if( vehicle.getDynamicProperty(`gvcv5:herispeed`) !== undefined ){
				this_v = vehicle.getDynamicProperty(`gvcv5:herispeed`);
			}
			//print(`jdt:${this_v} d.y:${d.y} v_dt:${v_dt}`); 
			if( player.inputInfo.getMovementVector().x > 0.5 ){
				xz = 1;
				vehicle.setProperty(`zex:move`, 1);
			}
			else if( player.inputInfo.getMovementVector().x < -0.5 ){
				xz = -1;
				vehicle.setProperty(`zex:move`, -1);
			}
			else{
				xz = 0;
				x2 = 0;
				z2 = 0;
				vehicle.setProperty(`zex:move`, 0);
			}

			//print(`${vehicle.getProperty(`zex:move`)} ${player.inputInfo.getMovementVector().x} ${player.inputInfo.getMovementVector().y}`);
			//up and fast
            if( player.inputInfo.getMovementVector().y > 0.5 ){
				if( d.x > 45 || d.x < -45 ){
					this_v = this_v + Math.sin(d.x*Math.PI/180)*0.1;
				}
				else{
					yup = 0.5
				}
            }

			//down and slow
            else if( player.inputInfo.getMovementVector().y < -0.5 ){
				if( d.x > 45 || d.x < -45 ){
					this_v = this_v + Math.sin(d.x*Math.PI/180)*-0.1;
				}
				else{
					yup = -0.5
				}
            }
			else{
				yup = 0;
				x1 = 0;
				z1 = 0;
			}

			if( this_v > V ){
				this_v = V;
			}
			else if( this_v < 0 ){
				this_v = 0;
			}
            //print(`${player.inputInfo.getMovementVector().x} ${player.inputInfo.getMovementVector().y}`);

            vehicle.clearVelocity();

			if( xz != 0 ){
				x2 = 0.75 * xz * this_v * Math.cos(d.y*Math.PI/180);
				z2 = 0.75 * xz * this_v * Math.sin(d.y*Math.PI/180);
			}

			x1 = -Math.sin(d.y*Math.PI/180) * this_v * Math.sin(d.x*Math.PI/180);
			z1 = Math.cos(d.y*Math.PI/180) * this_v * Math.sin(d.x*Math.PI/180);

            if( player.hasTag(`subattack`) ){
                this_v = 0;
            }
			else{
				vehicle.applyImpulse({
					x:x1+x2,
					y:yup,
					z:z1+z2
				})
				vehicle.setDynamicProperty(`gvcv5:herispeed`,this_v);
			}
			let abs_v = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
			player.runCommand(`scriptevent zex:playerVreload`);
			player.runCommand(`
				titleraw @s[tag=!reload,tag=!down] 
				actionbar {"rawtext":[${airCraftlader(player)},
				{"text":"§f§rzex.gvc.v${Math.round(abs_v*20*100)/100}m/s\n"},
				{"text":"HP: ${vehicleHp(HP,HPMax)}"},
				${Weapon(player,vehicle,selectedItemSlot)}
				]}
			`);
		}
		// else if( player.hasTag(`raid`) && vehicle.hasTag(`is_enemy`) ){
		// 	vehicle.remove();
		// }
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