import React, { useEffect, useMemo, useRef } from 'react';

function Background() {
  const noiseCanvas = useRef();

  useEffect(() => {
    const noise = () => {
      let canvas, ctx;

      let wWidth, wHeight;

      let noiseData = [];
      let frame = 0;

      let loopTimeout;

      // Create Noise
      const createNoise = () => {
        const idata = ctx.createImageData(wWidth, wHeight);
        const buffer32 = new Uint32Array(idata.data.buffer);
        const len = buffer32.length;

        for (let i = 0; i < len; i++) {
          if (Math.random() < 0.5) {
            buffer32[i] = 0xff000000;
          }
        }

        noiseData.push(idata);
      };

      // Play Noise
      const paintNoise = () => {
        if (frame === 9) {
          frame = 0;
        } else {
          frame++;
        }

        ctx.putImageData(noiseData[frame], 0, 0);
      };

      // Loop
      const loop = () => {
        paintNoise(frame);

        loopTimeout = window.setTimeout(() => {
          window.requestAnimationFrame(loop);
        }, 1000 / 25);
      };

      // Setup
      const setup = () => {
        wWidth = window.innerWidth;
        wHeight = window.innerHeight;

        canvas.width = wWidth;
        canvas.height = wHeight;

        for (let i = 0; i < 10; i++) {
          createNoise();
        }

        loop();
      };

      // Reset
      let resizeThrottle;
      const reset = () => {
        window.addEventListener(
          'resize',
          () => {
            window.clearTimeout(resizeThrottle);

            resizeThrottle = window.setTimeout(() => {
              window.clearTimeout(loopTimeout);
              setup();
            }, 200);
          },
          false
        );
      };

      // Init
      canvas = noiseCanvas.current;
      ctx = canvas.getContext('2d');

      setup();
    };

    if (typeof window !== 'undefined') {
      noise();
    }
  }, []);

  return (
    <>
      <canvas ref={noiseCanvas} className="w-screen h-screen fixed top-0 left-0 pointer-events-none" />
      <style jsx>{`
        canvas {
          z-index: 0;
          opacity: 0.02;
        }
      `}</style>
    </>
  );
}

export default Background;