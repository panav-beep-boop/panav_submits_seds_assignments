# Week 2 — The Sandbox

Question 1. Why does the swap grid start as a copy of the current state, rather than being
filled with zeros? What would happen to a grain that does not move if G′ started empty

Question 2. Remove the randomised column order and replace it with a fixed left-to-right
scan. Run the simulation for a few hundred ticks. What happens to the shape of a sand pile?
Why?
My simulation remains unbiased and similar regardless of whether i use the permutation or left to right method. I'm assuming that the sand pile might  skew to the right over a lot of time though. Lemme give an example:
  1 2 3
1 1 0 1
2 1 0 1
3 1 1 1

Both (1,1) and (3,1) can shift to (2,2) in the next grid. but because we scan left to right, there's a chance that (1,1) might shift to (2,2) first. so there's a left to right bias. in an ideal permutation, these biases would cancel each other out over an accumulation of many grid updates. so, there's slightly more chance for particles to move to the right than left. so the sand pile should skewer to the right. my guess.

