import { GameAppServer } from "./server"

(function bootstrap() {
    const server = new GameAppServer();
    server.listen(4000);
    console.log("started");
})();