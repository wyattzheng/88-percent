import keyboardjs from "keyboardjs";
import type { GameAppClient } from "./app";

export class HTMLController {
    private pressedKey: Map<string, boolean> = new Map();
    private bindedKeys = ["up", "down", "left", "right"];

    mount() {
        this.bindedKeys.forEach((key) => this.bindKey(key));
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
    
}