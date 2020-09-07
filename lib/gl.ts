namespace TSE {
    // webgl rendering context 
    export class GLUtilities {
        private elementId: string
        // canvas的id名称
        private canvas: HTMLCanvasElement;
        public gl: WebGLRenderingContext;
        constructor(elementId: string) {
            this.elementId = elementId
            if (this.getCanvas()) {
                this.canvas = <HTMLCanvasElement>this.getCanvas()
            } else {
                throw new Error("未查询到dom元素");
            }
            if (this.create3DContext(this.canvas)) {
                this.gl = <WebGLRenderingContext>this.create3DContext(this.canvas)
            } else {
                throw new Error("浏览器不支持webgl");
            }
        }
        getCanvas() {
            let canvas = null
            canvas = document.getElementById(this.elementId)
            return canvas
        }
        create3DContext(canvas: HTMLCanvasElement) {
            const names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            let context = null
            for (let index = 0; index < names.length; index++) {
                try {
                    context = this.canvas.getContext(names[index])
                } catch (error) {
                }
                if (context !== null) {
                    break;
                }
            }
            return context
        }
    }
}