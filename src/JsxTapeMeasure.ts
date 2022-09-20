// Copyright 2021-2022 David Geo Holmes.  All Rights Reserved.
import { Geometric2 } from '@geometryzen/multivectors';
import { Board, Point, Tapemeasure } from 'jsxgraph';
import { JsxWidget } from './JsxWidget';
import { setPosition } from './setPosition';

const e1 = Geometric2.e1;
const e2 = Geometric2.e2;
const R = Geometric2.rotorFromVectorToVector(e1, e2);

const scratchD = new Geometric2([0, 0, 0, 0]);
const scratchX = new Geometric2([0, 0, 0, 0]);

export class JsxTapeMeasure implements JsxWidget {
    b: Point;
    e: Point;
    scaleL: Geometric2 = Geometric2.one;
    standoff = 0;
    private readonly tapemeasure: Tapemeasure;
    private $visible = true;
    constructor(board: Board, private readonly beginFn: () => Geometric2, private readonly endFn: () => Geometric2) {
        const b = board.create('point', [0.0, 0.0], { visible: false });
        const e = board.create('point', [0.0, 0.0], { visible: false });
        this.tapemeasure = board.create('tapemeasure', [
            [
                function () {
                    return b.X();
                },
                function () {
                    return b.Y();
                }
            ],
            [
                function () {
                    return e.X();
                },
                function () {
                    return e.Y();
                }
            ]
        ]);
        this.b = b;
        this.e = e;
    }
    removeFromBoard(): void {
        throw new Error('Method not implemented.');
    }
    update() {
        const b = this.beginFn();
        const e = this.endFn();
        const scaleL = this.scaleL;
        scratchD.copy(e).sub(b).direction().rotate(R).mulByNumber(this.standoff);
        scratchX.copy(b).divByScalar(scaleL.a, scaleL.uom).add(scratchD);
        setPosition(this.b, scratchX);
        scratchX.copy(e).divByScalar(scaleL.a, scaleL.uom).add(scratchD);
        setPosition(this.e, scratchX);
    }
    get visible() {
        return this.$visible;
    }
    set visible(visible: boolean) {
        if (visible !== this.$visible) {
            this.tapemeasure.setAttribute({ visible });
            this.$visible = visible;
        }
    }
}
