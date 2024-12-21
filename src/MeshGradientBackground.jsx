import React, { useRef, useEffect } from "react";

const MeshGradientBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas to cover the full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Gradient Points Configuration
    const colors = [
      "#FF9A8B", "#FF6A88", "#FF99AC", "#FFB2C1", "#FEC8D8",
      "#A9BAD8", "#6EC3F4", "#B9BEFF", "#69D2E7", "#A7DBD8",
      "#E0E4CC", "#F38630", "#FA6900", "#FE4365", "#FC9D9A",
    ];
    const numPoints = 35; // Denser mesh for smoothness
    const speed = 1; // Smooth speed
    const points = [];

    // Create Points
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: Math.random() * 150 + 100,
      });
    }

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      points.forEach((point) => {
        point.x += point.vx;
        point.y += point.vy;

        // Bounce the points back if they move out of bounds
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        // Draw Gradient
        const gradient = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          point.radius
        );
        gradient.addColorStop(0, point.color);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    // Start Animation
    animate();

    // Handle Resize
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
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
