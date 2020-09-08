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
        /**
        *正射投影矩阵
        * @param left 剪切面左侧坐标
        * @param right 剪切面右侧坐标
        * @param bottom 剪切面底部坐标
        * @param top 剪切面顶部坐标
        * @param top 剪切面顶部坐标
        * @param near 剪切面近处深度坐标
        * @param far 剪切面远处深度坐标
        */
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
        /**
        *锥体投影矩阵
        * @param left 剪切面左侧坐标
        * @param right 剪切面右侧坐标
        * @param bottom 剪切面底部坐标
        * @param top 剪切面顶部坐标
        * @param top 剪切面顶部坐标
        * @param near 剪切面近处深度坐标
        * @param far 剪切面远处深度坐标
        */
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

        /**
         * 视角投影
         * @param {number} fovy The angle between the upper and lower sides of the frustum.
         * @param aspect The aspect ratio of the frustum.(width / height)
         * @param near The distances to the nearer depth clipping plane.This value must be plus value.
         * @param far The distances to the farther depth clipping plane.This value must be plus value.
         */
        setPerspective(fovy: number, aspect: number, near: number, far: number) {
            let e, rd, s, ct;
            if (near === far || aspect === 0) {
                throw "null frustum"
            }
            if (near <= 0) {
                throw "near<=0"
            }
            if (far <= 0) {
                throw "far<=0"
            }
            fovy = Math.PI * fovy / 180 / 2;
            s = Math.sin(fovy)
            if (s === 0) {
                throw "null frustum"
            }
            rd = 1 / (far - near);
            ct = Math.cos(fovy) / s;
            e = this.elements
            e[0] = ct / aspect;
            e[1] = 0;
            e[2] = 0;
            e[3] = 0;

            e[4] = 0;
            e[5] = ct;
            e[6] = 0;
            e[7] = 0;

            e[8] = 0;
            e[9] = 0;
            e[10] = -(far + near) * rd;
            e[11] = -1;

            e[12] = 0;
            e[13] = 0;
            e[14] = -2 * near * far * rd;
            e[15] = 0;

            return this;
        }

        perspective(fovy: number, aspect: number, near: number, far: number) {
            return this.concat(new Matrix4().setPerspective(fovy, aspect, near, far))
        }
        /**
         * 设置缩放矩阵
         * @param  {number} x X轴坐标
         * @param  {number} y Y轴坐标
         * @param  {number} z Z轴坐标
         */
        setScale(x: number, y: number, z: number) {
            let e = this.elements
            e[0] = x; e[4] = 0; e[8] = 0; e[12] = 0;
            e[1] = 0; e[5] = y; e[9] = 0; e[13] = 0;
            e[2] = 0; e[6] = 0; e[10] = z; e[14] = 0;
            e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
            return this;
        }
        /**
         * scale.
         * @param  {number} x X轴坐标
         * @param  {number} y X轴坐标
         * @param  {number} z Z轴坐标
         */
        scale(x: number, y: number, z: number) {
            var e = this.elements;
            e[0] *= x; e[4] *= y; e[8] *= z;
            e[1] *= x; e[5] *= y; e[9] *= z;
            e[2] *= x; e[6] *= y; e[10] *= z;
            e[3] *= x; e[7] *= y; e[11] *= z;
            return this;
        }
        setTranslate(x: number, y: number, z: number) {
            var e = this.elements;
            e[0] = 1; e[4] = 0; e[8] = 0; e[12] = x;
            e[1] = 0; e[5] = 1; e[9] = 0; e[13] = y;
            e[2] = 0; e[6] = 0; e[10] = 1; e[14] = z;
            e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
            return this;
        }
        translate(x: number, y: number, z: number) {
            var e = this.elements;
            e[12] += e[0] * x + e[4] * y + e[8] * z;
            e[13] += e[1] * x + e[5] * y + e[9] * z;
            e[14] += e[2] * x + e[6] * y + e[10] * z;
            e[15] += e[3] * x + e[7] * y + e[11] * z;
            return this;
        }
        /**
        * Set the matrix for rotation.
        * The vector of rotation axis may not be normalized.
        * @param angle The angle of rotation (degrees)
        * @param x The X coordinate of vector of rotation axis.
        * @param y The Y coordinate of vector of rotation axis.
        * @param z The Z coordinate of vector of rotation axis.
        * @return this
        */
        setRotate(angle: number, x: number, y: number, z: number) {
            var e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;

            angle = Math.PI * angle / 180;
            e = this.elements;

            s = Math.sin(angle);
            c = Math.cos(angle);

            if (0 !== x && 0 === y && 0 === z) {
                // Rotation around X axis
                if (x < 0) {
                    s = -s;
                }
                e[0] = 1; e[4] = 0; e[8] = 0; e[12] = 0;
                e[1] = 0; e[5] = c; e[9] = -s; e[13] = 0;
                e[2] = 0; e[6] = s; e[10] = c; e[14] = 0;
                e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
            } else if (0 === x && 0 !== y && 0 === z) {
                // Rotation around Y axis
                if (y < 0) {
                    s = -s;
                }
                e[0] = c; e[4] = 0; e[8] = s; e[12] = 0;
                e[1] = 0; e[5] = 1; e[9] = 0; e[13] = 0;
                e[2] = -s; e[6] = 0; e[10] = c; e[14] = 0;
                e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
            } else if (0 === x && 0 === y && 0 !== z) {
                // Rotation around Z axis
                if (z < 0) {
                    s = -s;
                }
                e[0] = c; e[4] = -s; e[8] = 0; e[12] = 0;
                e[1] = s; e[5] = c; e[9] = 0; e[13] = 0;
                e[2] = 0; e[6] = 0; e[10] = 1; e[14] = 0;
                e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
            } else {
                // Rotation around another axis
                len = Math.sqrt(x * x + y * y + z * z);
                if (len !== 1) {
                    rlen = 1 / len;
                    x *= rlen;
                    y *= rlen;
                    z *= rlen;
                }
                nc = 1 - c;
                xy = x * y;
                yz = y * z;
                zx = z * x;
                xs = x * s;
                ys = y * s;
                zs = z * s;

                e[0] = x * x * nc + c;
                e[1] = xy * nc + zs;
                e[2] = zx * nc - ys;
                e[3] = 0;

                e[4] = xy * nc - zs;
                e[5] = y * y * nc + c;
                e[6] = yz * nc + xs;
                e[7] = 0;

                e[8] = zx * nc + ys;
                e[9] = yz * nc - xs;
                e[10] = z * z * nc + c;
                e[11] = 0;

                e[12] = 0;
                e[13] = 0;
                e[14] = 0;
                e[15] = 1;
            }

            return this;
        }
        rotate(angle: number, x: number, y: number, z: number) {
            return this.concat(new Matrix4().setRotate(angle, x, y, z));
        }
        /**
         * Set the viewing matrix.
         * @param  {number} eyeX
         * @param  {number} eyeY
         * @param  {number} eyeZ The position of the eye point.
         * @param  {number} centerX
         * @param  {number} centerY
         * @param  {number} centerZ The position of the reference point.
         * @param  {number} upX
         * @param  {number} upY
         * @param  {number} upZ The direction of the up vector.
         */
        setLookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number) {
            var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;

            fx = centerX - eyeX;
            fy = centerY - eyeY;
            fz = centerZ - eyeZ;

            // Normalize f.
            rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
            fx *= rlf;
            fy *= rlf;
            fz *= rlf;

            // Calculate cross product of f and up.
            sx = fy * upZ - fz * upY;
            sy = fz * upX - fx * upZ;
            sz = fx * upY - fy * upX;

            // Normalize s.
            rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
            sx *= rls;
            sy *= rls;
            sz *= rls;

            // Calculate cross product of s and f.
            ux = sy * fz - sz * fy;
            uy = sz * fx - sx * fz;
            uz = sx * fy - sy * fx;

            // Set to this.
            e = this.elements;
            e[0] = sx;
            e[1] = ux;
            e[2] = -fx;
            e[3] = 0;

            e[4] = sy;
            e[5] = uy;
            e[6] = -fy;
            e[7] = 0;

            e[8] = sz;
            e[9] = uz;
            e[10] = -fz;
            e[11] = 0;

            e[12] = 0;
            e[13] = 0;
            e[14] = 0;
            e[15] = 1;

            // Translate.
            return this.translate(-eyeX, -eyeY, -eyeZ);
        }
        lookAt(eyeX: number, eyeY: number, eyeZ: number, centerX: number, centerY: number, centerZ: number, upX: number, upY: number, upZ: number) {
            return this.concat(new Matrix4().setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
        }
    }
    export class Vector3 {
        elements: Float32Array
        constructor(opt_src?: Float32Array) {
            let v = new Float32Array(3)
            if (opt_src && typeof opt_src === "object") {
                v[0] = opt_src[0]; v[1] = opt_src[1]; v[2] = opt_src[2];
            }
            this.elements = v
        }
        normalize() {
            let v = this.elements
            var c = v[0], d = v[1], e = v[2], g = Math.sqrt(c * c + d * d + e * e);
            if (g) {
                if (g == 1)
                    return this;
            } else {
                v[0] = 0; v[1] = 0; v[2] = 0;
                return this;
            }
            g = 1 / g;
            v[0] = c * g; v[1] = d * g; v[2] = e * g;
            return this;
        }
    }
    export class Vector4 {
        elements: Float32Array
        constructor(opt_src?: Float32Array) {
            let v = new Float32Array(4)
            if (opt_src && typeof opt_src === "object") {
                v[0] = opt_src[0]; v[1] = opt_src[1]; v[2] = opt_src[2]; v[3] = opt_src[3];
            }
            this.elements = v
        }
    }
}