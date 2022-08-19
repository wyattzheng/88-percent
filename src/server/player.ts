import { Socket } from "socket.io";
import { Entity } from "./entity";
import { Room } from "./room";
import type { GameAppServer } from "./server";
import type { World } from "./world";

export class LobbyPlayer{
    private logined: boolean = false;
    private name: string = "";
    private room: Room;

    constructor(private socket: Socket, private server: GameAppServer) {
        socket.on("request-login", this.onRequestLogin.bind(this))
        socket.on("request-enter-room", this.onRequestEnterRoom.bind(this));
        socket.on("start-game", this.onStartGame.bind(this));
    }

    private onStartGame() {
        this.room?.startGame();
    }

    private onRequestEnterRoom(roomId: string) {
        if (!this.logined) { // 未登录不能进入房间
            return;
        }
        if (this.room) { // 已经在房间里了
            return;
        }
        this.room = this.server.getRoom(roomId);
        if(!this.room) {
            this.room = this.server.createRoom(roomId);
        }
        if (!this.room.isFull()) {
            this.room.onPlayerEnter(this);
        }
    }

    private onRequestLogin(name: string) {
        if (this.logined) {
            return;
        }
        if (this.server.getPlayer(name)) { // 已经有同名登录过了
            return;
        }
        this.name = name;
        this.logined = true;
        this.emit("player-logined", name);
    }

    onDisconnected() {
        this.room?.onPlayerLeave(this);
    }
    
    getName() {
        return this.name;
    }

    emit(ev: string, ...args: any[]) {
        this.socket.emit(ev, ...args);
    }

    on(ev: string, listener: (...args: any[]) => void) {
        this.socket.on(ev, listener);
    }

    getRoom() {
        return this.room;
    }

    isLogined() {
        return this.logined;
    }
}

export class Player extends Entity{
    private lastMoveInputId: number = 0;
    private forceReportMove: boolean = false;

    constructor(private lobbyPlayer: LobbyPlayer, x: number, y: number, private color: number, world: World) {
        super(x, y, world);

        this.server = world.server;
        this.lobbyPlayer.on("control-player-move", this.onControlPlayerMove.bind(this));
    }

    private onControlPlayerMove(x: number, y: number, inputId: number) {
        this.lastMoveInputId = inputId;
        this.forceReportMove = true;

        const newX = this.x + x;
        const newY = this.y + y;
        if (newX > this.world.width || newX < 0) {
            return;
        }
        if (newY > this.world.height || newY < 0) {
            return;
        }

        this.x = newX;
        this.y = newY;
    }

    updateAttrs() {
        this.attrs.set("id", this.id);
        this.attrs.set("name", this.lobbyPlayer.getName()),
        this.attrs.set("color", this.color);
    }

    updateBroadcastMove(): void {
        if (this.lastX !== this.x || this.lastY !== this.y || this.forceReportMove) {
            this.room.broadcast("player-move", this.id, this.x, this.y, this.lastMoveInputId);
            this.lastX = this.x;
            this.lastY = this.y;
            this.forceReportMove = false;
        }
    }

    update() {
        super.update.call(this);
    }
}