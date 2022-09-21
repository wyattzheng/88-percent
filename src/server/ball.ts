import { Entity } from "./entity";
import { Vector2 } from "./utils";
import { World } from "./world";

export interface PaintBallProps{
    life: number;
    paintColor: number;
    direction: number;
    speed: number;
    x: number;
    y: number;
}

/**
 * 边经过路径并染色地板的球
 */
export class PaintBall extends Entity{
    private direction: number; // [0, 2pi] rad
    protected speed: number; // distance per tick
    private radius = 5;
    protected liveTicks = 0;

    constructor(protected props: PaintBallProps, world: World) {
        super(props.x, props.y, world);
        this.direction = props.direction;
        this.speed = props.speed;
        this.motionX = Math.cos(props.direction) * this.speed;
        this.motionY = Math.sin(props.direction) * this.speed;
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
        this.world.panel.paintColorLine(this.props.paintColor, new Vector2(this.lastX, this.lastY) , new Vector2(this.x, this.y));
    }

    protected updateAttrs(): void {
        super.updateAttrs();
        this.attrs.set("radius", this.radius);
    }

    protected onDead() {

    }

    private updateLive() {
        if(this.liveTicks > this.props.life) {
            this.world.removeEntity(this);
            this.onDead();
        }
        this.liveTicks++;
    }

    update(): void {
        super.update();
        this.updateMove();
        this.updatePaint();
        this.updateLive();
    }
}

export interface BoomBallProps extends PaintBallProps{
    generation: number;
}

export class BoomBall extends PaintBall{
    constructor(protected props: BoomBallProps, world: World) {
        super(props, world)
    }

    getName(): string {
        return "PaintBall";
    }
    protected onDead(): void {
        super.onDead()
        if (this.props.generation >= 2) {
            return;
        }
        for(let i=0;i<= 2 * Math.PI;i+=Math.PI / 4) {
            this.world.addEntity(new BoomBall({
                generation: this.props.generation + 1,
                life: this.props.life * 0.75,
                paintColor: this.props.paintColor,
                direction: i,
                speed: this.props.speed,
                x: this.x,
                y: this.y
            }, this.world));
        }
    }
}
