import { Entity } from "./entity";
import { Vector2 } from "./utils";
import { World } from "./world";


/**
 * 边经过路径并染色地板的球
 */
export class PaintBall extends Entity{
    private direction: number; // [0, 2pi] rad
    private speed: number; // distance per tick
    private radius = 5;
    constructor(public paintColor: number, direction: number, speed: number, x: number, y: number, world: World) {
        super(x, y, world);
        this.direction = direction;
        this.speed = speed;
        this.motionX = Math.cos(direction) * this.speed;
        this.motionY = Math.sin(direction) * this.speed;
    }

    private updateMove() {
        let newDirection = this.direction;
        const dirVec = new Vector2(Math.cos(this.direction), Math.sin(this.direction));
        const xVec = new Vector2(1, 0);
        const yVec = new Vector2(0, 1);

        if (this.y > -this.radius) { // 与上边缘相碰
            newDirection = dirVec.reflect(xVec.vertical()).rad();
            this.y = -this.radius;
        } else if (this.y < -(this.world.height - this.radius)) {
            newDirection = dirVec.reflect(xVec.vertical()).rad();
            this.y = -(this.world.height - this.radius)
        } else if (this.x < this.radius) {
            newDirection = dirVec.reflect(yVec.vertical()).rad();
            this.x = this.radius;
        } else if (this.x > this.world.width - this.radius) {
            newDirection = dirVec.reflect(yVec.vertical()).rad();
            this.x = this.world.width - this.radius;
        }

        for(const obstacle of this.world.getObstacles()) {
            const cross = obstacle.checkCross(this)
            if (cross === false) {
                continue;
            }
            // console.debug("cross" , {x: this.x, y: this.y},count++, "|", this.direction, "->", newDirection, cross.onsegment, "|", this.lastPos.hash(), this.pos.hash(), "|", cross.point.hash())
            if (!cross.onsegment) {
                this.x = cross.point.x;
                this.y = cross.point.y;    
                newDirection = dirVec.reflect(obstacle.dirVec.vertical()).rad();
            }
        }

        if (newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeDirection(this.direction)    
        }
    }

    private updatePaint() {
        this.world.panel.paintColorLine(this.paintColor, new Vector2(this.lastX, this.lastY) , new Vector2(this.x, this.y));
    }

    protected updateAttrs(): void {
        super.updateAttrs();
        this.attrs.set("radius", this.radius);
    }

    private updateLive() {
        if(this.getMotion().lengthSquared() < 0.01) { // 没有速度了
            this.world.removeEntity(this);
        }
    }

    update(): void {
        super.update();
        this.updateMove();
        this.updatePaint();
        this.updateLive();
    }
}