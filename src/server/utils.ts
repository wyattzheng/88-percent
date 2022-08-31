export class Vector2 {
    constructor(public x: number, public y: number) { }
    dot(vec2: Vector2) {
        return this.x * vec2.x + this.y * vec2.y;
    }
    cross(vec2: Vector2) {
        return this.x * vec2.y - this.y * vec2.x;
    }
    normalize() {
        const len = this.lengthSquared();
        return new Vector2(this.x / len, this.y / len);
    }
    add(vec2: Vector2) {
        return new Vector2(this.x + vec2.x, this.y + vec2.y);
    }
    scale(val: number) {
        return new Vector2(this.x * val, this.y * val);
    }
    sub(vec2: Vector2) {
        return new Vector2(this.x - vec2.x, this.y - vec2.y);
    }
    lengthSquared() {
        return Math.hypot(this.x, this.y);
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
        const result = this.sub(n.scale(2 * this.dot(n)))
        return result;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }
    
    rad() {
		const acos = Math.acos(this.cos());
		const rad = this.y > 0 ? acos : (2 * Math.PI - acos);
		return rad;
	}

	cos() {
		const r = Math.sqrt(this.x * this.x + this.y * this.y);
		return this.x / r;
	}

    hash() {
        return `${this.x}:${this.y}`
    }

    static fromRad(rad: number) {
        return new Vector2(Math.cos(rad), Math.sin(rad));
    }
}

/**
 * 点在直线的哪一边
 * 
 * @returns > 0 在右边, = 0 在线上, < 0 在左边
 */
export function sideOfSegment(M: Vector2, A: Vector2, B: Vector2) {
    return (B.y - M.y) * (A.x - M.x) - (A.y - M.y) * (B.x - M.x);
}

export function isPointInRect(M: Vector2, from: Vector2, to: Vector2) {
    return Math.min(from.x, to.x) <= M.x && M.x <= Math.max(from.x, to.x) && 
           Math.min(from.y, to.y) <= M.y && M.y <= Math.max(from.y, to.y);
}

export function getCrossPoint(A: Vector2, B: Vector2, C: Vector2, D: Vector2) {
    const p = A;
    const u = B.sub(A).normalize();
    const q = C;
    const v = D.sub(C).normalize();
    return p.add(u.scale(q.sub(p).cross(v) / u.cross(v)));
}

export function checkSegmentCross(A: Vector2, B: Vector2, C: Vector2, D: Vector2) {
    const posA = sideOfSegment(A, C, D);
    const posB = sideOfSegment(B, C, D);
    const posC = sideOfSegment(C, A, B);
    const posD = sideOfSegment(D, A, B);

    const min = 1e-4;

    if(posA * posB < -min && posC * posD < -min) { // 跨立实验
        return {point: getCrossPoint(A, B, C, D), onsegment: false};
    }

     // 点在直线上, 且点在矩形中 -> 点在线段上
    if (Math.abs(posA) < min && isPointInRect(A, C, D)) {
        return {point: A, onsegment: true};
    }
    if (Math.abs(posB) < min && isPointInRect(B, C, D)) {
        return {point: B, onsegment: true};
    }
    if (Math.abs(posC) < min && isPointInRect(C, A, B)) {
        return {point: C, onsegment: true};
    }
    if (Math.abs(posD) < min && isPointInRect(D, A, B)) {
        return {point: D, onsegment: true};
    }

    return false;
}

export function getPointsSegmentInRect(segA: Vector2, segB: Vector2, minX: number, maxX: number, minY: number, maxY: number): Vector2[] {
    const points: Vector2[] = [];

	if (segB.x === segA.x) {
		const mnY = Math.min(segA.y, segB.y);
		const mxY = Math.max(segA.y, segB.y);
		if (!(segA.x >= minX && segA.x < maxX)) {
			return [];
		}
		if (minY >= mnY && minY < mxY) {
			points.push(new Vector2(segA.x, minY))
		}
		if (maxY >= mnY && maxY < mxY) {
			points.push(new Vector2(segA.x, maxY))
		}
		return points;
	}

	if (segB.y === segA.y) {
		const mnX = Math.min(segA.x, segB.x);
		const mxX = Math.max(segA.x, segB.x);
		if (!(segA.y >= minY && segA.y < maxY)) {
			return [];
		}
		if (minX >= mnX && minX < mxX) {
			points.push(new Vector2(minX, segA.y))
		}
		if (maxX >= mnX && maxX < mxX) {
			points.push(new Vector2(maxX, segA.y))
		}
		return points;
	}


    const k = (segB.y - segA.y) / (segB.x - segA.x); // k = tan(x)
    const b = segA.y - k * segA.x; // b = y1 - k * x1

    const y1 = k * minX + b;
    if (minY <= y1 && y1 < maxY) {
        points.push(new Vector2(minX, y1));
    }

    const y2 = k * maxX + b;
    if (minY <= y2 && y2 < maxY) {
        points.push(new Vector2(maxX, y2));
    }

    // x = (y - b) / k
    const x1 = (minY - b) / k;
    if (minX <= x1 && x1 < maxX) {
        points.push(new Vector2(x1, minY));
    }

    const x2 = (maxY - b) / k;
    if (minX <= x2 && x2 < maxX) {
        points.push(new Vector2(x2, maxY));
    }

    return points;
}

export function getFirstPointInSegment(segA: Vector2, segB: Vector2, points: Vector2[]) {
	if (points.length <= 0) {
		return;
	}
	if (segA.x === segB.x) {
		return points.sort((a, b) => (Math.abs(a.y - segA.y) - Math.abs(b.y - segA.y)))[0];
	}
	return points.sort((a, b) => (Math.abs(a.x - segA.x) - Math.abs(b.x - segA.x)))[0];
}

export function adjustColorLightness(color: number, lightness: number) {
    let b = color >> 0 & 0xFF
    let g = color >> 8 & 0xFF
    let r = color >> 16 & 0xFF;

    b += lightness;
    g += lightness;
    r += lightness;

    if (b > 255) {
        b = 255;
    } else if (b < 0){
        b = 0;
    }
    if (g > 255) {
        g = 255;
    } else if (g < 0){
        g = 0;
    }
    if (r > 255) {
        r = 255;
    } else if (r < 0){
        r = 0;
    }

    let res = r << 16 & 0xFFFFFF
    res |= g << 8 & 0xFFFF;
    res |= b & 0xFF;
    return res;
}