import { IGradientRepository } from '../../domain/repositories/IGradientRepository';
import { Point, CanvasDimensions } from '../../domain/entities/Point';
import { GRADIENT_COLORS } from '../constants/colors';

export class GradientRepository implements IGradientRepository {
  private readonly speed = 1;

  generatePoints(numPoints: number, dimensions: CanvasDimensions): Point[] {
    const points: Point[] = [];
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * this.speed,
        vy: (Math.random() - 0.5) * this.speed,
        color: GRADIENT_COLORS[Math.floor(Math.random() * GRADIENT_COLORS.length)],
        radius: Math.random() * 150 + 100,
      });
    }
    return points;
  }

  updatePointsPosition(points: Point[], dimensions: CanvasDimensions): Point[] {
    return points.map(point => {
      const newPoint = { ...point };
      newPoint.x += point.vx;
      newPoint.y += point.vy;

      if (newPoint.x < 0 || newPoint.x > dimensions.width) newPoint.vx *= -1;
      if (newPoint.y < 0 || newPoint.y > dimensions.height) newPoint.vy *= -1;

      return newPoint;
    });
  }
}
