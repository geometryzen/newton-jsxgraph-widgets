// Copyright 2021-2022 David Geo Holmes.  All Rights Reserved.
import { Geometric2 } from '@geometryzen/multivectors';
import { Disc2 } from '@geometryzen/newton';
import { Board, Circle, CircleAttributes, Point } from 'jsxgraph';
import { JsxWidget } from './JsxWidget';
import { setPosition } from './setPosition';

const e1 = Geometric2.e1;
const scratch = new Geometric2([0, 0, 0, 0]);

export class JsxDisc implements JsxWidget {
    public readonly centerPoint: Point;
    private readonly radiusPoint: Point;
    private readonly circle: Circle;
    private readonly $scaleL = Geometric2.scalar(1);
    private $visible = true;
    constructor(private readonly board: Board, private readonly disc: Disc2, attributes?: Partial<CircleAttributes>) {
        this.centerPoint = board.create('point', [0, 0], { color: 'red', visible: false });
        this.radiusPoint = board.create('point', [0, 1], { color: 'red', visible: false });
        this.circle = board.create('circle', [this.centerPoint, this.radiusPoint], attributes);
    }
    get scaleL(): Geometric2 {
        return this.$scaleL;
    }
    set scaleL(scaleL: Geometric2) {
        this.$scaleL.copyScalar(scaleL.a, scaleL.uom);
    }
    removeFromBoard() {
        const board = this.board;
        board.suspendUpdate();
        try {
            this.board.removeObject(this.circle, false);
            this.board.removeObject(this.radiusPoint, false);
            this.board.removeObject(this.centerPoint, false);
        }
        finally {
            board.unsuspendUpdate();
        }
    }
    update(): void {
        if (this.$visible) {
            const disc = this.disc;
            const X = disc.X;
            const r = disc.radius;
            const scaleL = this.$scaleL;
            scratch.copy(X).divByScalar(scaleL.a, scaleL.uom);
            setPosition(this.centerPoint, scratch);
            scratch.copy(r).mul(e1).add(X).divByScalar(scaleL.a, scaleL.uom);
            setPosition(this.radiusPoint, scratch);
        }
    }
    get visible() {
        return this.$visible;
    }
    set visible(visible: boolean) {
        if (visible !== this.$visible) {
            this.circle.setAttribute({ visible });
            this.$visible = visible;
        }
    }
}
