import { useEffect, useRef } from "react";
import { wait } from "./utils";

export function useDevAction(fn: () => Promise<boolean> | boolean, name = '', retryInterval = 1000) {
    const ref = useRef(fn);

    useEffect(() => {
        ref.current = fn;
    })

    useEffect(() => {
        let running = true;
        (async () => {
            while(running) {
                try{
                    if(await ref.current()) {
                        if (name) {
                            console.log("自动操作结束：", name);
                        }
                        return;
                    }
                } catch (err) {
                    console.error("error when running dev action:", err);
                }
                await wait(retryInterval);
            }
        })();
        return () => {
            running = false;
        }
    }, []);
}