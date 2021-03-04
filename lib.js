export const mod = n => a => 
  ((a % n) + n) % n;

  

export const random = range => 
  range[0] + (range[1] - range[0]) * Math.random();

export const range = length => Array.from({ length }, (_, index) => index);

export const at = list => index => list[mod(list.length)(index)];



export const pipeline = (...operations) => input => 
  operations.reduce((result, operation) => operation(result), input);

export const pipe = (input, ...operations) => pipeline(...operations) (input);

export const branch = (...operations) => input => 
  operations.map(operation => operation(input));


export const branchByInput = (...operations) => input => 
  operations.map(operation => operation(input));


export const map = (...operations) => inputs => inputs.map(pipeline(...operations)); 
export const mapIndexed = (...operations) => inputs => 
  inputs.map((input, index) => pipe(input, ...operations.map(operation => operation(index)))); 

export const flat = (depth = 1) => inputs => inputs.flat(depth); 

export const slice = (start, end) => inputs => inputs.slice(start, end);

export const trace = tracer => input => {
  tracer(input);
  return input;
}

  // const pipebranches = (input, ...operations) => branch(...operations) (input);
