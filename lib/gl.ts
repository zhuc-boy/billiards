namespace TSE {
    // webgl rendering context 
    export class GLUtilities {
        public canvas: HTMLCanvasElement;
        private gl: WebGLRenderingContext;
        constructor(elementId: string) {
            this.canvas = <HTMLCanvasElement>document.getElementById(elementId)
            if (this.canvas === undefined) {
                throw new Error(`没找到元素${elementId}`)
            } else {
                this.gl = <WebGLRenderingContext>this.canvas.getContext("webgl")
                if (this.gl === undefined || this.gl === null) {
                    this.gl = <WebGLRenderingContext> this.canvas.getContext("experimental-webgl");
                    if (this.gl === undefined || this.gl === null) {
                        throw new Error("Unable to initialize WebGL!");
                    }
                }
            }
        }
    }
}