
## 1. Subroutines (Normal Functions)
A "subroutine" is the classic way we think of code. It has a single entry point and a single exit point.

* **The Power Dynamic:** When the main program calls a subroutine, the main program **stops** and hands over total control.
* **The Exit:** Once the subroutine hits `return` (or finishes), it's gone. It cannot be "re-entered" where it left off.
* **Hierarchy:** It’s a "Master-Slave" relationship. The caller is in charge, and the subroutine just does its job and dies.

---

## 2. Coroutines (The Peers)
The term **Coroutine** literally means "cooperative routine." Unlike a subroutine, a coroutine can pause its execution and hand control back to the caller (or to other coroutines) without being destroyed.



### How `yield` makes a Coroutine
In Python, a generator is actually a simple form of a coroutine. 
* **Cooperation:** Instead of the main program *forcing* the function to finish, the function **yields** control back gracefully. 
* **Symmetry:** It’s more of a "Peer-to-Peer" relationship. The main program and the coroutine pass control back and forth like a game of tennis.

---

## The "Advanced" Coroutine (`async/await`)
While `yield` creates a generator (which is a basic coroutine), modern Python uses `async` and `await` for high-performance coroutines.

* **Generators (`yield`):** These are usually about **producing data** (like a stream of numbers).
* **Async Coroutines (`async def`):** These are usually about **waiting for events** (like waiting for a database to respond).

### What happens in RAM during a Coroutine?
This is the "magic" part. In a normal **subroutine**, the stack frame is created, used, and deleted. In a **coroutine**, the stack frame is moved to the **Heap**.

Because it lives in the Heap, it doesn't have to follow the strict "Last In, First Out" rule of the stack. It can sit there for 10 minutes, waiting for a file to download, while other parts of your program keep running. When the file is ready, the Event Loop finds that "frozen" frame in the Heap, puts it back on the Stack, and let's it finish.



---

## Summary of Terms

| Term | Also Known As | Behavior |
| :--- | :--- | :--- |
| **Subroutine** | Normal Function | Enter → Run → Return (Destroyed) |
| **Generator** | Iterator | Enter → Yield (Pause) → Resume → Yield... |
| **Coroutine** | Cooperative Task | Enter → Await (Suspend) → Resume (When ready) |
