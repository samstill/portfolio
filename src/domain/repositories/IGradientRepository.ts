import { Point, CanvasDimensions } from '../entities/Point';

export interface IGradientRepository {
  generatePoints(numPoints: number, dimensions: CanvasDimensions): Point[];
  updatePointsPosition(points: Point[], dimensions: CanvasDimensions): Point[];
}
