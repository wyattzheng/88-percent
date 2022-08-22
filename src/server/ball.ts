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
    }

    private updateMove() {
        let newX = this.x + Math.cos(this.direction) * this.speed;
        let newY = this.y + Math.sin(this.direction) * this.speed;

        let newDirection = this.direction;
        const dirVec = new Vector2(newX - this.x, newY - this.y);
        const xVec = new Vector2(1, 0);
        const yVec = new Vector2(0, 1);

        if (newY < this.radius) { // 与上边缘相碰
            newDirection = dirVec.reflect(xVec.vertical()).rad();
            newY = this.radius;
        } else if (newY > this.world.height - this.radius) {
            newDirection = dirVec.reflect(xVec.vertical()).rad();
            newY = this.world.height - this.radius
        } else if (newX < this.radius) {
            newDirection = dirVec.reflect(yVec.vertical()).rad();
            newX = this.radius;
        } else if (newX > this.world.width - this.radius) {
            newDirection = dirVec.reflect(yVec.vertical()).rad();
            newX = this.world.width - this.radius;
        }

        this.direction = newDirection;

        this.x = newX;
        this.y = newY;
    }

    private updatePaint() {
        this.world.panel.paintColorLine(this.paintColor, new Vector2(this.lastX, this.lastY) , new Vector2(this.x, this.y));
    }

    protected updateAttrs(): void {
        super.updateAttrs();
        this.attrs.set("radius", this.radius);
    }

    update(): void {
        super.update();
        this.updateMove();
        this.updatePaint();
    }
}