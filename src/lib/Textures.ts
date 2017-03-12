import {TextureLoader} from "three";

export class Textures {
    loader: any;
    constructor() {
        this.loader = new TextureLoader();
    }

    public async turntable(): Promise<WebGLTexture> {
        return new Promise<WebGLTexture>((resolve, reject) => {
            this.loader.load("/images/turntable001.jpg", (texture) => {
                resolve(texture);
            });
        });
    }
}
