// Copyright 2021-2022 David Geo Holmes.  All Rights Reserved.
import { Disc2, Force2, Geometric2, Particle2, Rod2, Spring } from '@geometryzen/newton';
import { AngleAttributes, Board, BoardAttributes, CircleAttributes, JSXGraph, PointAttributes, SegmentAttributes } from 'jsxgraph';
import { JsxAngle } from './JsxAngle';
import { JsxArrow, JsxArrowAttributes } from './JsxArrow';
import { JsxDisc } from './JsxDisc';
import { JsxForce, JsxForceAttributes } from './JsxForce';
import { JsxParticle } from './JsxParticle';
import { JsxRod } from './JsxRod';
import { JsxSpring, SpringAttributes } from './JsxSpring';

interface JsxView {
    removeFromBoard(): void
    update(): void
}

/**
 * A wrapper around a JSXGraph board providing methods for adding objects to
 * a Free Body Diagram.
 */
export class JsxDiagram {
    public readonly board: Board;
    private readonly views: JsxView[] = [];
    /**
     * @param elementId HTML identifier (id) of the DIV element in which the diagram is rendered.
     * @param attributes an object that sets some of the diagram properties.
     */
    constructor(elementId: string, attributes?: Partial<BoardAttributes>) {
        this.board = JSXGraph.initBoard(elementId, attributes);
    }
    addAngle(attributes?: Partial<AngleAttributes>): JsxAngle {
        const view = new JsxAngle(this.board, attributes);
        this.views.push(view);
        return view;
    }
    addArrow(attributes?: Partial<JsxArrowAttributes>): JsxArrow {
        const view = new JsxArrow(this.board, attributes);
        this.views.push(view);
        return view;
    }
    addDisc(disc: Disc2, attributes?: Partial<CircleAttributes>): JsxDisc {
        const view = new JsxDisc(this.board, disc, attributes);
        this.views.push(view);
        return view;
    }
    addForce(force: Force2, attributes?: Partial<JsxForceAttributes>): JsxForce {
        const view = new JsxForce(this.board, force, attributes);
        this.views.push(view);
        return view;
    }
    addParticle(particle: Particle2, attributes?: Partial<PointAttributes>): JsxParticle {
        const view = new JsxParticle(this.board, particle, attributes);
        this.views.push(view);
        return view;
    }
    addRod(rod: Rod2, attributes?: Partial<SegmentAttributes>): JsxRod {
        const view = new JsxRod(this.board, rod, attributes);
        this.views.push(view);
        return view;
    }
    addSpring(spring: Spring<Geometric2>, attributes: SpringAttributes) {
        const view = new JsxSpring(this.board, spring, attributes);
        this.views.push(view);
        return view;
    }
    removeAllFromBoard() {
        const board = this.board;
        board.suspendUpdate();
        try {
            const views = this.views;
            for (const view of views) {
                view.removeFromBoard();
            }
            views.length = 0;
        }
        finally {
            board.unsuspendUpdate();
        }
    }
    update() {
        const views = this.views;
        for (const view of views) {
            view.update();
        }
        this.board.update();
    }
}
