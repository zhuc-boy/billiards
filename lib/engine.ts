namespace TSE{
    // 游戏引擎类
    export class Engine{
        private _canvase:HTMLCanvasElement
        constructor(){
            console.log('开始')

        }
        public start():void{
            this._canvase=new GLUtilities("glcanvas")
            this.loop()
        }
        private loop():void{
            requestAnimationFrame(this.loop.bind(this))
        }
    }
}