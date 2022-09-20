// Copyright 2021-2022 David Geo Holmes.  All Rights Reserved.
import { Geometric2, Unit } from '@geometryzen/multivectors';
import { Force2 } from '@geometryzen/newton';
import { Arrow, ArrowAttributes, Board } from 'jsxgraph';
import { JsxWidget } from './JsxWidget';
import { setPosition } from './setPosition';

const diagramX = new Geometric2();
const diagramF = new Geometric2();

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JsxForceAttributes extends ArrowAttributes {
}

export class JsxForce implements JsxWidget {
    private readonly arrow: Arrow;
    private readonly $scaleF = Geometric2.scalar(1);
    private readonly $scaleL = Geometric2.scalar(1);
    private $visible = true;
    constructor(private readonly board: Board, public readonly force: Force2, attributes?: Partial<JsxForceAttributes>) {
        this.arrow = board.create('arrow', [[0, 0], [0, 0]], attributes);
    }
    removeFromBoard(): void {
        const board = this.board;
        board.suspendUpdate();
        try {
            this.board.removeObject(this.arrow, false);
        }
        finally {
            board.unsuspendUpdate();
        }
    }
    update(): void {
        if (this.$visible) {
            diagramX.copyVector(this.force.x);
            diagramX.divByScalar(this.scaleL.a, this.scaleL.uom);
            diagramF.copyVector(this.force.F);
            diagramF.divByScalar(this.scaleF.a, this.scaleF.uom);
            if (!Unit.isOne(diagramX.uom)) {
                throw new Error(`JsxForce.update() unable to show force.x ${this.force.x}. Change JsxForce.scaleX so that force.x divided by scaleX is dimensionless.`);
            }
            if (!Unit.isOne(diagramF.uom)) {
                throw new Error(`JsxForce.update() unable to show force.F ${this.force.F}. Change JsxForce.scaleF so that force.F divided by scaleF is dimensionless.`);
            }
            setPosition(this.arrow.point1, diagramX);
            diagramX.addVector(diagramF);
            setPosition(this.arrow.point2, diagramX);
        }
    }
    get scaleF() {
        return this.$scaleF;
    }
    set scaleF(scaleF: Geometric2) {
        this.$scaleF.copyScalar(scaleF.a, scaleF.uom);
    }
    get scaleL() {
        return this.$scaleL;
    }
    set scaleL(scaleL: Geometric2) {
        this.$scaleL.copyScalar(scaleL.a, scaleL.uom);
    }
    get visible() {
        // console.log(`attributes=>${JSON.stringify(this.arrow.getAttributes()}`))
        return this.$visible;
    }
    set visible(visible: boolean) {
        if (visible !== this.$visible) {
            if (visible) {
                this.arrow.showElement();
                // this.arrow.setDisplayRendNode(true)
            }
            else {
                this.arrow.hideElement();
                // this.arrow.setDisplayRendNode(false)
            }
            this.$visible = visible;
        }
    }
}
