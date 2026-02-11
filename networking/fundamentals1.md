# Networking Fundamentals: Hubs vs. Switches & ARP

## 1. Hub vs. Switch: The Core Difference

While both connect devices on a Local Area Network (LAN), they handle data traffic with different levels of "intelligence."

| Feature | **Network Hub** | **Network Switch** |
| --- | --- | --- |
| **Logic** | "Dumb" (Electrical Repeater) | "Smart" (Data Manager) |
| **Traffic Method** | **Broadcast:** Sends data to every port. | **Unicast:** Sends data to the specific port. |
| **Efficiency** | High collision risk; slower. | No collisions; full speed (Full Duplex). |
| **Addressing** | Ignores MAC and IP addresses. | Identifies and remembers **MAC addresses**. |
| **OSI Layer** | Layer 1 (Physical). | Layer 2 (Data Link). |

---

## 2. How the Switch "Learns"

The switch maintains a **MAC Address Table** (or CAM Table). It is a simple map of **MAC Address ↔ Physical Port**.

* **Initial State:** The table is empty when powered on.
* **Learning:** When a device sends any data, the switch looks at the "Source MAC" and notes which port it came from.
* **Forwarding:** When data arrives for a specific MAC, the switch checks its table and sends it directly to the correct port.
* **Flooding:** If the switch doesn't know the destination MAC yet, it "floods" (broadcasts) the data to everyone once to find the target.

---

## 3. The Role of ARP (Address Resolution Protocol)

If the switch already handles MAC addresses, why do we need ARP? Because **software (Your PC) speaks IP**, but **hardware (The Switch) speaks MAC.**

* **The Problem:** Your PC wants to talk to `192.168.1.50`, but it can't create an Ethernet frame without a **Destination MAC**.
* **The Solution (ARP):**
1. **Request:** Your PC shouts: *"Who has IP 192.168.1.50? Tell me your MAC!"* (This is a Broadcast).
2. **Switch Action:** The switch passes this shout to everyone.
3. **Reply:** The target device (e.g., a printer) replies: *"That's me! My MAC is AA:BB:CC..."*
4. **Learning:** The Switch sees this reply and adds the printer's MAC and Port to its own table.
5. **Caching:** Your PC stores that MAC in its **ARP Cache** so it doesn't have to ask again.
---

## 4. Key Takeaways

* **ARP** is for the **Devices**: It translates IP → MAC.
* **Switching** is for the **Network**: It maps MAC → Port.

