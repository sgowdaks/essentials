# QOS (Quality Of Service)

In networking, a **QoS Model** is a framework or architecture used to manage network resources. Think of it as a set of rules that determines which data packets get "VIP treatment" and which have to wait in line.

Without a QoS model, a network operates on a **Best Effort** basis—treating a critical medical data transfer exactly the same as a background software update.

There are three primary models used in modern networking:

---

## 1. Best Effort (The "No Model" Model)

This is the default behavior of the Internet. The network does not differentiate between traffic types.

* **Mechanism:** First-come, first-served.
* **Pros:** Simple to manage; no configuration required.
* **Cons:** No guarantees. If the link is congested, high-priority traffic (like Voice over IP) will suffer from lag or dropped calls.

## 2. IntServ (Integrated Services)

IntServ is a **hard QoS** model. It works like a restaurant reservation system. Before an application sends data, it must request a specific amount of bandwidth from the network.

* **Mechanism:** Uses the **RSVP (Resource Reservation Protocol)**. Every router along the path must agree to set aside the requested bandwidth for that specific "flow."
* **Pros:** Guaranteed bandwidth and predictable latency.
* **Cons:** **Does not scale.** Routers must maintain the state of every single reservation. In a large network with thousands of flows, the router’s CPU and memory will quickly become overwhelmed.

## 3. DiffServ (Differentiated Services)

DiffServ is the **soft QoS** model and is the standard for modern enterprise networks. Instead of reserving a seat, it works like an airplane boarding pass system (First Class, Business, Economy).

* **Mechanism:** 1. **Classification:** Packets are identified (e.g., "This is Video").
2. **Marking:** A label is put in the IP header (the **DSCP** value).
3. **Per-Hop Behavior (PHB):** Each router looks at the label and decides how to treat the packet based on its local configuration (e.g., "Give DSCP 46 priority").
* **Pros:** Highly scalable. Routers don't need to remember individual flows; they just look at the label on the packet currently passing through.
* **Cons:** It is "predictable" rather than "guaranteed." If you oversubscribe your "First Class" tier, performance will still degrade.


**Would you like me to explain how "Marking" actually works inside the IP header so you can see where the priority labels live?**
