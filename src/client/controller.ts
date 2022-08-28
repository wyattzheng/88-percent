import keyboardjs from "keyboardjs";
import { Vector2 } from "../server/utils";

export class HTMLController {
    public pointer: Vector2;
    private pressedKey: Map<string, boolean> = new Map();
    private pressedPointerLeft: boolean = false;
    private bindedKeys = ["up", "down", "left", "right"];

    mount(container: HTMLElement) {
        this.bindedKeys.forEach((key) => this.bindKey(key));
        container.addEventListener("mousemove", (e) => {
            this.pointer = new Vector2(e.offsetX, e.offsetY);
        })
        container.addEventListener("mousedown", () => {
            this.pressedPointerLeft = true;
        })
        container.addEventListener("mouseup", () => {
            this.pressedPointerLeft = false;
        })
    }

    unmount() {
        this.bindedKeys.forEach((key) => keyboardjs.unbind(key));
    }

    private bindKey(key: string) {
        keyboardjs.on(key, (event) => {
            event.preventRepeat();
            this.pressedKey.set(key, true)
        }, () => {
            this.pressedKey.set(key, false)
        })
    }

    keyPressed(key: string) {
        return this.pressedKey.get(key);
    }

    pointerLeftPressed() {
        return this.pressedPointerLeft;
    }   
}