export class Vector2 {
    constructor(public x: number, public y: number) { }
    dot(vec2: Vector2) {
        return this.x * vec2.x + this.y * vec2.y;
    }
    multiply(val: number) {
        return new Vector2(this.x * val, this.y * val);
    }
    sub(vec2: Vector2) {
        return new Vector2(this.x - vec2.x, this.y - vec2.y);
    }
    vertical() { // 该向量的垂直向量
        // x1 * x2 + y1 * y2 = 0
        // x1x2 = -y1y2
        // y2/x2 = -x1/y1
        if (this.x === 0 && this.y === 0) {
            return new Vector2(0, 0);
        }
        if (this.x === 0 || this.y === 0) {
            return new Vector2(this.y, this.x);
        }
        const ratio = - this.x / this.y;
        return new Vector2(1, ratio)
    }
    /**
     * 关于n向量的镜像向量
     * @param n 关于的向量
     */
    reflect(n: Vector2) { // v2 = v1 - 2(v1.n)n
        const result = this.sub(n.multiply(2 * this.dot(n)))
        return result;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }
    
    rad() {
		const acos = Math.acos(this.cos());
		const rad = this.y > 0 ? acos : 2 * Math.PI - acos;
		return rad;
	}

	cos() {
		const r = Math.sqrt(this.x * this.x + this.y * this.y);
		return this.x / r;
	}

    static fromRad(rad: number) {
        return new Vector2(Math.cos(rad), Math.sin(rad));
    }
}
