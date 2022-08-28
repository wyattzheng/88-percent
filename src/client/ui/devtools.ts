import { useEffect } from "react";
import { wait } from "./utils";

export function useDevAction(fn: () => Promise<boolean> | boolean, retryInterval = 1000) {
    useEffect(() => {
        (async () => {
            while(true) {
                try{
                    if(await fn()) {
                        return;
                    }
                } catch (err) {
                    console.error("error when running dev action:", err);
                }
                await wait(retryInterval);
            }        
        })();
    }, []);
}