import React, { useEffect } from 'react';

type IntersectionPair = [number, number];

function setup() {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
  if (!canvas) {
    return;
  }
  const ctx = canvas!.getContext('2d');
  if (!ctx) {
    return;
  }

  ctx.strokeStyle = 'black';

  let width = window.innerWidth;
  let height = window.innerHeight;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  const vLineCount = Math.ceil(width / 50); // vertical lines span X axis
  const hLineCount = Math.ceil(height / 50); // horizontal lines span the Y axis
  const intersectionCount = vLineCount * hLineCount;
  const halfIntersectionCount = Math.ceil(intersectionCount / 2);

  function getIntersectionPair(): IntersectionPair {
    const a = Math.floor(Math.random() * vLineCount);
    const b = Math.floor(Math.random() * hLineCount);
    return [a, b];
  }

  const intersections: IntersectionPair[] = (() => {
    return Array(halfIntersectionCount)
      .fill(null)
      .map(() => getIntersectionPair());
  })();

  function clear() {
    ctx!.clearRect(0, 0, width, height);
  }

  function draw() {
    clear();

    for (let i = 0; i < vLineCount; i++) {
      const idx = i + 1;
      ctx!.beginPath();
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx!.moveTo(idx * 50, 0);
      ctx!.lineTo(idx * 50, height);
      ctx!.stroke();
    }

    for (let i = 0; i < hLineCount; i++) {
      const idx = i + 1;
      ctx!.beginPath();
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx!.moveTo(0, idx * 50);
      ctx!.lineTo(width, idx * 50);
      ctx!.stroke();
    }

    for (let i = 0; i < intersections.length; i++) {
      const [a, b] = intersections[i];
      ctx!.beginPath();
      ctx!.strokeStyle = 'rgba(255, 0, 0, 1)';
      ctx!.lineWidth = 10;
      ctx!.moveTo((a + 1) * 50, b * 50);
      ctx!.lineTo((a + 1) * 50, (b + 1) * 50);
      ctx!.stroke();
    }
  }

  function animate() {
    const [a, b] = getIntersectionPair();

    if (intersections.length > halfIntersectionCount) {
      intersections.shift();
    }
    intersections.push([a, b]);

    draw();
  }

  const interval = setInterval(animate, 250);

  return { canvas, ctx, interval, clear };
}

export default function App() {
  useEffect(() => {
    const result = setup();

    return () => {
      if (result) {
        const { interval, clear } = result;
        clear();
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <div>
      <canvas id="canvas" />
    </div>
  );
}
