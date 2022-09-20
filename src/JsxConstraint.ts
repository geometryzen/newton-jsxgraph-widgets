// Copyright 2021-2022 David Geo Holmes.  All Rights Reserved.
import { Geometric2 } from '@geometryzen/multivectors';
import { SurfaceConstraint2 } from '@geometryzen/newton';
import { Arrow, ArrowAttributes, Board } from 'jsxgraph';
import { JsxWidget } from './JsxWidget';
import { setPosition } from './setPosition';

const one = Geometric2.one;
const m = Geometric2.one;
const N = Geometric2.one;

const scratchX = new Geometric2([0, 0, 0, 0]);
const scratchF = new Geometric2([0, 0, 0, 0]);

export interface ForceLawViewOptions {
    visible: boolean
    name: string
}

export class JsxConstraint implements JsxWidget {
    public scaleL = one.divByScalar(m.a, m.uom);
    public scaleF = one.divByScalar(N.a, N.uom);
    public readonly visible: boolean;
    private readonly arrows: Arrow[] = [];
    constructor(board: Board, private readonly forceLaw: SurfaceConstraint2, options?: Partial<ForceLawViewOptions>) {
        for (let i = 0; i < 1; i++) {
            const atts: ArrowAttributes = {
                strokeWidth: 2,
                lastArrow: { type: 1 }
            };
            if (options) {
                if (typeof options.name === 'string') {
                    atts.withLabel = true;
                    atts.name = options.name;
                }
            }
            if (options) {
                if (typeof options.visible === 'boolean') {
                    atts.visible = options.visible;
                    this.visible = options.visible;
                }
            }
            this.arrows.push(board.create('arrow', [[0, 0], [0, 0]], atts));
        }
        this.visible = true;
    }
    removeFromBoard(): void {
        throw new Error('Method not implemented.');
    }
    update(): void {
        const X = this.forceLaw.getBody().X;
        const F = this.forceLaw.N;
        const scaleL = this.scaleL;
        const scaleF = this.scaleF;
        scratchX.copy(X).mul(scaleL);
        scratchF.copy(F).mul(scaleF);
        setPosition(this.arrows[0].point1, scratchX);
        scratchX.add(scratchF);
        setPosition(this.arrows[0].point2, scratchX);
        if (this.visible) {
            // this.arrows[i].setDisplayRendNode(true)
            // this.arrows[0].showElement()
        }
        else {
            // https://github.com/jsxgraph/jsxgraph/issues/345
            // console.log(this.arrows[i].visPropOld.visible)
            // this.arrows[i].setDisplayRendNode(false)
            // this.board.renderer.display(this.arrows[i], false)
            // this.arrows[0].hideElement()
        }
    }
}
