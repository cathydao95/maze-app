// getting objects out of the matter library via destructuring
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

// cells talking about horizontal or vertical edge
const cellsHorizontal = 8;
const cellsVertical = 6;

// window.innherWidth and innerHeight takes the width of viewable window
const width = window.innerWidth;
const height = window.innerHeight;
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
// Disable Gravity
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    //   wireframe at false for solid shapes and true for frames
    wireframes: false,
    width: width,
    height: height,
  },
});
// render object shows content on screen and pass options object
Render.run(render);
Runner.run(Runner.create(), engine);

// Wall
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, {
    isStatic: true,
    render: { fillStyle: "yellow" },
  }),
  Bodies.rectangle(width / 2, height, width, 2, {
    isStatic: true,
    render: { fillStyle: "yellow" },
  }),
  Bodies.rectangle(0, height / 2, 2, height, {
    isStatic: true,
    render: { fillStyle: "yellow" },
  }),
  Bodies.rectangle(width, height / 2, 2, height, {
    isStatic: true,
    render: { fillStyle: "yellow" },
  }),
];
World.add(world, walls);

// MAZE GENERATION

// shuffle will take some array and randomly reorder all the elements inside (this will help with randomizing neighbors)
const shuffle = (arr) => {
  let counter = arr.length;
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};

// create an empty array with 3 places in it, then map over each array
const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

//   Picking random starting cell
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCell = (row, column) => {
  // If visited the cell at [row,column], then return
  if (grid[row][column]) {
    return;
  }
  // Mark cell has being visited
  grid[row][column] = true;
  // Assembly randomly
  const neighbors = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);

  // For each neighbor....
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;
    // See if neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    ) {
      continue;
    }
    // See if we have visited that neighbor, continue to next neighbor (this is checked twice on the top too, but this is defensive coding?)
    if (grid[nextRow][nextColumn]) {
      continue;
    }
    //   remove wall from horizontal or vertical array
    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }
    stepThroughCell(nextRow, nextColumn);
  }
  // Visit next cell (aka call stepThroughCell function)
};

stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      5,
      { label: "wall", isStatic: true, render: { fillStyle: "red" } }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      5,
      unitLengthY,
      { label: "wall", isStatic: true, render: { fillStyle: "red" } }
    );
    World.add(world, wall);
  });
});
// GOAL
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  { label: "goal", isStatic: true, render: { fillStyle: "green" } }
);

World.add(world, goal);

// BALL
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  label: "ball",
  render: { fillStyle: "blue" },
});
World.add(world, ball);

document.addEventListener("keydown", (event) => {
  const { x, y } = ball.velocity;
  if (event.key === "ArrowUp") {
    Body.setVelocity(ball, { x, y: y - 5 });
  }
  if (event.key === "ArrowRight") {
    Body.setVelocity(ball, { x: x + 5, y });
  }
  if (event.key === "ArrowDown") {
    Body.setVelocity(ball, { x, y: y + 5 });
  }
  if (event.key === "ArrowLeft") {
    Body.setVelocity(ball, { x: x - 5, y });
  }
});

// Win Conditions

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector(".winner").classList.remove("hidden");
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
