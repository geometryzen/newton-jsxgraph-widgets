// Copyright 2021-2022 David Geo Holmes.  All Rights Reserved.
import { Geometric2 } from '@geometryzen/multivectors';
import { ForceLaw } from '@geometryzen/newton';
import { Arrow, ArrowAttributes, Board } from 'jsxgraph';
import { setPosition } from './setPosition';

const one = Geometric2.one;
const m = Geometric2.one;
const N = Geometric2.one;

const scratchX = new Geometric2([0, 0, 0, 0]);
const scratchF = new Geometric2([0, 0, 0, 0]);

export interface ForceLawViewOptions {
    visible: boolean[]
    names: string[]
    colors: string[]
}

export class JsxForceLaw {
    public scaleL = one.clone().copyScalar(m.a, m.uom);
    public scaleF = one.clone().copyScalar(N.a, N.uom);
    public readonly visible: boolean[];
    private readonly arrows: Arrow[] = [];
    constructor(board: Board, private readonly forceLaw: ForceLaw<Geometric2>, options?: Partial<ForceLawViewOptions>) {
        const forces = this.forceLaw.updateForces();
        this.visible = visibleFlags(forceLaw, options);
        for (let i = 0; i < forces.length; i++) {
            const atts: ArrowAttributes = { strokeWidth: 2, lastArrow: { type: 1 }, visible: this.visible[i] };
            if (options && Array.isArray(options.names)) {
                atts.withLabel = true;
                atts.name = options.names[i];
            }
            if (options && Array.isArray(options.colors)) {
                atts.color = options.colors[i];
            }
            this.arrows.push(board.create('arrow', [[0, 0], [0, 0]], atts));
            this.visible.push(true);
        }
    }
    update(): void {
        const forces = this.forceLaw.updateForces();
        const scaleL = this.scaleL;
        const scaleF = this.scaleF;
        for (let i = 0; i < forces.length; i++) {
            scratchX.copy(forces[i].x).divByScalar(scaleL.a, scaleL.uom);
            scratchF.copy(forces[i].F).divByScalar(scaleF.a, scaleF.uom);
            setPosition(this.arrows[i].point1, scratchX);
            scratchX.add(scratchF);
            setPosition(this.arrows[i].point2, scratchX);
            this.arrows[i].setAttribute({ visible: this.visible[i] });
        }
    }
}

function visibleFlags(forceLaw: ForceLaw<Geometric2>, options?: Partial<ForceLawViewOptions>): boolean[] {
    if (options && Array.isArray(options.visible)) {
        return options.visible;
    }
    else {
        const flags: boolean[] = [];
        const forces = forceLaw.updateForces();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _force of forces) {
            flags.push(true);
        }
        return flags;
    }
}
