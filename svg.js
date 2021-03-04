// const toKebabCase = key => key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());

import { translate } from "./geometry.js";
import { pipe } from "./lib.js";

export const addAttributes = attributes => element => {
  Object.entries(attributes)
    .forEach(([key, value]) => {
      element.setAttributeNS(null, key, value);
    });

  return element;
}

export const addChildren = children => element => {
  children.forEach(child => element.appendChild(child));
  return element;
}

export const $ = (name, attributes = {}, ...children) => 
  pipe(
    document.createElementNS("http://www.w3.org/2000/svg", name),
    addAttributes(attributes),
    addChildren(children)
  );

export const pathCoord = coord => 
  coord.toFixed(3);

export const pathCoords = ([x, y]) => 
  pathCoord(x) + "," + pathCoord(y);

export const pathComand = command => (...coords) => 
  command + " " + coords.map(pathCoords).join(" ");

export const line = pathComand("L"); 
export const dline = pathComand("l");

export const move = pathComand("M"); 


export const linePath = origin => points => {
  points = points.map(translate(origin));

  const first = points.shift();

  return points.reduce(
    (d, point) => d + " " + line(point), 
    move(first)
  );
}

export const rayPath = origin => vector => move(origin) + " " + dline(vector);


export const path = d => $("path", { d });

export const animatedPath = (duration, delay = "0s") => keyframes => 
  $("path", {}, 
    $("animate", {
      repeatCount: 1,//"indefinite",
      dur: duration + "ms",
      attributeName: "d",
      values: keyframes.join(";") + ";",
      fill: "freeze",
      begin: delay
    })
  );

export const stroke = (color, width = 1) => 
  addAttributes({
    fill: "none",
    stroke: color,
    strokeWidth: width
  });

  
export const fill = (color, color2, width = 1) => 
  addAttributes({
    fill: color,
    stroke: color2,
    strokeWidth: width
  });




// const createPolygonPath = origin => {
//   const translate = translateVector(origin);
//   return points => {
//     points = points.map(translate);
//     return points.reduce(
//       (d, point) => 
//         d += " " + pathComand("L") (point), 
//       pathComand("M") (points[points.length - 1])
//     );
//   }    
// }
 

