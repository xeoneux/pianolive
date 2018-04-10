export const firework = canvas => {
  const ctx = canvas.getContext('2d');
  const w = document.body.clientWidth;
  const h = document.body.clientHeight;
  canvas.width = w;
  canvas.height = h;

  let nodes = [];

  const draw = () => {
    requestAnimationFrame(draw);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, .08)';
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = 'lighter';

    let l = nodes.length;
    let node;
    while (l--) {
      node = nodes[l];
      drawNode(node);
      if (node.dead) nodes.splice(l, 1);
    }
  };

  const drawNode = node => {
    let l = node.children.length,
      point;
    while (l--) {
      point = node.children[l];
      ctx.beginPath();
      ctx.fillStyle = point.color;
      ctx.arc(point.x, point.y, 1, 0, PI2);
      ctx.fill();
      ctx.closePath();
      updatePoint(point);
      if (point.dead) {
        node.children.splice(l, 1);
        if (node.count > 20) {
          nodes.push(
            makeNode(
              point.x,
              point.y,
              node.radius * 10,
              node.color,
              (node.count / 10) | 0
            )
          );
        }
      }
    }
    if (!node.children.length) {
      node.dead = true;
    }
  };

  const updatePoint = point => {
    const dx = point.x - point.dx;
    const dy = point.y - point.dy;
    const c = Math.sqrt(dx * dx + dy * dy);
    point.dead = c < 1;
    point.x -= dx * point.velocity;
    point.y -= dy * point.velocity;
  };

  let ttt = 0;
  const rad = Math.PI / 180;
  const PI2 = Math.PI * 2;

  const rand = (max, min) => {
    min = min || 0;
    return Math.random() * (max - min) + min;
  };

  const makeNode = (x, y, radius, color, partCount) => {
    radius = radius || 0;
    partCount = partCount || 0;
    const count = partCount;

    let r, kof;
    const children = [];

    while (partCount--) {
      kof = (100 * Math.random()) | 0;
      r = (radius * Math.random()) | 0;
      children.push({
        x,
        y,
        color,
        velocity: rand(1, 0.05),
        dx: x + r * Math.cos(ttt * kof * rad),
        dy: y + r * Math.sin(ttt * kof * rad)
      });
      ttt++;
    }

    return { x, y, color, count, radius, children };
  };

  draw();
  return color =>
    nodes.push(
      makeNode(
        (Math.random() * w) | 0,
        (Math.random() * h) | 0,
        10,
        `rgb(${color})`,
        30
      )
    );
};
