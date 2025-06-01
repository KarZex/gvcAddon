import { world, EquipmentSlot } from "@minecraft/server";

function gvcv5SpawnEvent( event ){
    if( world.getDynamicProperty(`gvcv5:doSpawnFromBlock`)){
        let spawn = event.block.typeId;
        const spawnLocation = event.block.location;
        if( spawn.includes(`addon`) ) {
            spawn = spawn.replace(`gvcv5:spawn_addon_`,`gvcv5:`);
            const spawner =  event.block.dimension.spawnEntity(spawn,{ x:spawnLocation.x, y:spawnLocation.y, z:spawnLocation.z });
            spawner.triggerEvent(`minecraft:spawned_from_block`);
            spawner.teleport({ x:spawnLocation.x+0.5, y:spawnLocation.y, z:spawnLocation.z+0.5 });
        }
        else if( spawn.includes(`vehicle`) ) {
            spawn = spawn.replace(`gvcv5:spawn_vehicle_`,`vehicle:`); 
            event.block.dimension.spawnEntity(spawn,{ x:spawnLocation.x, y:spawnLocation.y, z:spawnLocation.z }).teleport({ x:spawnLocation.x+0.5, y:spawnLocation.y, z:spawnLocation.z+0.5 });
        }
    }
    event.block.dimension.setBlockType(event.block.location,`minecraft:air`);
}

function gvcv5EndBlockEvent( event ){
    let building = event.block.typeId.replace(`gvcv5:structure_end_`,``);
    event.block.dimension.runCommand(`tickingarea remove ${building}`);
    event.block.dimension.setBlockType(event.block.location,`minecraft:air`);
}

function gvcv5BuildingBlockEvent( event ){
    let building = event.block.typeId.replace(`gvcv5:building_`,``);
    const buildingLocation = event.block.location;
    event.block.dimension.runCommand(`execute positioned ${buildingLocation.x} ${buildingLocation.y} ${buildingLocation.z} run function structure/${building}`);
    event.block.dimension.setBlockType(event.block.location,`minecraft:air`);
}

function gvcv5LootBlockEvent( event ){
    const type = event.block.typeId.replace(`gvcv5:`,``);
    const buildingLocation = event.block.location;
    const face = event.block.permutation.getState('minecraft:cardinal_direction');
    if( face == `north` ){
        event.block.dimension.runCommand(`setblock ${buildingLocation.x} ${buildingLocation.y} ${buildingLocation.z} chest [\"minecraft:cardinal_direction\"=\"south\"]`);
    }
    else if( face == `south` ){
        event.block.dimension.runCommand(`setblock ${buildingLocation.x} ${buildingLocation.y} ${buildingLocation.z} chest [\"minecraft:cardinal_direction\"=\"north\"]`);
    }
    else if( face == `west` ){
        event.block.dimension.runCommand(`setblock ${buildingLocation.x} ${buildingLocation.y} ${buildingLocation.z} chest [\"minecraft:cardinal_direction\"=\"east\"]`);
    }
    else if( face == `east` ){
        event.block.dimension.runCommand(`setblock ${buildingLocation.x} ${buildingLocation.y} ${buildingLocation.z} chest [\"minecraft:cardinal_direction\"=\"west\"]`);
    }
    if( type != `l0` ){
        event.block.dimension.runCommand(`loot insert ${buildingLocation.x} ${buildingLocation.y} ${buildingLocation.z} loot ${type}`);
    }
}

function gvcv5SpawnerEvent( event ){
    if( world.getDynamicProperty(`gvcv5:doSpawnFromBeacon`)){
        let spawn = event.block.typeId;
        const spawnLocation = event.block.location;
        if ( spawn.includes(`so`) ){
            event.block.dimension.spawnEntity(`gvcv5:ca`,{ x:spawnLocation.x+1, y:spawnLocation.y, z:spawnLocation.z+1 }).triggerEvent(`minecraft:spawned_from_block`);
            event.block.dimension.spawnEntity(`gvcv5:ca`,{ x:spawnLocation.x-1, y:spawnLocation.y, z:spawnLocation.z }).triggerEvent(`minecraft:spawned_from_block`);
            event.block.dimension.spawnEntity(`gvcv5:ca`,{ x:spawnLocation.x+1, y:spawnLocation.y, z:spawnLocation.z-1 }).triggerEvent(`minecraft:spawned_from_block`);
        }
        else {
            event.block.dimension.spawnEntity(`gvcv5:ga`,{ x:spawnLocation.x+1, y:spawnLocation.y, z:spawnLocation.z+1 }).triggerEvent(`minecraft:spawned_from_block`);
            event.block.dimension.spawnEntity(`gvcv5:ga`,{ x:spawnLocation.x-1, y:spawnLocation.y, z:spawnLocation.z }).triggerEvent(`minecraft:spawned_from_block`);
            event.block.dimension.spawnEntity(`gvcv5:ga`,{ x:spawnLocation.x+1, y:spawnLocation.y, z:spawnLocation.z-1 }).triggerEvent(`minecraft:spawned_from_block`);
        }
    }
}

