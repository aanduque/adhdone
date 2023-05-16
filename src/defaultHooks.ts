import { addAction } from "@wordpress/hooks";
import confetti from "canvas-confetti";

export default () => {
  console.log('Initializing default hooks...')

  addAction("task.completed", "core", (task, group) => {
    console.log('Confetti!')

    // do this for 30 seconds
    var duration = 2 * 1000;
    var end = Date.now() + duration;

    (function frame() {

      const colors = [
        "#1abc9c",
        "#3498db",
        "#9b59b6",
        "#34495e",
        "#f1c40f",
        "#e67e22",
        "#e74c3c",
        "#95a5a6",
        "#8e44ad",
        "#2c3e50",
        "#2980b9",
        "#27ae60",
        "#16a085",
        "#f39c12",
      ];

      // launch a few confetti from the left edge
      confetti({
        colors,
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      // and launch a few from the right edge
      confetti({
        colors,
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      // keep going until we are out of time
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // confetti({
    //   particleCount: 300,
    //   colors: [
    //     "#1abc9c",
    //     "#3498db",
    //     "#9b59b6",
    //     "#34495e",
    //     "#f1c40f",
    //     "#e67e22",
    //     "#e74c3c",
    //     "#95a5a6",
    //     "#8e44ad",
    //     "#2c3e50",
    //     "#2980b9",
    //     "#27ae60",
    //     "#16a085",
    //     "#f39c12",
    //   ],
    //   spread: 70,
    //   origin: { y: 0.4 },
    // });
  });
};
