// getting objects out of the matter library via destructuring
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;
// engine used to transition from current state of world to new state, render is used to draw stuff onto screen, runner coordinates updates between engine and world, bodies represents our ability to create shapes

// BOILER PLATE CODE FOR MATTER JS- do not need to 100% understand boiler plate. a lot of this stuff just gets duplicate between matter aps
// cells talking about horizontal or vertical edge
const cellsHorizontal = 4;
const cellsVertical = 3;

// window.innherWidth and innerHeight takes the width of viewable window
const width = window.innerWidth;
const height = window.innerHeight;
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
// to disbale gravity:
engine.world.gravity.y = 0;
const { world } = engine;
// when we create engine, we get world object with it
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    //   wireframe at false is solid shapes with random colors, true is just frames of the shapes
    wireframes: false,
    width: width,
    height: height,
  },
});
// render object shows content on screen and pass options object
Render.run(render);
Runner.run(Runner.create(), engine);

// //to add shape to our world
// // 200 and 200 gets the center of the rectangle and 50 and 50 is height and width of the rectangle
// const shape = Bodies.rectangle(200, 200, 50, 50, {
//   //   isStatic true makes shape stay where it is, if false, it will move
//   isStatic: true,
// });
// World.add(world, shape);

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

// const grid = [];
// for (let i = 0; i < 3; i++) {
//   grid.push([]);
//   for (let j = 0; j < 3; j++) {
//     grid[i].push(false);
//   }
// }
// ANOTHER WAY TO WRITE below

// create an empty array with 3 places in it, then map over each array with an array of length 3 with 3 false sttements.
const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));
// must use map and can't just fill with [false, false, false] because it would be the one(same) array being thrown in every location. in memory, it is only one array and it will affect every index.modifying one, modifys all

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
  // Mark cell has being visited -- aka update element in grid array to true
  grid[row][column] = true;
  // Assembly randomly -ordered list of neighbors and randomize neighbor list
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
      // shorter way to write if statements to check if all labels present?
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector(".winner").classList.remove("hidden");
      // turning back gracity on to let user know they won
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
