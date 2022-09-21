import { Item } from "./items/item";
import type { LobbyPlayer, Player } from "./player";
import { Vector2 } from "./utils";

export class EmptyItem extends Item{ };

export class Shortcut {
    private items: Item[] = [];
    private activeIndex: number = 0;
    private count = 5;
    private lobbyPlayer: LobbyPlayer;

    constructor(private player: Player) {
        this.lobbyPlayer = player.lobbyPlayer;

        for(let i = 0; i < this.count; i++) {
            this.items[i] = new EmptyItem(this.player);
        }

        this.lobbyPlayer.on("set-active-index", (index) => {
            this.setActiveIndex(index);
        })
        this.lobbyPlayer.on("start-using", (x: number, y: number) => {
            this.startUsing(x, y);
        })
        this.lobbyPlayer.on("end-using", (x: number, y: number) => {
            this.endUsing(x, y);
        })
    }

    setActiveIndex(index: number) {
        if (index < this.count && index >= 0 && index !== this.activeIndex) {
            this.activeIndex = index;
            this.lobbyPlayer.emit("set-active-index", index);
        }
    }

    startUsing(x: number, y: number) {
        const pointer = new Vector2(x, y);
        const direction = pointer.sub(this.player.pos).rad();
        this.items[this.activeIndex].startUsing(pointer, direction);
    }

    endUsing(x: number, y: number) {
        const pointer = new Vector2(x, y);
        const direction = pointer.sub(this.player.pos).rad();
        this.items[this.activeIndex].endUsing(pointer, direction);
    }

    setItem(index: number, item: Item) {
        this.items[this.activeIndex] = item;
        this.lobbyPlayer.emit("set-item", index, item.getAttrs());
    }

    update() {
        this.items.forEach((item, idx) => {
            if(item.attrs.hasDirty()) {
                this.lobbyPlayer.emit("update-item", idx, item.attrs.getDirtyAll())
            }

            item.update();
        })
    }
}