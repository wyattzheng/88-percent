import * as PIXI from "pixi.js";
import { Vector2 } from "../server/utils";
import type { GameAppClient } from "./app";
import type { HTMLController } from "./controller";
import { MoveManager, PredictedMoveManager, SmoothMoveManager } from "./move";
import { generateCircleTexture } from "./utils";

export class Player extends PIXI.Container{
    private moveManager: MoveManager;
    private controller: HTMLController;
    private sprite: PIXI.Sprite;
    private radius = 20;
    private isMyself: boolean;
    constructor(
        private client: GameAppClient,
        public id: number,
        x: number, y: number,
        private attrs: any
    ) {
        super();
        this.isMyself = attrs.name === client.getPlayerName();
        if (this.isMyself) {
            client.world.setPlayer(this);
        }
        this.controller = this.client.controller;
        this.moveManager = this.isMyself ? new PredictedMoveManager({ x, y }) : new SmoothMoveManager({ x, y });
        this.moveManager.on("newPos", ({ x, y }) => {
            this.position.set(x, -y);
        })
        this.position.set(x, -y);

        this.radius = attrs.radius;
        this.sprite = new PIXI.Sprite(generateCircleTexture(this.client.renderer, attrs.color, this.radius));
        this.sprite.width = this.radius * 2;
        this.sprite.height = this.radius * 2;
        this.sprite.anchor.set(0.5, 0.5);
        this.addChild(this.sprite);

        const nameText = new PIXI.Text(attrs.name, new PIXI.TextStyle({ fontSize: 12, fill: "#FFF" }));
        nameText.x = -this.radius / 2
        nameText.y = -this.radius / 2
        this.addChild(nameText);

        this.client.serverOn("player-move", (playerId: number, x: number, y: number, inputId: number) => {
            if (this.id !== playerId) {
                return;
            }
            this.moveManager.ackInput(x, y, inputId);
        });
    }

    get pos() {
        return new Vector2(this.x, -this.y);
    }

    move(deltaX: number, deltaY: number) {
        const inputId = this.moveManager.addInput(deltaX, deltaY);
        this.client.serverEmit("control-player-move", deltaX, deltaY, inputId);
    }

    getWatchDirection() {
        return this.client.controller.pointer.sub(this.pos).rad();
    }

    updateKeyControl() {
        if (!this.controller) {
            return;
        }
        let deltaX = 0; let deltaY = 0;
        if (this.controller.keyPressed("up")) {
            deltaY += 5;
        }
        if (this.controller.keyPressed("down")) {
            deltaY -= 5;
        }
        if (this.controller.keyPressed("left")) {
            deltaX -= 5;
        }
        if (this.controller.keyPressed("right")) {
            deltaX += 5;
        }

        if (deltaX !== 0 || deltaY !== 0) {
            this.move(deltaX, deltaY);
        }
    }

    updatePointerControl() {
        if (!this.controller) {
            return;
        }
        if(this.controller.pointerLeftDown()) {
            this.client.serverEmit("start-using", this.controller.pointer.x, this.controller.pointer.y)
        } else if(this.controller.pointerLeftUp()) {
            this.client.serverEmit("end-using", this.controller.pointer.x, this.controller.pointer.y);
        }
    }

    update() {
        if (this.isMyself) {
            this.updateKeyControl();
            this.updatePointerControl();
        }
        this.moveManager.update();
    }
}
