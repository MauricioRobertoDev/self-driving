export enum Direction {
    "TOP" = "top",
    "DOWN" = "down",
    "LEFT" = "left",
    "RIGHT" = "right",
}

export type Dot = { x: number; y: number };

export function lerp(A: number, B: number, t: number): number {
    return A + (B - A) * t;
}

export function getIntersection(A: Dot, B: Dot, C: Dot, D: Dot) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t,
            };
        }
    }

    return null;
}

export function polysIntersect(polyA: Dot[], polyB: Dot[]): boolean {
    for (let i = 0; i < polyA.length; i++) {
        for (let j = 0; j < polyB.length; j++) {
            const touch = getIntersection(
                polyA[i],
                polyA[(i + 1) % polyA.length],
                polyB[j],
                polyB[(j + 1) % polyB.length],
            );
            if (touch) return true;
        }
    }
    return false;
}
