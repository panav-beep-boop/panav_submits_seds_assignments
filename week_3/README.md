# Week 3 — Absolute Radiance

   Question 1. In the ray_color loop, you must ensure rays do not intersect at exactly t = 0.0,
but rather at a small offset like t = 0.001. If we set the minimum distance to 0.0, the image
becomes covered in dark noise known as "shadow acne." Why does this happen? (Hint: Think
about floating-point rounding errors when a ray bounces off a surface).


Question 2. In many CPU implementations of raytracing, the ray_color function calls
itself recursively every time it hits an object to calculate the next bounce. In our GLSL
fragment shader, we use a for loop instead. Why can’t we use standard recursive function
calls inside a GPU shader?
