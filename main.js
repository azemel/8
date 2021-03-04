'use strict'

import { rotate, scale, splitSegment, vector, deg2Rad, rad2Deg } from "./geometry.js";
import { at, branch, flat, map, pipeline, pipe, random, range, slice, trace } from "./lib.js";
import { $, animatedPath, fill, linePath, path, rayPath, stroke } from "./svg.js";

const randomAngle = (angle, delta) => 
  random([angle - delta, angle + delta]);

const createRays = (delta = 0) => n => {
  const angle = 2 * Math.PI / n;
  delta = angle * delta;

  return range(n)
    .map(i => randomAngle(angle * i, delta))
    .map(vector);
}

const createPetals = (delta = 0) => rays => {
  const ray = at(rays);
  const split = splitSegment(random([0.5 - delta, 0.5 + delta]));
  const petals = [];
  
  let left = split([ray(-1), ray(0)]);
  for (let i = 0; i < rays.length - 1; i++) {
    const center = ray(i);
    const right = split([center, ray(i + 1)]);
    petals.push([left, center, right]);
    
    left = Array.from(right);
  }
  
  petals.push([left, ray(-1), Array.from(petals[0][0])]);

  return petals;
}


const createPhase0 = () => () => Array.from({ length: 6 }, _ => [0, 0]);

const createPhase1 = r => ([left, center, right]) => [
    scale (r) (left), 
    scale (r) (left), 
    scale (r) (center), 
    scale (r) (center), 
    scale (r) (right),
    scale (r) (right),
  ];

const createPhase2 = (rInner, rOuter) => ([left, center, right]) => [
  scale (rInner) (left), 
  scale (rInner) (left), 
  scale (rOuter) (center), 
  scale (rOuter) (center), 
  scale (rInner) (right),
  scale (rInner) (right),
];

const createPhase3 = (rZero, rInner, rOuter) => ([left, center, right]) => [
  scale (0) (left), 
  scale (rInner) (left), 
  scale (rOuter) (center), 
  scale (rOuter) (center), 
  scale (rInner) (right),
  scale (0) (right),
];

const createPhase4 = (rZero, rInner, rOuter) => ([left, center, right]) => [
  scale (0) (left), 
  scale (rInner) (rotate(deg2Rad(random([-5, -3]))) (left)), 
  scale (rOuter * random([0.98, 1.02])) (rotate(deg2Rad(-2)) (center)), 
  scale (rOuter * random([0.98, 1.02])) (rotate(deg2Rad(2)) (center)), 
  scale (rInner) (rotate(deg2Rad(random([3, 5]))) (right)), 
  scale (0) (right),
];

const createPhase5 = (rZero, rInner, rOuter) => ([left, center, right]) => [
  scale (0) (left), 
  scale (rInner) (rotate(deg2Rad(random([-5, -3]))) (left)), 
  scale (rOuter * random([0.98, 1.02])) (rotate(deg2Rad(-5)) (center)), 
  scale (rOuter * random([0.98, 1.02])) (rotate(deg2Rad(5)) (center)), 
  scale (rInner) (rotate(deg2Rad(random([3, 5]))) (right)), 
  scale (0) (right),
];


const createImage = parent => {
  const r = 200, 
        d = r * 2,
        origin = [r, r];

  const flower = pipeline(
    createRays(0.15),
   
    createPetals(0.1),

    map(
      branch(
        createPhase0(            ),
        createPhase1(          40),
        createPhase2(     70,  80),
        createPhase3(40, 100, 120),
        createPhase4(20, 120, 160),
        createPhase5(20, 170, 180),
      ),
      map(
        linePath(origin)
      ),
      animatedPath(5000),
      // stroke("#000022"),
      fill("#ffaaaa", "#000022"),
    )
  );


  const flower2 = pipeline(
    createRays(0.15),
   
    createPetals(0.1),

    map(
      branch(
        createPhase0(            ),
        createPhase1(          40),
        createPhase2(     70,  80),
        createPhase3(40, 100, 120),
        createPhase4(20, 120, 160),
        createPhase5(20, 140, 160),
      ),
      map(
        linePath(origin)
      ),
      animatedPath(5000, "1s"),
      // stroke("#000022"),
      fill("#ffaaaa", "#000022"),
    )
  );

  const svg = $("svg", { width: d, height: d }, 
    $("rect", { x: 0, y: 0, width: d, height: d, fill: "#ffffee" }),
    ...flower(6),
    ...flower2(5)
  );
  
  parent.appendChild(svg);
}

const logVector = vector => 
    "(" + vector[0].toFixed(3) + ", " + vector[1].toFixed(3) + ") " 
    + rad2Deg(vector[2]).toFixed(2); 

const logPetal = petal =>  petal.map(logVector).join("\n");

const createTmp = parent => {
  
  const r = 200, 
        d = r * 2,
        origin = [r, r];

  const tmp = pipe(
    3,
    createRays(0),
    createPetals(0),
    slice(0, 2),
    map(
      trace(v => console.log(logPetal(v))),
      map(
        rotate(Math.PI),
        scale(r),
        rayPath(origin),
        path,
        stroke("#bbbbbb"),
      )
    ),
    flat(2)
  );


  const svg = $("svg", { width: d, height: d }, 
  $("rect", { x: 0, y: 0, width: d, height: d, fill: "#ffffee" }),
  ...tmp
  );

  parent.appendChild(svg);
}


window.addEventListener("load", () => {
  createImage(document.body);
  // createTmp(document.body);
});

