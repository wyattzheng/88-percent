import { PaintBall } from "./ball";
import type { Entity } from "./entity";
import { LobbyPlayer, Player } from "./player";
import { Room } from "./room";
import { GameAppServer } from "./server";

export class World{
    public server: GameAppServer;
    private playerA: Player;
    private playerB: Player;
    private players: Player[];
    private entities: Entity[] = [];
    public readonly width = 600;
    public readonly height = 390;

    constructor(private pA: LobbyPlayer, private pB: LobbyPlayer, public room: Room) {
        this.server = room.server;
        this.reset();
    }

    broadcast(ev: string, ...args: any[]) {
        this.pA.emit(ev, ...args);
        this.pB.emit(ev, ...args);
    }

    reset() {
        this.broadcast("clear-world");
        this.playerA = new Player(this.pA, 0, 0, 0xFF0000, this);
        this.playerB = new Player(this.pB, 0, 0, 0x0000FF, this);
        this.players = [this.playerA, this.playerB];
        this.players.forEach((player) => {
            this.addEntity(player);
        })

        this.addEntity(new PaintBall(Math.PI * 3.5 / 2, 10, 50, 50, this));
        this.resetCoins();
    }

    private addEntity(entity: Entity) {
        this.entities.push(entity);
        entity.spawn();
    }

    private resetCoins() {

    }

    update() {
        this.entities.forEach((entity) => {
            entity.update();
        })
    }

}