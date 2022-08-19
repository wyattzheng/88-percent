import { Entity } from "./entity";
import { Vector2 } from "./utils";
import { World } from "./world";


/**
 * 边经过路径并染色地板的球
 */
export class PaintBall extends Entity{
    private direction: number; // [0, 2pi] rad
    private speed: number; // distance per tick
    constructor(direction: number, speed: number, x: number, y: number, world: World) {
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

        const halfPi = Math.PI / 2;
        if (newY < 0) { // 与上边缘相碰
            newDirection = dirVec.reflect(xVec.vertical()).rad();
            newY = 1;
        } else if (newY > this.world.height) {
            newDirection = dirVec.reflect(xVec.vertical()).rad();
            newY = this.world.height
        } else if (newX < 0) {
            newDirection = dirVec.reflect(yVec.vertical()).rad();
            newX = 0;
        } else if (newX > this.world.width) {
            newDirection = dirVec.reflect(yVec.vertical()).rad();
            newX = this.world.width;
        }

        this.direction = newDirection;

        this.x = newX;
        this.y = newY;
    }

    update(): void {
        super.update();
        this.updateMove();
    }
}