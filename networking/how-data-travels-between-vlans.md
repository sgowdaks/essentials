How data physically leaves one "room" (VLAN) to enter another.

Let’s set the stage:

* **User A:** IP `10.0.1.5` (VLAN 1)
* **Printer B:** IP `10.0.2.50` (VLAN 2)
* **Router:** Connected to the Switch via **one physical cable** (a Trunk Link).
* The Router has a "Sub-interface" for VLAN 1 (`10.0.1.1`).
* The Router has a "Sub-interface" for VLAN 2 (`10.0.2.1`).



---

### Phase 1: The Local Decision (User A's Desk)

1. **The Comparison:** User A wants to send data to `10.0.2.50`. It compares this to its own IP and Subnet Mask.
2. **The Realization:** "This IP is on a different network. I can't talk to it directly."
3. **The Target:** User A looks at its configuration and sees its **Default Gateway** is `10.0.1.1`.
4. **The ARP Check:** User A checks its ARP table for the MAC address of `10.0.1.1`. (If it’s not there, it sends an ARP request: *"Who is the Gateway?"*).

### Phase 2: The Departure (User A to Switch)

1. **Encapsulation:** User A creates a data packet.
* **Source IP:** `10.0.1.5` | **Destination IP:** `10.0.2.50` (The Printer)
* **Source MAC:** User A | **Destination MAC:** **The Router**


2. **The Switch:** The packet hits the switch on a port assigned to **VLAN 1**. The switch looks at the Destination MAC (The Router), attached a vlan tag (so that router knows which vlan the data is coming from ) and sends it out the **Trunk Port** toward the Router.

### Phase 3: The Routing (At the Router)

1. **The Arrival:** The Router receives the frame on its VLAN 1 sub-interface.
2. **De-encapsulation:** It strips off the Layer 2 "envelope" (the MAC addresses). It sees the **Destination IP** is `10.0.2.50`.
3. **The Routing Table:** The Router looks at its map. It says: *"I know where the 10.0.2.0 network is! It’s out of my VLAN 2 sub-interface."*
4. **Re-encapsulation:** The Router puts the data into a **brand new envelope**:
* **Source MAC:** The Router's MAC.
* **Destination MAC:** The Printer's MAC (The Router will ARP for the printer if it doesn't know it).
* **VLAN Tag:** It adds a **VLAN 2 tag** to the frame.



### Phase 4: The Delivery (Router back to Switch to Printer)

1. **The Return:** The Router sends the packet back down the **same physical cable** to the Switch.
2. **The Switch:** The switch sees the **VLAN 2 tag**. It looks at the Destination MAC (The Printer). It knows the Printer is on Port 5.
3. **Success:** The Switch strips the VLAN tag and hands the packet to the Printer.

---

### Summary Table: What changes during the trip?

| Feature | At User A | At the Router | At the Printer |
| --- | --- | --- | --- |
| **Source IP** | `10.0.1.5` | `10.0.1.5` | `10.0.1.5` |
| **Destination IP** | `10.0.2.50` | `10.0.2.50` | `10.0.2.50` |
| **Source MAC** | User A | **Router** | Router |
| **Destination MAC** | **Router** | **Printer** | Printer |
| **VLAN Tag** | 1 | **2** | None (Access Port) |

**Key Takeaway:** The IP addresses **never change**, but the MAC addresses and VLAN tags are swapped by the Router to "hop" the packet from one network to the other.
