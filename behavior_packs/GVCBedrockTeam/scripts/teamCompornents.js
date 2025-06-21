import { world, EquipmentSlot, system } from "@minecraft/server";


function gvcv5TeamSpawn( event ){
    const team = event.block.typeId.replace(`gvcv5:`,``).replace(`spawn`,``);
    const location = event.block.location;
    world.setDynamicProperty(`${team}Spawn`,{ x:location.x, y:location.y, z:location.z });
    world.sendMessage(`${team} spawn is changed`);
    event.block.dimension.setBlockType(event.block.location,`minecraft:air`);
}

function gvcv5JailSpawn( event ){
    let building = event.block.typeId.replace(`gvcv5:building_`,``);
    const buildingLocation = event.block.location;
    event.block.dimension.runCommand(`execute positioned ${buildingLocation.x} ${buildingLocation.y} ${buildingLocation.z} run function structure/${building}`);
    event.block.dimension.setBlockType(event.block.location,`minecraft:air`);
}

function gvcv5UsePhone( event ){
    event.source.runCommand(`function noteamphone`);
}

function gvcv5UseTeamPhone( event ){
    const team = event.itemStack.typeId.replace(`zex:phone_`,``);
    event.source.runCommand(`scriptevent gvcv5:phone_locked ${team}`);
}

function gvcv5UseTPBlock( event ){
    const type = event.block.typeId.replace(`gvcv5:spawn_`,``);
    const player = event.player;
    const item = player.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
    if( item.typeId.includes(`${type}`) ){
        player.runCommand(`scriptevent gvcv5:phone_set_tp_block ${type}`);
    }
}


system.beforeEvents.startup.subscribe( e => {
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:jail`,{onPlace: gvcv5JailSpawn});
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:spawnpoint`,{onPlace: gvcv5TeamSpawn});
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:tpblock`,{onPlayerInteract: gvcv5UseTPBlock});
    e.itemComponentRegistry.registerCustomComponent(`gvcv5:usephone`,{onUse: gvcv5UsePhone});
    e.itemComponentRegistry.registerCustomComponent(`gvcv5:teamphone`,{onUse: gvcv5UseTeamPhone});
});

world.afterEvents.worldLoad.subscribe( e => {
    world.sendMessage(`World loaded, setting up team properties...`);
    if( world.getDynamicProperty(`teamJail`) == undefined ){
        world.setDynamicProperty("teamJail",true);
    }
} )