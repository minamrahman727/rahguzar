"use client";
import { useEffect, useRef } from 'react';

const BubbleAnimation = ({ bubbleCount }: { bubbleCount: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let bubbles: { x: number; y: number; radius: number; color: string; velocityX: number; velocityY: number }[] = [];

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Create bubbles
    const createBubbles = () => {
      bubbles = [];
      for (let i = 0; i < bubbleCount; i++) {
        const radius = Math.random() * 30 + 10;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const color = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
        const velocityX = (Math.random() - 0.5) * 2;
        const velocityY = (Math.random() - 0.5) * 2;

        bubbles.push({ x, y, radius, color, velocityX, velocityY });
      }
    };

    // Draw bubble
    const drawBubble = (bubble: { x: number; y: number; radius: number; color: string }) => {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fillStyle = bubble.color;
      ctx.fill();
    };

    // Update bubble position
    const updateBubble = (bubble: { x: number; y: number; radius: number; color: string; velocityX: number; velocityY: number }) => {
      bubble.x += bubble.velocityX;
      bubble.y += bubble.velocityY;

      // Bounce off the walls
      if (bubble.x + bubble.radius > canvas.width || bubble.x - bubble.radius < 0) {
        bubble.velocityX = -bubble.velocityX;
      }

      if (bubble.y + bubble.radius > canvas.height || bubble.y - bubble.radius < 0) {
        bubble.velocityY = -bubble.velocityY;
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach(bubble => {
        drawBubble(bubble);
        updateBubble(bubble);
      });

      frameId = requestAnimationFrame(animate);
    };

    // Initialize
    setCanvasDimensions();
    createBubbles();
    animate();

    // Handle resize
    const handleResize = () => {
      setCanvasDimensions();
      createBubbles();
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  }, [bubbleCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default BubbleAnimation;