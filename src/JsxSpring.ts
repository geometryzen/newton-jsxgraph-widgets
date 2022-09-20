// Copyright 2021-2022 David Geo Holmes.  All Rights Reserved.
import { Geometric2 } from '@geometryzen/multivectors';
import { Spring } from '@geometryzen/newton';
import { Board, Point, Segment } from 'jsxgraph';
import { JsxWidget } from './JsxWidget';
import { setPosition } from './setPosition';

export interface SpringAttributes {
    radius: number
    rings: number
}

const e1 = Geometric2.e1;
const e2 = Geometric2.e2;

const R = new Geometric2().rotorFromDirections(e1, e2);
const d = new Geometric2();
const e = new Geometric2();
const L = new Geometric2();
const x = new Geometric2();

export class JsxSpring implements JsxWidget {
    private readonly p1: Point;
    private readonly p2: Point;
    private readonly points: Point[] = [];
    private readonly segments: Segment[] = [];
    private $visible = true;
    private readonly $scaleL = Geometric2.scalar(1);
    constructor(private readonly board: Board, private readonly spring: Spring<Geometric2>, config: SpringAttributes) {
        const radius = config.radius;
        const rings = config.rings;
        const quarters = 4 * rings;
        const p1 = board.create('point', [0, 0], { visible: false });
        this.points.push(p1);
        const p2 = board.create('point', [0, 0], { visible: false });
        const N = rings * 2;
        for (let i = 0; i < N; i++) {
            this.points.push(board.create('point', [
                ((k: number) => {
                    return () => {
                        d.x = p2.X() - p1.X();
                        d.y = p2.Y() - p1.Y();
                        L.copyVector(d).magnitude();
                        d.direction();
                        e.copyVector(d).rotate(R).direction();
                        const offset = radius * (1 - 2 * (k % 2)) * e.x;
                        const step = L.a / quarters;
                        return p1.X() + (2 * k + 1) * step * d.x + offset;
                    };
                })(i),
                ((k: number) => {
                    return () => {
                        d.x = p2.X() - p1.X();
                        d.y = p2.Y() - p1.Y();
                        L.copyVector(d).magnitude();
                        d.direction();
                        e.copyVector(d).rotate(R).direction();
                        const offset = radius * (1 - 2 * (k % 2)) * e.y;
                        const step = L.a / quarters;
                        return p1.Y() + (2 * k + 1) * step * d.y + offset;
                    };
                })(i)
            ], { visible: false }));
        }
        this.points.push(p2);
        const numSegments = this.points.length - 1;
        for (let i = 0; i < numSegments; i++) {
            this.segments.push(board.create('segment', [this.points[i], this.points[i + 1]], { color: 'black', strokeWidth: 1 }));
        }
        this.p1 = p1;
        this.p2 = p2;
    }
    get scaleL(): Geometric2 {
        return this.$scaleL;
    }
    set scaleL(scaleL: Geometric2) {
        this.$scaleL.copyScalar(scaleL.a, scaleL.uom);
    }
    removeFromBoard(): void {
        const board = this.board;
        board.suspendUpdate();
        try {
            this.board.removeObject(this.segments, false);
            this.board.removeObject(this.points, false);
            this.board.removeObject(this.p2, false);
            this.board.removeObject(this.p1, false);
        }
        finally {
            board.unsuspendUpdate();
        }
    }
    update(): void {
        if (this.$visible) {
            const scaleL = this.scaleL;
            x.copyVector(this.spring.end1).divByScalar(scaleL.a, scaleL.uom);
            setPosition(this.p1, x);
            x.copyVector(this.spring.end2).divByScalar(scaleL.a, scaleL.uom);
            setPosition(this.p2, x);
        }
    }
    get visible() {
        return this.$visible;
    }
    set visible(visible: boolean) {
        if (visible !== this.$visible) {
            if (visible) {
                for (const segment of this.segments) {
                    segment.setAttribute({ 'visible': true });
                }
            }
            else {
                for (const segment of this.segments) {
                    segment.setAttribute({ 'visible': false });
                }
            }
            this.$visible = visible;
        }
    }

    get end1(): Point {
        return this.p1;
    }
}
