namespace matrix {
    export class Matrix4 {
        public elements: Float32Array = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
        // multiply: any
        constructor(opt_src: any) {
            if (opt_src && typeof opt_src === "object" && opt_src.hasOwnProperty('elements')) {
                const s = <Float32Array>opt_src.elements
                let d = new Float32Array(16)
                let i: number
                for (i = 0; i < 16; ++i) {
                    d[i] = s[i];
                }
                this.elements = d;
            }
            this.multiply.bind(this.concat)
        }
        setIdentity() {
            let e = this.elements
            e[0] = 1; e[4] = 0; e[8] = 0; e[12] = 0;
            e[1] = 0; e[5] = 1; e[9] = 0; e[13] = 0;
            e[2] = 0; e[6] = 0; e[10] = 1; e[14] = 0;
            e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
            return this;
        }
        set(src: any) {
            let i: number, s: Float32Array, d: Float32Array
            s = src.elements
            d = this.elements
            for (i = 0; i < 16; ++i) {
                d[i] = s[i];
            }
            return this;
        }
        concat(other: any) {
            let i, e, a, b, ai0, ai1, ai2, ai3
            e = this.elements
            a = this.elements
            b = other.elements
            if (e === b) {
                b = new Float32Array(16);
                for (i = 0; i < 16; ++i) {
                    b[i] = e[i];
                }
                // 浅拷贝会导致计算结果不对，这边重新深拷贝一份
            }
            for (i = 0; i < 4; i++) {
                ai0 = a[i]; ai1 = a[i + 4]; ai2 = a[i + 8]; ai3 = a[i + 12];
                e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
                e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
                e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
                e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
            }
            return this;
        }
        multiply() { }
    }

}