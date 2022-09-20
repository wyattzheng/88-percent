import { Loader } from 'pixi.js'

export interface ListItem {
    key: string;
    url: string;
};

export class TextureManager{
    private loader: Loader;
    private textureList: ListItem[];
    constructor() {
        this.textureList = JSON.parse(process.env.TEXTURE_LIST);
        this.loader = new Loader("/");
    }
    getUrl(key: string) {
        return this.textureList.find((item) => {
            return item.key === key;
        })?.url;
    }
}