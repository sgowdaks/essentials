## Ethernet Frame & MAC Addressing

The Ethernet frame is the "envelope" for data at Layer 2.

### In-Depth Frame Structure

* **Preamble & SFD (start frame delimeter)(8 bytes):** A pattern of alternating 1s and 0s used to synchronize the receiver's clock.
* **Destination & Source MAC (12 bytes):** The 48-bit hardware addresses.
* **Type/Length (2 bytes):** ): If value $\ge 1536$, it’s the EtherType (e.g., 0x0800 for IPv4). If $< 1500$, it represents the payload length.
* **Payload (46–1500 bytes):** The actual data. If the data is less than 46 bytes, **padding** is added to reach the minimum frame size.
* **FCS (4 bytes)(Frame Check Sequence):** A Cyclic Redundancy Check (CRC) used to detect corruption. If the math doesn't match upon arrival, the switch **discards** the frame (it does not request a retransmission; that's TCP's job).

---

To understand the **CAM (Content Addressable Memory)** table, you have to stop thinking like a computer (which usually looks for data at a specific address) and start thinking like a librarian who can find a book just by hearing its title.

The CAM table is the "brain" of a Layer 2 switch. Its primary job is to ensure that data is sent directly to the intended device rather than being broadcast to everyone on the network.

---

## CAM Table

### 1. How the CAM Table is Built (The "Learning" Phase)

When you first turn on a switch, the CAM table is **empty**. It doesn't know who is plugged into which port. It learns through "Source Learning."

* **Step A:** Computer A sends a frame to Computer B.
* **Step B:** The switch looks at the **Source MAC Address** of that frame.
* **Step C:** It records that MAC address and the physical **Port** it arrived on into the CAM table.
* **The Result:** The switch now knows, "If I ever need to reach Computer A, I send it out of Port 1."

---

### 2. The Lookup Logic (The "Forwarding" Phase)

Once the switch receives a frame, it performs a lookup based on the **Destination MAC Address**. This happens in nanoseconds because it uses specialized hardware (ASICs).

| Scenario | Destination MAC Status | Switch Action |
| --- | --- | --- |
| **Known Unicast** | Address is in the table. | **Forward:** Sends the frame out only the specific port listed. |
| **Unknown Unicast** | Address is **not** in the table. | **Flood:** Sends the frame out every port except the one it arrived on. |
| **Broadcast** | Address is `FFFF.FFFF.FFFF`. | **Flood:** Sends the frame to everyone. |

---

## 3. VLANs, Trunking, & STP

### 802.1Q (Trunking)

When multiple VLANs cross a single link, the switch adds a **4-byte Tag** to the frame.

* **TPID (0x8100):** Identifies it as a tagged frame.
* **TCI:** Contains the **Priority (CoS)** for Quality of Service and the **VLAN ID (VID)**.
* **VID Range:** 12 bits = 4096 possible VLANs (0 and 4095 are reserved).

### STP & RSTP (Loop Prevention)

Standard STP (802.1D) is slow. **Rapid STP (802.1w)** is the modern standard.

* **Root Bridge Election:** The switch with the lowest **Bridge ID** (Priority + MAC) wins.
* **Convergence:** RSTP uses a "Proposal-Agreement" handshake instead of waiting for timers (Max Age/Forward Delay), allowing it to recover in milliseconds.

---

## 4. Link Aggregation (LACP)

**LACP (802.3ad)** bundles multiple physical ports into one logical "Port-Channel."

* **Active vs. Passive:** In **Active** mode, the switch actively sends LACPDUs to negotiate. In **Passive**, it only responds if it receives one.
* **The Hashing Myth:** LACP does *not* provide "true" aggregate speed for a single file transfer. It uses a hash (usually Source/Destination IP) to pin a specific flow to a specific physical link. This maintains frame order but limits any single session to the speed of one wire.

---

## 5. VXLAN & Data Center Challenges

### VXLAN (The Overlay)

VXLAN addresses the scale limits of VLANs (4096 is not enough for modern cloud providers).

* **VNI (VXLAN Network Identifier):** 24-bit field allowing for **16 million** segments.
* **Encapsulation:** MAC-in-UDP. The original L2 frame is wrapped in a UDP/IP header. This allows L2 traffic to be "routed" over a standard L3 (IP) network.
* **VTEP:** The device (switch or server) that performs the wrapping/unwrapping.

### L2 Extension Challenges

Stretching Layer 2 across different data centers (DCI) is tempting but dangerous:

1. **Broadcast Storms:** A loop in Data Center A can now bring down Data Center B because they share the same L2 domain.
2. **Sub-optimal Routing (Hairpinning):** Traffic from a VM in Site B might have to travel back to Site A just to reach its default gateway.
3. **Tromboning:** Data travels back and forth across the DCI link, increasing latency and wasting bandwidth.

---

**Would you like me to create a "cheat sheet" of the most common command-line interface (CLI) commands used to troubleshoot these specific layers?**