function gvcv5UseCrafter( event ){
    const type = event.block.typeId.replace(`gvcv5:`,``);
    const player = event.player;
    player.runCommand(`scriptevent gvcv5:craft ${type}`);
}

function gvcv5GasEvent( event ){
    const buildingLocation = event.block.location;
    event.block.dimension.runCommand(`structure load poison ${buildingLocation.x} ${buildingLocation.y} ${buildingLocation.z}`);
}

function gvcv5BreakBlockEvent( event ){
    const spawnLocation = event.block.location;
    event.block.dimension.runCommand(`particle minecraft:large_explosion ${spawnLocation.x} ${spawnLocation.y} ${spawnLocation.z}`);
    event.block.dimension.runCommand(`playsound random.explode @a ${spawnLocation.x} ${spawnLocation.y} ${spawnLocation.z}`);
    event.block.dimension.setBlockType(spawnLocation,`minecraft:air`);
}

function gvcv5MineEvent( event ){
    const type = event.block.typeId.replace(`gvcv5:`,``);
    const entity = event.entity;
    const spawnLocation = event.block.location;
    if( entity.typeId.includes(`vehicle`) && type == `minet` ){
        event.block.dimension.spawnEntity(`addon:minet`,spawnLocation);
        event.block.dimension.setBlockType(spawnLocation,`minecraft:air`);
    }
    else if( type == `mine` ){
        event.block.dimension.spawnEntity(`addon:mineh`,spawnLocation);
        event.block.dimension.setBlockType(spawnLocation,`minecraft:air`);
    }
}

function gvcv5Phone( event ){
    event.source.runCommand(`function noteamphone`);
}

function gvcv5UseFlag( event ){
    event.source.runCommand(`function flag`);
}
function gvcv5UseMtype( event ){
    event.source.runCommand(`function mtype`);
}

function gvcv5UseAidKit( event ){
    event.source.addEffect("regeneration",14,{ amplifier: 4 })
}

world.beforeEvents.worldInitialize.subscribe( e => {
    if( world.getDynamicProperty("gvcv5:playerDamage") == undefined ){
        world.setDynamicProperty("gvcv5:playerDamage",0.5);
    }
    if( world.getDynamicProperty("gvcv5:mobDamage") == undefined ){
        world.setDynamicProperty("gvcv5:mobDamage",1);
    }
    if( world.getDynamicProperty("gvcv5:doBulletSpend") == undefined ){
        world.setDynamicProperty("gvcv5:doBulletSpend",true);
    }
    
    if( world.getDynamicProperty("gvcv5:doSpawnFromBeacon") == undefined ){
        world.setDynamicProperty("gvcv5:doSpawnFromBeacon",true);
    }
    if( world.getDynamicProperty("gvcv5:doSpawnFromBlock") == undefined ){
        world.setDynamicProperty("gvcv5:doSpawnFromBlock",true);
    }
    if( world.getDynamicProperty("gvcv5:worldLimit") == undefined ){
        world.setDynamicProperty("gvcv5:worldLimit",false);
    }
    if( world.getDynamicProperty(`gvcv5:worldLimitO`) == undefined ){
        world.setDynamicProperty(`gvcv5:worldLimitO`,2048);
    }
    if( world.getDynamicProperty(`gvcv5:worldLimitN`) == undefined ){
        world.setDynamicProperty(`gvcv5:worldLimitN`,2048);
    }
    if( world.getDynamicProperty(`gvcv5:worldLimitE`) == undefined ){
        world.setDynamicProperty(`gvcv5:worldLimitE`,512);
    }

    e.blockComponentRegistry.registerCustomComponent(`gvcv5:spawn`,{onPlace: gvcv5SpawnEvent});
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:end_block`,{onPlace: gvcv5EndBlockEvent});
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:building`,{onPlace: gvcv5BuildingBlockEvent});
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:lootblock`,{onPlace: gvcv5LootBlockEvent});
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:spawner`,{onRandomTick: gvcv5SpawnerEvent,onStepOn:gvcv5BreakBlockEvent});
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:crafter`,{onPlayerInteract: gvcv5UseCrafter});
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:gasevent`,{onStepOn: gvcv5GasEvent,onPlayerDestroy: gvcv5GasEvent});
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:mineevent`,{onStepOn: gvcv5MineEvent,onPlayerDestroy: gvcv5MineEvent});
    e.itemComponentRegistry.registerCustomComponent(`gvcv5:phone`,{onUse: gvcv5Phone});
    e.itemComponentRegistry.registerCustomComponent(`gvcv5:orderflag`,{onUse: gvcv5UseFlag});
    e.itemComponentRegistry.registerCustomComponent(`gvcv5:mtype`,{onUse: gvcv5UseMtype});
    e.itemComponentRegistry.registerCustomComponent(`gvcv5:aid`,{onConsume: gvcv5UseAidKit});
} )