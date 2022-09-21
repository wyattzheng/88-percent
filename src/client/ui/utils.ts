import React, { useContext, useEffect, useMemo } from "react";
import { GameAppClient } from "../app";

export function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const UIContext = React.createContext<{ app: GameAppClient }>({ app: null });

export function useApp(): GameAppClient{
    return useContext(UIContext).app;
}

export function useServerEvent(name: string, callback: (...args: any[]) => any, deps: any[] = []) {
    const app = useApp();
    useEffect(() => {
        const registered = callback;
        app.serverOn(name, registered)
        return () => {
            app.serverOff(name, registered);
        }
    }, deps)
}

export function useKeyDown(keys: string | string[], fn: (key: string) => any, deps: any[] = []) {
    const app = useApp();

    useEffect(() => {
        app.controller.onKeyDown(keys, fn);
        return () => {
            app.controller.offKeyDown(fn);
        }
    }, deps);
}