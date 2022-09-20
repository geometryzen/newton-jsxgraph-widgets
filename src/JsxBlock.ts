// Copyright 2021-2022 David Geo Holmes.  All Rights Reserved.
import { Geometric2 } from '@geometryzen/multivectors';
import { Block2 } from '@geometryzen/newton';
import { Board, Point, Polygon, PolygonAttributes } from 'jsxgraph';
import { JsxWidget } from './JsxWidget';
import { setPosition } from './setPosition';

const e1 = Geometric2.e1;
const e2 = Geometric2.e2;

const scratch = new Geometric2([0, 0, 0, 0]);
const scratchW = new Geometric2([0, 0, 0, 0]);
const scratchH = new Geometric2([0, 0, 0, 0]);

export class JsxBlock implements JsxWidget {
    private readonly p1: Point;
    private readonly p2: Point;
    private readonly p3: Point;
    private readonly p4: Point;
    private readonly polygon: Polygon;
    private readonly $scaleL = Geometric2.scalar(1);
    private $visible = true;
    constructor(private readonly board: Board, private readonly block: Block2, attributes?: Partial<PolygonAttributes>) {
        this.p1 = board.create('point', [0.0, 0.0], { visible: false });
        this.p2 = board.create('point', [0.0, 0.0], { visible: false });
        this.p3 = board.create('point', [0.0, 0.0], { visible: false });
        this.p4 = board.create('point', [0.0, 0.0], { visible: false });

        this.polygon = board.create('polygon', [this.p1, this.p2, this.p3, this.p4], attributes);
        block.uuid = this.polygon.id;
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
            this.board.removeObject(this.polygon, false);
            this.board.removeObject(this.p4, false);
            this.board.removeObject(this.p3, false);
            this.board.removeObject(this.p2, false);
            this.board.removeObject(this.p1, false);
        }
        finally {
            board.unsuspendUpdate();
        }
    }
    update() {
        if (this.$visible) {
            const block = this.block;
            const X = block.X;
            const R = block.R;
            const scaleL = this.scaleL;
            scratchW.copy(e1).rotate(R).mul(block.width);
            scratchH.copy(e2).rotate(R).mul(block.height);

            scratch.copy(scratchW).add(scratchH).mulByNumber(0.5).neg().add(X).divByScalar(scaleL.a, scaleL.uom);
            setPosition(this.p1, scratch);

            scratch.copy(scratchW).sub(scratchH).mulByNumber(0.5).add(X).divByScalar(scaleL.a, scaleL.uom);
            setPosition(this.p2, scratch);

            scratch.copy(scratchW).add(scratchH).mulByNumber(0.5).add(X).divByScalar(scaleL.a, scaleL.uom);
            setPosition(this.p3, scratch);

            scratch.copy(scratchW).sub(scratchH).mulByNumber(0.5).neg().add(X).divByScalar(scaleL.a, scaleL.uom);
            setPosition(this.p4, scratch);
        }
    }
    get visible() {
        return this.$visible;
    }
    set visible(visible: boolean) {
        if (visible !== this.$visible) {
            this.polygon.setAttribute({ visible });
            this.$visible = visible;
        }
    }
}
