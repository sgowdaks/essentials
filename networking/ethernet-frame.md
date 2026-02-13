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
