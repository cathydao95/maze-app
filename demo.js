// getting objects out of the matter library via destructuring
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } =
  Matter;
// engine used to transition from current state of world to new state, render is used to draw stuff onto screen, runner coordinates updates between engine and world, bodies represents our ability to create shapes

// BOILER PLATE CODE FOR MATTER JS- do not need to 100% understand boiler plate. a lot of this stuff just gets duplicate between matter aps
const width = 800;
const height = 600;
const engine = Engine.create();
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

// adding Mouse constrating move the shapes
World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas),
  })
);

// //to add shape to our world
// // 200 and 200 gets the center of the rectangle and 50 and 50 is height and width of the rectangle
// const shape = Bodies.rectangle(200, 200, 50, 50, {
//   //   isStatic true makes shape stay where it is, if false, it will move
//   isStatic: true,
// });
// World.add(world, shape);

// Wall
const walls = [
  Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
  Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),
  Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),
  Bodies.rectangle(800, 300, 40, 600, { isStatic: true }),
];

World.add(world, walls);

// RANDOM SHAPES
for (let i = 0; i < 40; i++) {
  if (Math.random() > 0.5) {
    World.add(
      world,
      Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50)
    );
  } else {
    World.add(
      world,
      Bodies.circle(Math.random() * width, Math.random() * height, 35)
    );
  }
}
