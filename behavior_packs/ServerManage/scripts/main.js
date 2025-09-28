import { world, system, EquipmentSlot, EntityComponentTypes,GameMode, EntityInitializationCause, ItemComponent, ItemComponentTypes, TicksPerSecond, EffectType, EffectTypes, EntityDamageCause  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

const blacklist = [
	"takerumincra123",
	"kid0116"
];

const whitelist = [
	  "Kimekun920", 
	  "KarZex7700XT", 
	  "KUROMU1019", 
	  "MAGINASU", 
	  "Houndsyuyuy"
];

const ChatMuteList = [
	"CagyMovie112339", 
	"MAGINASU"
];
world.afterEvents.playerJoin.subscribe(async (arg) => {

	const playerName = arg.playerName;
	if( world.getDynamicProperty("ServerMode") == "whitelist" ){
		if( !whitelist.includes(`${playerName}`) ){
			world.sendMessage(`§a[System]:§cBanned ${playerName} from this server.`);
			await system.waitTicks(20);
			world.getDimension("overworld").runCommand(`kick "${playerName}" You banned by Server Manage Addon`);
		}
	}
	else if( world.getDynamicProperty("ServerMode") =="blacklist" ){
		if( blacklist.includes(playerName) ){
			await system.waitTicks(20);
			world.getDimension("overworld").runCommand(`kick "${playerName}" You banned by Server Manage Addon`);
		}
	}
	if( ChatMuteList.includes(playerName) ){
		const player = world.getPlayers({name:playerName})[0];
		if( !player ) return;
		await system.waitTicks(160); //long time to wait until player is fully loaded
		player.addTag("ChatMute");
		player.sendMessage("§cYou have been muted and cannot send messages on this server.");
	}
});

world.beforeEvents.chatSend.subscribe((arg) => {
	const player = arg.sender;
	const message = arg.message;
	if( player.hasTag("ChatMute") ){
		arg.cancel = true;
		player.sendMessage("§cYou are muted and cannot send messages on this server.");
		player.runCommand(`/w Kimekun920 ${message}`);
	}
});

system.afterEvents.scriptEventReceive.subscribe((arg) => {
	if( arg.id === "ServerManage:mode" ){
		const player = arg.sourceEntity;
		const form = new ActionFormData()
		form.title("§l§gServer Manage Menu§r");
		form.body("§aSelect the server mode you want to set.");
		form.button("§l§gWhitelist Mode§r\n§aOnly players on the whitelist can join the server.");
		form.button("§l§cBlacklist Mode§r\n§aPlayers on the blacklist cannot join the server.");
		form.button("§l§eNormal Mode§r\n§aAll players can join the server.");

		form.show(player).then((response) => {
			if( response.selection === 0 ){
				world.setDynamicProperty("ServerMode", "whitelist");
				world.getDimension("overworld").runCommand(`tellraw @a {"rawtext":[{"text":"§a[Server] §eThe server mode has been set to §l§gWhitelist Mode§r§e."}]}`);
			}
			else if( response.selection === 1 ){
				world.setDynamicProperty("ServerMode", "blacklist");
				world.getDimension("overworld").runCommand(`tellraw @a {"rawtext":[{"text":"§a[Server] §eThe server mode has been set to §l§cBlacklist Mode§r§e."}]}`);
			}
			else if( response.selection === 2 ){
				world.setDynamicProperty("ServerMode", "normal");
				world.getDimension("overworld").runCommand(`tellraw @a {"rawtext":[{"text":"§a[Server] §eThe server mode has been set to §l§eNormal Mode§r§e."}]}`);
			}
		});	
	}
	else if( arg.id === "ServerManage:mute" ){
		const player = arg.sourceEntity;
		const form = new ActionFormData();
		form.title("§l§gPlayer Mute Menu§r");
		form.body("§aSelect the player you want to mute.");
		const players = world.getAllPlayers();
		players.forEach((p) => {
			form.button(p.nameTag);
		});
		form.show(player).then((response) => {
			const targetPlayer = players[response.selection];
			if( targetPlayer.hasTag("ChatMute") ){
				targetPlayer.removeTag("ChatMute");
				targetPlayer.sendMessage("§aYou have been unmuted and can now send messages on this server.");
				player.sendMessage(`§a${targetPlayer.nameTag} has been unmuted and can now send messages on this server.`);
			}
			else{
				targetPlayer.addTag("ChatMute");
				targetPlayer.sendMessage("§cYou have been muted and cannot send messages on this server.");
				player.sendMessage(`§c${targetPlayer.nameTag} has been muted and cannot send messages on this server.`);
			}
		});
	}
});


async function setUp(){
    await system.waitTicks(100);
    if( world.getDynamicProperty("ServerMode") == undefined ){
        world.setDynamicProperty("ServerMode", "whitelist");
    }
}

world.afterEvents.worldLoad.subscribe( async e => {
    await setUp();
    
} )