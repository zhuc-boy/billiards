interface floatObj {
    elements: Float32Array
}
namespace matrix {
    export class Matrix4 {
        public elements: Float32Array = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
        // multiply: any
        constructor(opt_src?: floatObj) {
            if (opt_src && typeof opt_src === "object" && opt_src.hasOwnProperty('elements')) {
                const s = opt_src.elements
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
        set(src: floatObj) {
            let i: number, s: Float32Array, d: Float32Array
            s = src.elements
            d = this.elements
            for (i = 0; i < 16; ++i) {
                d[i] = s[i];
            }
            return this;
        }
        concat(other: floatObj) {
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
        multiplyVector3(pos: floatObj) {
            let e = this.elements
            let p = pos.elements
            let v = new Vector3()
            let result = v.elements;
            result[0] = p[0] * e[0] + p[1] * e[4] + p[3] * e[8] + e[12]
            result[1] = p[0] * e[1] + p[1] * e[5] + p[3] * e[9] + e[13]
            result[2] = p[0] * e[2] + p[1] * e[6] + p[3] * e[10] + e[14]
            return v
        }
        multiplyVector4(pos: floatObj) {
            let e = this.elements
            let p = pos.elements
            let v = new Vector4()
            let result = v.elements;
            result[0] = p[0] * e[0] + p[1] * e[4] + p[3] * e[8] + p[4] * e[12]
            result[1] = p[0] * e[1] + p[1] * e[5] + p[3] * e[9] + p[4] * e[13]
            result[2] = p[0] * e[2] + p[1] * e[6] + p[3] * e[10] + p[4] * e[14]
            result[2] = p[0] * e[3] + p[1] * e[7] + p[3] * e[11] + p[4] * e[15]
            return v
        }
        transpose() {
            // 0   1   2   3
            // 4   5   6   7
            // 8   9   10  11
            // 12  13  14  15
            let e, t;

            e = this.elements
            t = e[1]; e[1] = e[4]; e[4] = t;
            t = e[2]; e[2] = e[8]; e[8] = t;
            t = e[3]; e[3] = e[12]; e[12] = t;
            t = e[6]; e[6] = e[9]; e[9] = t;
            t = e[7]; e[7] = e[13]; e[13] = t;
            t = e[11]; e[11] = e[14]; e[14] = t;
        }
        setInverseOf(other: floatObj) {
            let i, s, d, inv, det;

            s = other.elements;
            d = this.elements;
            inv = new Float32Array(16);

            inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15]
                + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
            inv[4] = - s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15]
                - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
            inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15]
                + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
            inv[12] = - s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14]
                - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];

            inv[1] = - s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15]
                - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
            inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15]
                + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
            inv[9] = - s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15]
                - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
            inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14]
                + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];

            inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15]
                + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
            inv[6] = - s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15]
                - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
            inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15]
                + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
            inv[14] = - s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14]
                - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];

            inv[3] = - s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11]
                - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
            inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11]
                + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
            inv[11] = - s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11]
                - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
            inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10]
                + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];

            det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
            if (det === 0) {
                return this;
            }

            det = 1 / det;
            for (i = 0; i < 16; i++) {
                d[i] = inv[i] * det;
            }

            return this;
        }
        // 正射投影矩阵
        setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
            let e, rw: number, rh: number, rd: number;
            if (left === right || bottom === top || near === far) {
                throw "null frustum"
            }
            rw = 1 / (right - left)
            rh = 1 / (top - bottom)
            rd = 1 / (far - near)
            e = this.elements
            e[0] = 2 * rw;
            e[1] = 0;
            e[2] = 0;
            e[3] = 0;

            e[4] = 0;
            e[5] = 2 * rh;
            e[6] = 0;
            e[7] = 0;

            e[8] = 0;
            e[9] = 0;
            e[10] = -2 * rd;
            e[11] = 0;

            e[12] = -(right + left) * rw;
            e[13] = -(top + bottom) * rh;
            e[14] = -(far + near) * rd;
            e[15] = 1;

            return this;
        }
        ortho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
            return this.concat(new Matrix4().setOrtho(left, right, bottom, top, near, far))
        }
        // 圆锥投影矩阵
        setFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number) {
            let e, rw: number, rh: number, rd: number;
            if (left === right || top === bottom || near === far) {
                throw 'null frustum';
            }
            if (near <= 0) {
                throw 'near <= 0';
            }
            if (far <= 0) {
                throw 'far <= 0';
            }

            rw = 1 / (right - left);
            rh = 1 / (top - bottom);
            rd = 1 / (far - near);

            e = this.elements;

            e[0] = 2 * near * rw;
            e[1] = 0;
            e[2] = 0;
            e[3] = 0;

            e[4] = 0;
            e[5] = 2 * near * rh;
            e[6] = 0;
            e[7] = 0;

            e[8] = (right + left) * rw;
            e[9] = (top + bottom) * rh;
            e[10] = -(far + near) * rd;
            e[11] = -1;

            e[12] = 0;
            e[13] = 0;
            e[14] = -2 * near * far * rd;
            e[15] = 0;

            return this;
        }
        frustum(left: number, right: number, bottom: number, top: number, near: number, far: number) {
            return this.concat(new Matrix4().setFrustum(left, right, bottom, top, near, far))
        }
    }
    export class Vector3 {
        elements: any
        constructor() {

        }
    }
    export class Vector4 {
        elements: any
        constructor() {

        }
    }
}