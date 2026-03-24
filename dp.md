
### 1. The "No Regret" Proof
Imagine you have two strings, and both start with `C`.
* **Choice A (Greedy):** You match the `C`s. You get **1 point** and move to the rest of the strings.
* **Choice B (Skip):** You skip the `C` in String 1, hoping to find a "better" match for String 2's `C` later.

**Why Choice B is always worse (or at best, equal):**
Even if you find another `C` later in String 1 to match with String 2's first `C`, you still only get **1 point**. But because you waited, you have **fewer characters left** to work with. You’ve restricted your future options for no gain. 

In DP terms:
$$LCS(i, j) = 1 + LCS(i+1, j+1)$$
is mathematically guaranteed to be $\ge$ than skipping either character.



---

### 2. How to "Make Sure" for other problems
You can't always use a greedy shortcut in DP. To know if you can, ask yourself: **"Does my current choice limit my future choices in a way that costs me more than I gain now?"**

#### Example: 0/1 Knapsack (Greedy Fails)
* **Scenario:** You have a bag that holds 10kg. You see a 5kg gold bar.
* **Greedy Choice:** "Take it! It's gold!"
* **The "Regret":** Taking that 5kg bar might prevent you from taking a 6kg diamond later. The "weight" is a **shared resource** that links your choices.
* **Conclusion:** You **must** use pure DP (try taking it AND try leaving it) because there is a trade-off.

#### Example: LCS (Greedy Works for Matches)
* **Scenario:** You see a matching character `C`.
* **The "Regret":** Does matching `C` use up a "resource" that prevents a better match? 
* **The Reality:** No. Matching `C` only "uses up" that specific `C`. It doesn't cost you "weight" or "money." It actually opens up the rest of the string as quickly as possible.
* **Conclusion:** You can safely be greedy on matches.

---

### 3. The DP Safety Net
The beauty of the 2D DP table is that it handles the "making sure" for you. By exploring both paths (`i+1` and `j+1`) when characters **don't** match, you are effectively saying:

> "I don't know if this 'A' or this 'B' is part of the best sequence, so I will calculate the answer for both scenarios and let the `max()` function pick the winner."


