/// <reference path="./gl.ts" />

namespace TSE {
    export class Engine {
        public _gl: WebGLRenderingContext

        constructor(el: string) {
            console.log('开始')
            this._gl = new GLUtilities(el).gl
        }
        loadShader(type: number, source: string) {
            let shader = this._gl.createShader(type)
            if (shader == null) {
                console.log("无法创建图形对象")
                return null;
            }
            this._gl.shaderSource(shader, source)
            this._gl.compileShader(shader)

            let compiled = this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)
            if (!compiled) {
                let error = this._gl.getShaderInfoLog(shader)
                console.log("failed to compile shader:" + error)
                this._gl.deleteShader(shader)
                return null
            }

            return shader
        }
        createProgram(vShader: string, fShader: string) {
            // 创建图形对象
            let vertexShader: WebGLShader | null = this.loadShader(this._gl.VERTEX_SHADER, vShader)
            let fragmentShader: WebGLShader | null = this.loadShader(this._gl.FRAGMENT_SHADER, fShader)
            if (!vertexShader || !fragmentShader) {
                return null
            }
            // 创建程序对象
            let program = this._gl.createProgram();
            if (!program) {
                return null
            }
            // 依附图形对象
            this._gl.attachShader(program, vertexShader)
            this._gl.attachShader(program, fragmentShader)
            // 链接对象给WebGLProgram
            this._gl.linkProgram(program)
            // 检查链接
            let linked = this._gl.getProgramParameter(program, this._gl.LINK_STATUS)
            if (!linked) {
                let error = this._gl.getProgramInfoLog(program);
                console.log('Failed to link program: ' + error);
                this._gl.deleteProgram(program);
                this._gl.deleteShader(fragmentShader);
                this._gl.deleteShader(vertexShader);
                return null;
            }
            return program
        }
        initShaders(vShader: string, fShader: string) {
            let program = this.createProgram(vShader, fShader)
            if (!program) {
                console.log("创建程序失败")
                return false
            }
            this._gl.useProgram(program)
            // this._gl.program = program

            return true
        }
    }
}