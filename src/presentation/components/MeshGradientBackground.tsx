import React, { useRef, useEffect } from "react";
import { GradientRepository } from "../../data/repositories/GradientRepository";
import { Point } from "../../domain/entities/Point";

const MeshGradientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRepository = new GradientRepository();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    let points = gradientRepository.generatePoints(35, {
      width: canvas.width,
      height: canvas.height
    });

    const drawPoint = (point: Point) => {
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, point.radius
      );
      gradient.addColorStop(0, point.color);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points = gradientRepository.updatePointsPosition(points, {
        width: canvas.width,
        height: canvas.height
      });
      points.forEach(drawPoint);
      requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    />
  );
};

export default MeshGradientBackground;
