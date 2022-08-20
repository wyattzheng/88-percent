import { Server as SocketServer, Socket } from "socket.io";
import { LobbyPlayer } from "./player";
import { Room } from "./room";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class GameAppServer{
    private socket: SocketServer;
    private rooms = new Map<string, Room>();
    private players = new Map<Socket, LobbyPlayer>();

    constructor() {
        this.socket = new SocketServer({ cors: {} });
        this.socket.on("connection", this.onConnection.bind(this));

        this.startGameLoop();
    }

    private async startGameLoop() {
        while(true) {
            const start = new Date().getTime();
            this.rooms.forEach((room) => {
                room.world?.update();
            });
            const end = new Date().getTime();
            await wait(Math.max(50 - (end - start), 0));
        }
    }

    listen(port: number) {
        this.socket.listen(port);
    }

    private onConnection(socket: Socket) {
        const player = new LobbyPlayer(socket, this);
        this.players.set(socket, player);
        socket.on("disconnect", () => {
            player.onDisconnected();
            this.players.delete(socket);
        })
    }

    getPlayer(name: string) {
        return Array.from(this.players.values()).find((player) => {
            return player.getName() === name;
        })
    }

    getRoom(roomId: string) {
        return this.rooms.get(roomId);
    }

    createRoom(roomId: string) {
        if (this.rooms.has(roomId)) {
            return;
        }
        const room = new Room(roomId, this);
        this.rooms.set(roomId, room);
        return room;
    }
    
    broadcast(ev: string, arg: any[]) {
        this.socket.emit(ev, arg);
    }
}