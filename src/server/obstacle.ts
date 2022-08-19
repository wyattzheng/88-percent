import { AttributeMap } from "./attribute"
import type { GameAppServer } from "./server"

export class Obstacle{
    private attributeMap = new AttributeMap();
    constructor(private app: GameAppServer) {
        
    }

    onHitByBall() {
        
    }
}

export class Coin extends Obstacle{
    
}