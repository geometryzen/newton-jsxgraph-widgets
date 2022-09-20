// Copyright 2021-2022 David Geo Holmes.  All Rights Reserved.
import { Particle2 } from '@geometryzen/newton';
import { Board, Point, PointAttributes } from 'jsxgraph';
import { JsxWidget } from './JsxWidget';
import { setPosition } from './setPosition';

/**
 * A rendering of a davinci-newton Particle2 on a JsxGraph board.
 */
export class JsxParticle implements JsxWidget {
    private readonly point: Point;
    private $visible = true;
    /**
     * @param board The JsxGraph board that this JsxParticle will be rendered to. 
     * @param particle The model for this rendering.
     * @param attributes The optional attributes for the creation of the underlying Point.
     */
    constructor(private readonly board: Board, private readonly particle: Particle2, attributes?: Partial<PointAttributes>) {
        if (!(board instanceof Board)) {
            throw new Error("board must be a Board in \"new JsxParticle(board: Board, particle: Particle2, attributes?: PointAttributes)\".");
        }
        if (!(particle instanceof Particle2)) {
            throw new Error("particle must be a Particle2 in \"new JsxParticle(board: Board, particle: Particle2, attributes?: PointAttributes)\".");
        }
        this.point = board.create('point', [0, 0], attributes);
        this.update();
    }
    removeFromBoard(): void {
        const board = this.board;
        board.suspendUpdate();
        try {
            board.removeObject(this.point, false);
        }
        finally {
            board.unsuspendUpdate();
        }
    }
    update(): void {
        setPosition(this.point, this.particle.X);
    }
    get visible() {
        return this.$visible;
    }
    set visible(visible: boolean) {
        if (visible !== this.$visible) {
            this.point.setAttribute({ visible });
            this.$visible = visible;
        }
    }
}
