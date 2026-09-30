import { world, EquipmentSlot, system } from "@minecraft/server";
import { absVector2, getTeam,DistanceVector3in2dim } from "./usefulFunction"


function gvcv5TeamSpawn( event ){
    const team = getTeam(event.player);
    const location = event.block.location;
    system.runTimeout( async () => {
        world.setDynamicProperty(`${team}Spawn`,{ x:location.x, y:location.y, z:location.z });
        world.sendMessage(`${team} spawn is changed`);
        event.block.dimension.setBlockType(event.block.location,`minecraft:air`);
    },1 )
}

async function gvcv5JailSpawn( event ){
    const team = getTeam(event.player).replace(`team`,``);
    const building = `${team}jailii`;
    const block = event.block;
    const buildingLocation = event.block.location;
    world.sendMessage(`Placing Building. To stop, break building block.`);
    let i = 20;
    await system.waitTicks(1);
    const blockId = event.block.typeId;
    //event.block.dimension.runCommand(`structure load placer ~~1~`);
    while( true ){
        await system.waitTicks(20); 
        //Particle
        try{
            const n = 3;
            for( let x = 0; x < 64/n; x++ ){
                world.getDimension(`overworld`).spawnParticle(`zex:wire_dust_particle`,{ x: buildingLocation.x + 0.5 + x*10, y: buildingLocation.y+0.5, z: buildingLocation.z + 0.5 });
            }
            for( let y = 0; y < 10/n; y++ ){
                world.getDimension(`overworld`).spawnParticle(`zex:wire_dust_particle`,{ x: buildingLocation.x + 0.5, y: buildingLocation.y+0.5 + y*10, z: buildingLocation.z + 0.5 });
            }
            for( let z = 0; z < 64/n; z++ ){
                world.getDimension(`overworld`).spawnParticle(`zex:wire_dust_particle`,{ x: buildingLocation.x + 0.5, y: buildingLocation.y+0.5, z: buildingLocation.z + 0.5 + z*10  });
            }  
        }catch{}

        //print(`${world.getDimension(`overworld`).getBlock(buildingLocation).typeId} ${blockId}`)
        if( world.getDimension(`overworld`).getBlock(buildingLocation).typeId != blockId || event.block.dimension.id != "minecraft:overworld" ){
            world.sendMessage(`Placing Building canceled`);
            break
        }
        else if( event.block.dimension.id != "minecraft:overworld" ){
            world.sendMessage(`Placing Building canceled because you are not in overworld`);
            break
        }
        else if( world.getDynamicProperty(`teamJail`) == false || world.getDynamicProperty(`${team}Jail`) != undefined ){
            world.sendMessage(`Placing Building canceled because jail is already placed`);
            break
        }
        else if( i > 0 ){
            world.sendMessage(`Placing Building...${i}`);
            i = i - 1
        }



        else if( i <= 0 ){
        
            system.runTimeout( async () => {
                print(`${building} is placed`);
                //world.getDimension(`overworld`).runCommand(`structure load placer ~~1~`);
                world.structureManager.place(building,world.getDimension(`overworld`),buildingLocation,{waterlogged:false})
                world.setDynamicProperty(`${team}Jail`,{ x:buildingLocation.x+32, y:buildingLocation.y+6, z:buildingLocation.z+32 });
            } )
            //event.block.dimension.runCommand(`execute positioned ${buildingLocation.x} ${buildingLocation.y} ${buildingLocation.z} run function structure/${building}`);
            //event.block.dimension.setBlockType(event.block.location,`minecraft:air`);
            break;
        }
    }
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

async function setUp(){
    await system.waitTicks(100);
    if( world.getDynamicProperty(`teamJail`) == undefined ){
        world.setDynamicProperty("teamJail",false);
    }
    if( world.getDynamicProperty(`gvcv5:isBossFlag`) == undefined ){
        world.setDynamicProperty("gvcv5:isBossFlag",true);
    }
    await system.waitTicks(1);
}

system.beforeEvents.startup.subscribe( e => {
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:jail`,{beforeOnPlayerPlace: gvcv5JailSpawn});
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:spawnpoint`,{beforeOnPlayerPlace: gvcv5TeamSpawn});
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:tpblock`,{onPlayerInteract: gvcv5UseTPBlock});
    e.itemComponentRegistry.registerCustomComponent(`gvcv5:usephone`,{onUse: gvcv5UsePhone});
    e.itemComponentRegistry.registerCustomComponent(`gvcv5:teamphone`,{onUse: gvcv5UseTeamPhone});
});

world.afterEvents.worldLoad.subscribe( async e => {
    await setUp();
} )