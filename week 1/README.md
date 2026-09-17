WEEK 1:

Question 1: A fast enough ball can end up outside the arena without the wall bounce ever being detected. Why does the detection fail, and which of Δt, |v|, ρ, R and g decide whether it happens?

Answer 1: let's take checking for collision with wall as code block C, and parameters(velocity, positions etc) update as P.

-at some position x(t) the ball is still inside the arena.
you run C- no collision
then you run P and the ball goes to x(t+dt). NOW it is outside the arena without being detected.

notice if dt was infinitesmally small- i.e. time in simulation was continuous instead of being discrete the distance moved by the ball in an instant dx=x(t+dt)-x(t) would also be infinitesmally small. This is to imply that the ball could never cross the arena without triggering C, since the exact moment the collision happens would also be part of our hypothetical continuous timeline. 
so dt is clearly at fault. to be precise, |v|dt since we're considering the distance.




Question 2: Set ew = 1, so that no energy is lost at a bounce, and let the ball run for a few thousand steps. Does the peak height stay put, creep upward, or decay? Gravity and the bounce rule are the only things acting, so if it changes at all, where is that energy coming from?

Answer 2:
for reference, i did this at fps=600 so dt=1.67 ms approximately. but here's the interesting thing. i had two versions of codes giving two different outputs:

Case 1). I only update parameters if the ball isn't colliding/already out of the arena yet. basically, i correct the offset and make the collision happen and then the parameter update continue. in the case the peak height decays eventually, the ball comes down to the bottom of the circular arena and just slides around.

Case 2). Parameter update is unconditional. In this case, the peak height creeps upward until the ball starts oscillating violently diametrically. 


