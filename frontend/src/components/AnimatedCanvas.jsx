import React, { useEffect, useRef } from "react";
import bgimage from "../assets/images/bgimage.jpg";

const AnimatedCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    let particles = [];
    let properties = {
      bgColor: "#0000ff",
      particleColor: "#ffffff",
      particleRadius: 3,
      particleCount: 60,
      particleMaxVelocity: 0.5,
      lineLength: 150,
      particleLife: 6,
    };

    window.onresize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.velocityX =
          Math.random() * (properties.particleMaxVelocity * 2) -
          properties.particleMaxVelocity;
        this.velocityY =
          Math.random() * (properties.particleMaxVelocity * 2) -
          properties.particleMaxVelocity;
        this.life = Math.random() * properties.particleLife * 60;
      }

      position() {
        this.x + this.velocityX > w && this.velocityX > 0
          ? (this.velocityX *= -1)
          : this.x + this.velocityX < 0 && this.velocityX < 0
          ? (this.velocityX *= -1)
          : (this.velocityX = this.velocityX);
        this.y + this.velocityY > h && this.velocityY > 0
          ? (this.velocityY *= -1)
          : this.y + this.velocityY < 0 && this.velocityY < 0
          ? (this.velocityY *= -1)
          : (this.velocityY = this.velocityY);

        this.x += this.velocityX;
        this.y += this.velocityY;
      }

      reDraw() {
        context.beginPath();
        context.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = properties.particleColor;
        context.fill();
      }

      reCalculateLife() {
        if (this.life < 1) {
          this.x = Math.random() * w;
          this.y = Math.random() * h;
          this.velocityX =
            Math.random() * (properties.particleMaxVelocity * 2) -
            properties.particleMaxVelocity;
          this.velocityY =
            Math.random() * (properties.particleMaxVelocity * 2) -
            properties.particleMaxVelocity;
          this.life = Math.random() * properties.particleLife * 60;
        }
        this.life--;
      }
    }

    const reDrawBackground = () => {
      const img = new Image();
      img.src = bgimage;

      img.onload = () => {
        context.drawImage(img, 0, 0, w, h);
      };
    };

    const drawLines = () => {
      let x1, y1, x2, y2, length, opacity;
      for (let i in particles) {
        for (let j in particles) {
          x1 = particles[i].x;
          y1 = particles[i].y;
          x2 = particles[j].x;
          y2 = particles[j].y;
          length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          if (length < properties.lineLength) {
            opacity = 1 - length / properties.lineLength;
            context.lineWidth = "0.5";
            context.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.closePath();
            context.stroke();
          }
        }
      }
    };

    const reDrawParticles = () => {
      for (let i in particles) {
        particles[i].reCalculateLife();
        particles[i].position();
        particles[i].reDraw();
      }
    };

    const loop = () => {
      reDrawBackground();
      reDrawParticles();
      drawLines();
      requestAnimationFrame(loop);
    };

    const init = () => {
      for (let i = 0; i < properties.particleCount; i++) {
        particles.push(new Particle());
      }
      loop();
    };

    init();
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full"></canvas>;
};

export default AnimatedCanvas;
