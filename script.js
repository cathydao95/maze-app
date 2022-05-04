// getting objects out of the matter library via destructuring
const { Engine, Render, Runner, World, Bodies } = Matter;
// engine used to transition from current state of world to new state, render is used to draw stuff onto screen, runner coordinates updates between engine and world, bodies represents our ability to create shapes

// BOILER PLATE CODE FOR MATTER JS- do not need to 100% understand boiler plate. a lot of this stuff just gets duplicate between matter aps
const width = 600;
const height = 600;

const engine = Engine.create();
const { world } = engine;
// when we create engine, we get world object with it
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    //   wireframe at false is solid shapes with random colors, true is just frames of the shapes
    wireframes: true,
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
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }),
];

World.add(world, walls);

// MAZE GENERATION

// ANOTHER WAY TO WRITE
// const grid = [];
// for (let i = 0; i < 3; i++) {
//   grid.push([]);
//   for (let j = 0; j < 3; j++) {
//     grid[i].push(false);
//   }
// }

// create an empty array with 3 places in it, then map over each array with an array of length 3 with 3 false sttements.
const grid = Array(3)
  .fill(null)
  .map(() => Array(3).fill(false));
// must use map and can't just fill with [false, false, false] because it would be the one(same) array being thrown in every location. in memory, it is only one array and it will affect every index.modifying one, modifys all
console.log(grid);
