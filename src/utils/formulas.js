import Position from './Position';

const degreesToRadian = degrees => ((degrees * Math.PI) / 180);

const radiansToDegrees = radians => ((radians * 180) / Math.PI);

const getCanvasPosition = (canvasId, event) => {
  // mouse position on auto-scaling canvas
  // https://stackoverflow.com/a/10298843/1232793

  const svg = document.getElementById(canvasId);
  const point = svg.createSVGPoint();

  point.x = event.clientX;
  point.y = event.clientY;
  const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse());
  return new Position(x, y);
};

// https://math.stackexchange.com/questions/714378/find-the-angle-that-creating-with-y-axis-in-degrees
const calculateAngle = (x1, y1, x2, y2) => {
  if (x2 >= 0 && y2 >= 0) {
    return 90;
  } else if (x2 < 0 && y2 >= 0) {
    return -90;
  }

  const dividend = x2 - x1;
  const divisor = y2 - y1;
  const quotient = dividend / divisor;
  return radiansToDegrees(Math.atan(quotient)) * -1;
};

const calculateNextposition = (x, y, angle) => {
  const realAngle = (angle * -1) + 90;
  const newX = radiansToDegrees(Math.cos(degreesToRadian(realAngle))) / 10;
  const newY = radiansToDegrees(Math.sin(degreesToRadian(realAngle))) / 10;
  return new Position(x + newX, y - newY);
};

const pathFromBezierCurve = (cubicBezierCurve) => {
  const {
    initialAxis, initialControlPoint, endingControlPoint, endingAxis,
  } = cubicBezierCurve;
  return `
    M${initialAxis.x} ${initialAxis.y}
    c ${initialControlPoint.x} ${initialControlPoint.y}
    ${endingControlPoint.x} ${endingControlPoint.y}
    ${endingAxis.x} ${endingAxis.y}
  `;
};

const checkCollision = (rectA, rectB) => (
  rectA.x1 < rectB.x2 && rectA.x2 > rectB.x1 &&
  rectA.y1 < rectB.y2 && rectA.y2 > rectB.y1
);

export {
  degreesToRadian,
  calculateNextposition,
  radiansToDegrees,
  getCanvasPosition,
  calculateAngle,
  pathFromBezierCurve,
  checkCollision,
};
