/// <reference path="./gl.ts" />

namespace TSE {
    // 游戏引擎类
    export class Engine {
        private _gl: WebGLRenderingContext

        constructor(el: string) {
            console.log('开始')
            this._gl = new GLUtilities(el).gl
        }
        public start(): void {
            this.loop()
        }
        private loop(): void {
            requestAnimationFrame(this.loop.bind(this))
        }
    }
}