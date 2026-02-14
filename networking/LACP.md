If **STP/RSTP** is the traffic cop that shuts down roads to prevent crashes, **Link Aggregation (LACP)** is the civil engineer who turns two separate one-lane roads into a single, high-speed two-lane highway.

### What is Link Aggregation?

Link Aggregation (defined by **IEEE 802.3ad** or **802.1AX**) allows you to bundle multiple physical Ethernet links into a single **logical** link. To the rest of the network, four 1Gbps cables look like one giant 4Gbps pipe.

Common names for this include:

* **LACP** (Link Aggregation Control Protocol)
* **EtherChannel** (Cisco’s term)
* **NIC Teaming** (Windows/Server term)
* **Bonding** (Linux term)

---

## Why do we need it? (The "STP Conflict")

Without LACP, if you plug two cables between Switch A and Switch B, **STP will see a loop and block one of them.** You paid for two cables, but you can only use one.

With LACP, the switches "glue" those cables together. Since they act as a single logical path, **STP is happy**—it sees only one connection, so it doesn't block anything. You get:

1. **Increased Bandwidth:** Combine the speeds of all active links.
2. **Redundancy:** If one cable in the bundle is unplugged, the traffic instantly shifts to the others without the network "going down" or STP having to recalculate.

---

## How LACP Works (The "Negotiation")

**LACP** is the protocol that manages this bundle. It ensures both switches agree on which ports belong to the group.

1. **System ID & Priority:** Switches exchange LACP packets to identify each other.
2. **The Handshake:** They check if the speed, duplex settings, and VLANs match on both ends. If they don't match, LACP won't "form," preventing a messy network error.
3. **Active vs. Passive Mode:**
* **Active:** The switch actively starts "shouting" to find a partner to bundle with.
* **Passive:** The switch waits for someone else to ask it to bundle.



---

## How Traffic is Shared (Load Balancing)

A common misconception is that a 4-link LACP bundle allows a single file transfer to go 4x faster. **This is not true.**

LACP uses a **Hash Algorithm** (usually based on Source and Destination MAC or IP addresses).

* Traffic from Computer A to Server Z will always take **Cable 1**.
* Traffic from Computer B to Server Z will take **Cable 2**.

This prevents "out-of-order packets," which would happen if a single stream of data was split across different physical wires with slightly different lengths/latencies.

---

## Summary: LACP vs. STP

| Feature | Spanning Tree (STP/RSTP) | Link Aggregation (LACP) |
| --- | --- | --- |
| **Primary Goal** | Loop Prevention | Bandwidth & Redundancy |
| **Redundant Link Status** | **Blocked** (Standby) | **Active** (Forwarding) |
| **Bandwidth** | Limited to one link's speed | Sum of all links' speeds |
| **Failure Recovery** | 6–50 seconds (RSTP/STP) | Near-instant (milliseconds) |

---

### A Final Thought: The "Perfect Marriage"

In a modern network, you use **both**. You use **LACP** to create high-speed "trunks" between your switches, and you leave **RSTP** running in the background as a safety net just in case someone accidentally plugs a cable into the wrong port and creates a loop elsewhere.
