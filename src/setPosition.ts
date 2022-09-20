import { COORDS_BY_USER, GeometryElement } from "jsxgraph";
/**
 * Sets the postion of the geometry element.
 * For the change to take effect, the board must be updated.
 * @param element The geometry element to be positioned.
 * @param position The desired position vector.
 * @returns A reference to the geometry element.
 */
export function setPosition<T extends GeometryElement>(element: T, position: { x: number; y: number }): T {
    return element.setPosition(COORDS_BY_USER, [position.x, position.y]);
}


/*
const coords: [number, number] = [0, 0];

export function setPositionII(point: Point, position: Geometric2) {
    coords[0] = position.x;
    coords[1] = position.y;
    point.setPosition(COORDS_BY_USER, coords);
}
*/
