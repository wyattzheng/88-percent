import type { Room } from "./room";
import type { World } from "./world";
import { GameAppServer } from "./server";
import { AttributeMap } from "./attribute";

export class Entity{
    static entityId: number = 0;

    protected x: number;
    protected y: number;
    protected lastX: number;
    protected lastY: number;
    protected id: number;
    protected server: GameAppServer;
    protected room: Room;
    protected attrs = new AttributeMap();

    constructor(x: number, y: number, protected world: World) {
        this.id = Entity.entityId++;
        this.lastX = this.x = x;
        this.lastY = this.y = y;
        this.server = world.server;
        this.room = world.room;
    }

    spawn() {
        this.updateAttrs();
        const type = this.constructor.name;
        this.world.broadcast("add-entity", type, this.x, this.y, this.attrs.getAll());
    }

    protected updateBroadcastMove() {
        if (this.lastX !== this.x || this.lastY !== this.y) {
            this.room.broadcast("entity-move", this.id, this.x, this.y);
            this.lastX = this.x;
            this.lastY = this.y;
        }
    }

    protected updateAttrs() {
        this.attrs.set("id", this.id);
    }

    update() {
        this.updateBroadcastMove();
    };
}