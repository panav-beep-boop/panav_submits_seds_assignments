# Week 3 — Absolute Radiance

   Question 1. In the ray_color loop, you must ensure rays do not intersect at exactly t = 0.0,
but rather at a small offset like t = 0.001. If we set the minimum distance to 0.0, the image
becomes covered in dark noise known as "shadow acne." Why does this happen? (Hint: Think
about floating-point rounding errors when a ray bounces off a surface).
Ans.  Basically, hit_world continuously checks for collisions of rays and the surfaces, right? So let's say a ray hits a point A and is detected. Due to some floating point error, the ray is not detected exactly on the surface, but rather beyond the surface. This means that when you reflect the ray, hit world runs even for t=0 and the ray is detected to be interesting, but it's actually just self-intersecting. so the light from the ray keeps triggering hit worldd and getting attenuated as albedo. so u get these dark pixels. thousands of dark pixels and you end up with the "shadow acne"/


Question 2. In many CPU implementations of raytracing, the ray_color function calls
itself recursively every time it hits an object to calculate the next bounce. In our GLSL
fragment shader, we use a for loop instead. Why can’t we use standard recursive function
calls inside a GPU shader?
Ans. i genuinely don't know.
