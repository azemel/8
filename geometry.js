const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;

export const arctg360 = ([x, y]) => {
  const angle = (x || y) ? Math.atan2(x, y) : 0; 
  return angle > 0 ? angle : (2 * Math.PI + angle)
}

export const rad2Deg = rad => Math.round(rad * RAD_TO_DEG); 

export const deg2Rad = deg => deg * DEG_TO_RAD; 

export const vector = angle => [Math.sin(angle), Math.cos(angle), angle];

export const scale = scale => ([x, y, angle]) => [x * scale, y * scale, angle];

export const rotate = angle => v => scale(measure(v)) (vector(v[2] + angle));

export const translate = ([dx, dy]) => ([x, y, angle]) => [x + dx, y + dy, angle];

export const measure = ([x, y]) => Math.sqrt(x * x + y * y);

export const splitSegment = (delta) => 
  ([[startX, startY], [endX, endY]]) => {
    const x = startX + (endX - startX) * delta;
    const y = startY + (endY - startY) * delta;
    const angle = arctg360([x, y]);
    return [x, y, angle];
  }



let x = 1 / 2;
let y = Math.sqrt(3) / 2;
console.log(rad2Deg(arctg360([-x, -y])));