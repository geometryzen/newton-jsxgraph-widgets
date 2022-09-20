// Copyright 2021-2022 David Geo Holmes.  All Rights Reserved.
import { Geometric2 } from '@geometryzen/multivectors';
import { Arrow, ArrowAttributes, Board, Point } from 'jsxgraph';
import { JsxWidget } from './JsxWidget';
import { setPosition } from './setPosition';

const position = new Geometric2();

export interface JsxArrowAttributes extends ArrowAttributes {
    mutableHead: boolean;
    mutableTail: boolean;
}

export class JsxArrow implements JsxWidget {
    private readonly arrow: Arrow;
    private readonly head: Point | undefined;
    private readonly tail: Point | undefined;
    private readonly $vector = Geometric2.vector(1, 0);
    private readonly $pos = Geometric2.vector(0, 0);
    private $visible = true;
    constructor(private readonly board: Board, attributes?: Partial<JsxArrowAttributes>) {
        this.arrow = board.create('arrow', [[0, 0], [0, 0]], attributes);
        if (attributes && attributes.mutableHead) {
            const color = attributes ? attributes.color : void 0;
            const head = board.create('point', [1, 0], { withLabel: false, color });
            this.head = head;
            this.updateHead();
            head.on('down', (e: Event) => {
                e.preventDefault();
            });
            head.on('drag', (e: Event) => {
                e.preventDefault();
                this.$vector.x = head.X() - this.$pos.x;
                this.$vector.y = head.Y() - this.$pos.y;
            });
            head.on('up', (e: Event) => {
                e.preventDefault();
                this.$vector.x = head.X() - this.$pos.x;
                this.$vector.y = head.Y() - this.$pos.y;
            });
        }
        else {
            this.head = void 0;
        }
        if (attributes && attributes.mutableTail) {
            const color = attributes ? attributes.color : void 0;
            const tail = board.create('point', [0, 0], { withLabel: false, color });
            this.tail = tail;
            this.updateTail();
            tail.on('down', (e: Event) => {
                e.preventDefault();
            });
            tail.on('drag', (e: Event) => {
                e.preventDefault();
                const px = this.$pos.x;
                const py = this.$pos.y;
                this.$pos.x = tail.X();
                this.$pos.y = tail.Y();
                this.$vector.x = this.$vector.x + px - this.$pos.x;
                this.$vector.y = this.$vector.y + py - this.$pos.y;
            });
            tail.on('up', (e: Event) => {
                e.preventDefault();
                const px = this.$pos.x;
                const py = this.$pos.y;
                this.$pos.x = tail.X();
                this.$pos.y = tail.Y();
                this.$vector.x = this.$vector.x + px - this.$pos.x;
                this.$vector.y = this.$vector.y + py - this.$pos.y;
            });
        }
        else {
            this.tail = void 0;
        }
    }
    get pos(): Geometric2 {
        return this.$pos;
    }
    set pos(pos: Geometric2) {
        this.$pos.copyVector(pos);
        if (this.tail) {
            this.updateTail();
        }
        if (this.head) {
            this.updateHead();
        }
    }
    get vector(): Geometric2 {
        return this.$vector;
    }
    set vector(value: Geometric2) {
        this.$vector.copyVector(value);
        if (this.head) {
            this.updateHead();
        }
    }
    removeFromBoard(): void {
        const board = this.board;
        board.suspendUpdate();
        try {
            if (this.tail) {
                this.board.removeObject(this.tail, false);
            }
            if (this.head) {
                this.board.removeObject(this.head, false);
            }
            this.board.removeObject(this.arrow, false);
        }
        finally {
            board.unsuspendUpdate();
        }
    }
    update(): void {
        position.copyVector(this.$pos);
        setPosition(this.arrow.point1, position);
        position.copyVector(this.$pos).addVector(this.$vector);
        setPosition(this.arrow.point2, position);
    }
    get visible(): boolean {
        return this.$visible;
    }
    set visible(visible: boolean) {
        if (visible !== this.$visible) {
            if (visible) {
                this.arrow.setAttribute({ 'visible': true });
            }
            else {
                this.arrow.setAttribute({ 'visible': false });
            }
            this.$visible = visible;
        }
    }
    private updateTail(): void {
        if (this.tail) {
            position.copyVector(this.$pos);
            setPosition(this.tail, position);
        }
    }
    private updateHead(): void {
        if (this.head) {
            position.copyVector(this.$pos).addVector(this.$vector);
            setPosition(this.head, position);
        }
    }
}
