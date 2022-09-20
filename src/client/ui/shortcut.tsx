import React, { useMemo, useState } from "react";
import { useApp, useKeyDown, useServerEvent } from "./utils";
import classNames from "classnames";

export function ShortcutItem(props: { index: number, activeIndex: number }) {
    const [texture, setTexture] = useState('');
    const isActive = useMemo(() => (props.index === props.activeIndex), [props.index, props.activeIndex]);
    const app = useApp();

    useServerEvent("set-item", (index: number, attrs: any) => {
        if (index !== props.index) { return; }
        setTexture(app.texture(attrs.texture));
    });

    return (
        <div className={classNames("shortcut-item", {"active": isActive})}>
            {texture && <img src={texture}></img>}
            <style jsx>{`
                img{
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                .shortcut-item{
                    padding: 3px;
                    background-color: #999;
                    width: 38px;
                    height: 38px;
                    border-radius: 3px;
                    margin-right: 6px;
                    border: 1px solid #888;
                    box-sizing: border-box;
                    transition: all 0.1s;
                }
                .shortcut-item:last-child{
                    margin-right: 0px;
                }
                .shortcut-item.active{
                    background-color: #BAA;
                }
            `}</style>
        </div>
    )
}

export function Shortcut() {
    const [activeIndex, setActiveIndex] = useState(0);
    
    useKeyDown(['1', '2', '3', '4', '5'], (key) => setActiveIndex(parseInt(key) - 1));

    return (
        <div id="shortcut-container">
            <div id="shortcut">
                <ShortcutItem index={0} activeIndex={activeIndex}></ShortcutItem>
                <ShortcutItem index={1} activeIndex={activeIndex}></ShortcutItem>
                <ShortcutItem index={2} activeIndex={activeIndex}></ShortcutItem>
                <ShortcutItem index={3} activeIndex={activeIndex}></ShortcutItem>
                <ShortcutItem index={4} activeIndex={activeIndex}></ShortcutItem>
            </div>
            <style jsx>{`
                #shortcut-container{
                    bottom: 0px;
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    position: absolute;
                }
                
                #shortcut{
                    position: absolute;
                    bottom: 10px;
                    height: 50px;
                    padding: 5px;
                    display: flex;
                    flex-direction: row;
                    box-sizing: border-box;
                    border-radius: 5px;
                    background: #CCC;
                    border: 1px solid #FFF;
                }
            `}</style>
        </div>
    )
}