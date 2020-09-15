export class setkeyAction {
    private up = false
    private down = false
    private left = false
    private right = false
    constructor() {
    }
    /**
     * 监听键盘按下按键事件
     */
    register() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            switch (e.key) {
                case "a":
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "w":
                case "ArrowUp":
                    this.up = true;
                    break;
                case "s":
                case "ArrowDown":
                    this.down = true;
                    break;
                case "d":
                case "ArrowRight":
                    this.right = true;
                    break;
                default:
                    break;
            }
        })
    }
    /**
     * 监听键盘松开按键事件
     */
    unregister() {
        document.addEventListener("keyup", (e) => {
            switch (e.key) {
                case "a":
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "w":
                case "ArrowUp":
                    this.up = false;
                    break;
                case "s":
                case "ArrowDown":
                    this.down = false;
                    break;
                case "d":
                case "ArrowRight":
                    this.right = false;
                    break;
                default:
                    break;
            }
        })
    }
    listenKey(fun: Function) {
        setInterval(() => {
            fun()
        }, 100)
    }
}