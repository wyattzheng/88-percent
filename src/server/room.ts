import { LobbyPlayer } from "./player";
import { World } from "./world";
import type { GameAppServer } from "./server";

export class Room{
    private playerList = new Set<LobbyPlayer>();
    private started = false;
    public world: World;
    constructor(private roomId: string, public server: GameAppServer) {

    }

    onPlayerEnter(player: LobbyPlayer) {
        if (!this.playerList.has(player)) {
            this.playerList.add(player);
            player.emit("entered-room", this.roomId);
            this.updateRoomToClient();
        }
    }

    onPlayerLeave(player: LobbyPlayer) {
        if(this.playerList.has(player)) {
            this.playerList.delete(player);
            this.updateRoomToClient();
        }
    }

    startGame() { // 准备完毕后, 可以开始游戏
        if (this.started) {
            return;
        }
        if (!this.isFull()) {
            return;
        }
        console.log("开始游戏", this.roomId)
        this.started = true;
        const players = Array.from(this.playerList.values());
        players.forEach((player) => {
            player.emit("start-game");
        });
        this.world = new World(players[0], players[1], this); // 创建游戏世界
    }

    isFull() {
        return this.playerList.size >= 2;
    }

    broadcast(ev: string, ...args: any[]) {
        this.playerList.forEach((player) => {
            player.emit(ev, ...args);
        })
    }

    private updateRoomToClient() {
        const isFull = this.playerList.size >= 2;
        this.broadcast("room-update", Array.from(this.playerList).map((player)=>player.getName()), isFull);
    }
}