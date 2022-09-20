// Copyright 2021-2022 David Geo Holmes.  All Rights Reserved.
import { Geometric2, Unit } from '@geometryzen/multivectors';
import { Rod2 } from '@geometryzen/newton';
import { Board, Point, Segment, SegmentAttributes } from 'jsxgraph';
import { JsxWidget } from './JsxWidget';
import { setPosition } from './setPosition';

/**
 * Working storage to avoid temporary object creation during update() method execution.
 */
const tempX = new Geometric2();
const rotA = new Geometric2();

export class JsxRod implements JsxWidget {
    private negPoint: Point;
    private posPoint: Point;
    private readonly segment: Segment;
    private readonly $scaleL = Geometric2.scalar(1);
    private $visible = true;
    constructor(private readonly board: Board, private readonly rod: Rod2, attributes?: Partial<SegmentAttributes>) {
        if (!(board instanceof Board)) {
            throw new Error("board must be a Board in \"new JsxRod(board: Board, rod: Rod2, attributes?: SegmentAttributes)\".");
        }
        if (!(rod instanceof Rod2)) {
            throw new Error("rod must be a Rod2 in \"new JsxRod(board: Board, rod: Rod2, attributes?: SegmentAttributes)\".");
        }
        this.negPoint = board.create('point', [0, 0], { visible: false });
        this.posPoint = board.create('point', [0, 0], { visible: false });
        this.segment = board.create('segment', [this.negPoint, this.posPoint], attributes);
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
            this.board.removeObject(this.segment, false);
            this.board.removeObject(this.posPoint, false);
            this.board.removeObject(this.negPoint, false);
        }
        finally {
            board.unsuspendUpdate();
        }
    }
    update(): void {
        if (this.$visible) {
            const rod = this.rod;
            const X = rod.X;
            const R = rod.R;
            const a = rod.a;
            rotA.copy(a).rotate(R);
            tempX.copy(rotA).neg().add(X).divByScalar(this.scaleL.a, this.scaleL.uom);
            if (!Unit.isOne(tempX.uom)) {
                throw new Error(`scaleL =${this.$scaleL}, tempX=${tempX} JsxRod.update() unable to show rod.a (${this.rod.a}). Change JsxRod.scaleL so that rod.a divided by scaleL is dimensionless.`);
            }
            setPosition(this.negPoint, tempX);
            tempX.copy(rotA).add(X).divByScalar(this.scaleL.a, this.scaleL.uom);
            if (!Unit.isOne(tempX.uom)) {
                throw new Error(`scaleL =${this.$scaleL}, tempX=${tempX} JsxRod.update() unable to show rod.a (${this.rod.a}). Change JsxRod.scaleL so that rod.a divided by scaleL is dimensionless.`);
            }
            setPosition(this.posPoint, tempX);
        }
    }
    get visible() {
        return this.$visible;
    }
    set visible(visible: boolean) {
        if (visible !== this.$visible) {
            this.segment.setAttribute({ visible });
            this.$visible = visible;
        }
    }
}
