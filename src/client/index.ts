import { GameAppClient } from "./app"

(function bootstrap() {
    const client = new GameAppClient("ws://127.0.0.1:4000/");
    client.mount("#game-display");
    console.log("mounted");
})();