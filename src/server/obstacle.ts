import { Entity } from "./entity"
import { checkSegmentCross, Vector2 } from "./utils";
import type { World } from "./world"

export class Obstacle extends Entity{
    public from: Vector2;
    public to: Vector2;
    constructor(private panelRad: number, private width: number, x: number, y: number, world: World) {
        super(x, y, world);
        const delta = new Vector2(width / 2 * Math.cos(this.panelRad), width / 2 * Math.sin(this.panelRad));
        this.from = this.pos.sub(delta);
        this.to = this.pos.add(delta);
    }

    /**
     * 方向向量
     */
    get dirVec() {
        return this.to.sub(this.from).normalize();
    }

    protected updateAttrs(): void {
        super.updateAttrs();
        this.attrs.set('width', this.width);
        this.attrs.set('panelRad', this.panelRad);
    }

    checkCross(entity: Entity) {
        return checkSegmentCross(entity.lastPos, entity.pos, this.from, this.to);
    }
}

export class Coin extends Obstacle{
    
}