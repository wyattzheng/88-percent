import type { Entity } from "./entity";
import { Obstacle } from "./obstacle";
import { LobbyPlayer, Player } from "./player";
import { Room } from "./room";
import { GameAppServer } from "./server";
import { getPointsSegmentInRect, Vector2 } from "./utils";

export type Color = number;

export class Panel{
    private colorMap: (Color | null)[][] = [];
    public readonly width: number;
    public readonly height: number;

    private paintings: [number, number, number][] = [];
    constructor(private colors: Color[], private world: World) {
        this.width = Math.floor(world.width / world.tileWidth);
        this.height = Math.floor(world.height / world.tileWidth);
        console.log("地图大小", this.width, this.height)
        this.initMap();
    }
    private initMap() {
        for(let y=0;y<this.height;y++)
            for(let x=0;x<this.width;x++) {
                this.colorMap[-y] ||= [];
                this.colorMap[-y][x] = null;
            }
    }
    paintColor(color: Color, x: number, y: number) {
        if (!this.colors.includes(color)) {
            return;
        }
        const ix = Math.floor(x / this.world.tileWidth);
        const iy = Math.floor(y / this.world.tileWidth);
        if (ix >= this.width || -iy >= this.height || x < 0 || y > 0) {
            return;
        }
        if (this.colorMap[iy][ix] !== color) {
            this.colorMap[iy][ix] = color;
            this.paintings.push([color, ix, iy]);
        }
    }
    paintColorLine(color: Color, from: Vector2, to: Vector2) {
        const tw = this.world.tileWidth;

        const minX = Math.min(Math.floor(from.x / tw), Math.floor(to.x / tw));
        const maxX = Math.max(Math.floor(from.x / tw), Math.floor(to.x / tw));

        const minY = Math.min(Math.floor(from.y / tw), Math.floor(to.y / tw));
        const maxY = Math.max(Math.floor(from.y / tw), Math.floor(to.y / tw));

        for(let x=minX;x<=maxX;x++)
            for(let y=minY;y<=maxY;y++) {
                const points = getPointsSegmentInRect(from, to, x * tw, x * tw + tw, y * tw, y * tw + tw);
                if (points.length > 0) { // 相交
                    this.paintColor(color, x * tw, y * tw);
                }
            }
    }

    update() {
        if (this.paintings.length > 0) {
            this.world.broadcast("paint", this.paintings);
            this.paintings = [];    
        }
    }

}

export class World{
    public server: GameAppServer;
    private playerA: Player;
    private playerB: Player;
    private players: Player[];
    private entities: Set<Entity> = new Set();
    public panel: Panel;
    public readonly tileWidth = 10;
    
    public readonly width = 1200;
    public readonly height = 600;

    constructor(private pA: LobbyPlayer, private pB: LobbyPlayer, public room: Room) {
        this.server = room.server;
        this.reset();
    }

    broadcast(ev: string, ...args: any[]) {
        this.pA.emit(ev, ...args);
        this.pB.emit(ev, ...args);
    }

    reset() {
        this.playerA = new Player(this.pA, 50, -50, 0xFF0000, this);
        this.playerB = new Player(this.pB, 50, -50, 0x0000FF, this);
        this.players = [this.playerA, this.playerB];
        const colors = this.players.map((player) => player.getPaintColor());
        this.panel = new Panel(colors, this);
        this.broadcast("reset-world", colors, this.tileWidth, this.panel.width, this.panel.height);
        this.players.forEach((player) => {
            this.addEntity(player);
        })

        this.addEntity(new Obstacle(1, 100, 100, -100, this));
        this.addEntity(new Obstacle(2, 150, 250, -150, this));

        this.resetCoins();
    }

    addEntity(entity: Entity) {
        this.entities.add(entity);
        entity.spawn();
    }

    removeEntity(entity: Entity) {
        entity.despawn()
        this.entities.delete(entity);
    }

    getObstacles() {
        return Array.from(this.entities).filter((entity) => (entity instanceof Obstacle)) as Obstacle[];
    }

    private resetCoins() {

    }

    update() {
        this.entities.forEach((entity) => {
            entity.update();
        })
        this.panel.update();
    }

}