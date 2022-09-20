import keyboardjs from "keyboardjs";
import { Vector2 } from "../server/utils";

export class HTMLController {
    public pointer: Vector2;
    private pressedKey: Map<string, boolean> = new Map();

    private downKey: string[] = [];
    private upKey: string[] = [];
    private nextTickDownKeys: string[] = [];
    private nextTickUpKeys: string[] = [];
    private keyDownListeners = new Map<any, string[]>();

    private bindedKeys = ["up", "down", "left", "right", "1", "2", "3", "4", "5"];

    mount(container: HTMLElement) {
        this.bindedKeys.forEach((key) => this.bindKey(key));
        container.addEventListener("mousemove", (e) => {
            this.pointer = new Vector2(e.offsetX, -e.offsetY);
        })
        container.addEventListener("mousedown", () => {
            this.nextTickDownKeys.push("pointer-left");
        })
        container.addEventListener("mouseup", () => {
            this.nextTickUpKeys.push("pointer-left");
        })
    }

    unmount() {
        this.bindedKeys.forEach((key) => keyboardjs.unbind(key));
    }

    private bindKey(key: string) {
        keyboardjs.on(key, (event) => {
            event.preventRepeat();
            this.pressedKey.set(key, true);
            this.nextTickDownKeys.push(key);
        }, () => {
            this.pressedKey.set(key, false)
        })
    }

    onKeyDown(keys: string[] | string, listener: (key: string) => any) {
        if (typeof(keys) === "string") {
            this.keyDownListeners.set(listener, [ keys ]);
        } else {
            this.keyDownListeners.set(listener, keys);
        }
    }

    offKeyDown(listener: any) {
        this.keyDownListeners.delete(listener);
    }

    keyPressed(key: string) {
        return this.pressedKey.get(key);
    }

    keyDown(key: string) {
        return this.downKey.includes(key);
    }

    pointerLeftDown() {
        return this.downKey.includes("pointer-left");
    }

    pointerLeftUp() {
        return this.upKey.includes("pointer-left");
    }

    update() {
        this.downKey = this.nextTickDownKeys;
        this.nextTickDownKeys = [];
        this.upKey = this.nextTickUpKeys;
        this.nextTickUpKeys = [];

        if (this.downKey.length > 0) {
            this.keyDownListeners.forEach((keys, listener) => {
                keys.forEach((key) => {
                    if (this.keyDown(key)) {
                        listener(key);
                    }    
                })
            })
        }
        
    }
}