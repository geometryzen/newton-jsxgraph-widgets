// Copyright 2021-2022 David Geo Holmes.  All Rights Reserved.
import { Geometric2 } from '@geometryzen/multivectors';
import { Polygon2 } from '@geometryzen/newton';
import { Board, Point, Polygon, PolygonAttributes } from 'jsxgraph';
import { JsxWidget } from './JsxWidget';
import { setPosition } from './setPosition';

const tempX = Geometric2.scalar(0);

export class JsxPolygon implements JsxWidget {
    private jxgPoints: Point[] = [];
    private jxgX: Point;
    private readonly polygon: Polygon;
    private readonly $scaleL = Geometric2.scalar(1);
    private $visible = true;
    constructor(private readonly board: Board, private readonly body: Polygon2, attributes?: Partial<PolygonAttributes>) {
        const N = body.rs.length;
        const jxgPoints = this.jxgPoints;
        for (let i = 0; i < N; i++) {
            jxgPoints.push(board.create('point', [0, 0], { visible: false }));
        }
        this.polygon = board.create('polygon', jxgPoints, attributes);
        this.jxgX = board.create('point', [0, 0], { visible: false });
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
            board.removeObject(this.jxgX, false);
            board.removeObject(this.polygon, false);
            board.removeObject(this.jxgPoints, false);
        }
        finally {
            board.unsuspendUpdate();
        }
    }
    update(): void {
        if (this.$visible) {
            const scaleL = this.scaleL;
            const X = this.body.X;
            const R = this.body.R;
            const jxgPoints = this.jxgPoints;
            const rs = this.body.rs;
            const N = jxgPoints.length;
            for (let i = 0; i < N; i++) {
                const jxgPoint = jxgPoints[i];
                const r = rs[i];
                tempX.copyVector(r).rotate(R).addVector(X).divByScalar(scaleL.a, scaleL.uom);
                setPosition(jxgPoint, tempX);
            }
            tempX.copyVector(X).divByScalar(scaleL.a, scaleL.uom);
            setPosition(this.jxgX, X);
        }
    }
    get visible() {
        return this.$visible;
    }
    set visible(visible: boolean) {
        if (visible !== this.$visible) {
            if (visible) {
                this.polygon.setAttribute({ 'visible': true });
            }
            else {
                this.polygon.setAttribute({ 'visible': false });
            }
            this.$visible = visible;
        }
    }
}
