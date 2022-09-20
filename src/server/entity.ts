import type { Room } from "./room";
import type { World } from "./world";
import { GameAppServer } from "./server";
import { AttributeMap } from "./attribute";
import { Vector2 } from "./utils";

export class Entity{
    static entityId: number = 0;

    public x: number;
    public y: number;
    protected lastX: number;
    protected lastY: number;
    protected motionX = 0;
    protected motionY = 0;
    protected friction = 0.5;
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

    get pos() {
        return new Vector2(this.x, this.y);
    }

    get lastPos() {
        return new Vector2(this.lastX, this.lastY);
    }

    getName() {
        return this.constructor.name;
    }

    getMotion() {
        return new Vector2(this.motionX, this.motionY)
    }

    changeDirection(direction: number) {
        const vec2 = new Vector2(this.motionX, this.motionY);
        const length = vec2.lengthSquared();
        this.motionX = Math.cos(direction) * length;
        this.motionY = Math.sin(direction) * length;
    }

    spawn() {
        this.updateAttrs();
        const type = this.constructor.name;
        this.world.broadcast("add-entity", type, this.id, this.x, this.y, this.attrs.getAll());
    }

    despawn() {
        const type = this.constructor.name;
        this.world.broadcast("remove-entity", this.id)
    }

    protected updateBroadcastMove() {
        if (this.lastX !== this.x || this.lastY !== this.y) {
            this.room.broadcast("entity-move", this.id, this.x, this.y);
            this.lastX = this.x;
            this.lastY = this.y;
        }
    }

    protected updateMotion() {
        if (Math.abs(this.motionX) < 0.001 && Math.abs(this.motionY) < 0.001) {
            this.motionX = this.motionY = 0
            return;
        }
        this.x += this.motionX;
        this.y += this.motionY;

        
        const speed = this.getMotion().lengthSquared();
        const newSpeed = Math.max(speed - this.friction, 0);
        this.motionX = this.motionX * (newSpeed / speed)
        this.motionY = this.motionY * (newSpeed / speed)
    }

    protected updateAttrs() {

    }

    update() {
        this.updateBroadcastMove();
        this.updateMotion();
    };
}