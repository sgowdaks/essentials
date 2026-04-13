## 1. The Big Picture: Shared vs. Private
A process acts as a container. Within that container, all threads share the same "pantry" (Shared RAM), but they each have their own "private notebook" (The Stack).

### Shared RAM (The Heap)
* **What it is:** A large pool of memory available to all 5 threads.
* **Use:** Storing global variables, large data structures, or objects that need to live for a long time.
* **The Catch:** Because it is shared, threads must use **synchronization** (like locks or mutexes) to prevent "race conditions" where two threads try to change the same data at once.

### Private Memory (The Stack / Call Stack)
* **What it is:** A dedicated, fixed-size block of memory assigned to each individual thread.
* **Use:** Managing the **execution flow** and temporary data.

---

## 2. The Role of the Call Stack
The "Private Stack" and the "Call Stack" are the same thing. It is the most critical tool for a thread to function independently.

### Key Functions of the Stack:
* **Function Tracking:** It uses a "Last-In, First-Out" (LIFO) structure. When a function is called, a **Stack Frame** is pushed on; when the function finishes, the frame is popped off.
* **Return Addresses:** It stores the exact line of code the thread needs to return to after a function call completes. Without this, the thread would "forget" what it was doing.
* **Local Variables:** Variables created inside a function (e.g., `int x = 10`) live here. This ensures that if all 5 threads run the same function, they each have their own private `x` and don't overwrite each other.



---

## 3. Why This Architecture Exists
If we didn't give each thread its own stack, multi-threading would be impossible for three main reasons:

1.  **Isolation:** Threads can execute different parts of the program (or the same part) simultaneously without interfering with each other's temporary calculations.
2.  **Performance:** Accessing the stack is nearly instantaneous because the CPU has a dedicated register (the Stack Pointer) to track it. There is no need for complex memory management or "locking" logic.
3.  **Safety:** If one thread has a logic error (like infinite recursion), it will trigger a **Stack Overflow** in its own private space. While that thread might crash, the other 4 threads—and their private stacks—remain intact.

---

## Summary Comparison Table

| Component | Visibility | Content | Management |
| :--- | :--- | :--- | :--- |
| **Shared RAM (Heap)** | All 5 Threads | Objects, Globals, Shared Data | Manual/Garbage Collector |
| **Private Stack** | Only 1 Thread | Local variables, Return addresses | Automatic (LIFO) |

> **Bottom Line:** The shared RAM allows threads to **collaborate** on the same data, while the private call stack allows threads to **operate** independently without losing their place in the code.
