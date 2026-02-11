# Traffic classification and marking (DSCP, CoS

CoS (Class of Service): A 3-bit field in the Layer 2 (Ethernet) header

DSCP (Differentiated Services Code Point): A 6-bit field in the Layer 3 (IP) header.

* **CoS (Layer 2)** is like your **Boarding Group**. It only matters at the gate (the switch) to decide who physically steps onto the plane first.
* **DSCP (Layer 3)** is like your **Ticket Class (First Class vs. Economy)**. It stays with you for the whole trip, even if you change planes (routers) or fly with a different airline (ISP).

---

### Why we use both at the same time

You might wonder, "If I have a ticket class (DSCP), why do I need a boarding group (CoS)?" In a 50-person office, you use both because of **Device Capability**:

#### 1. Switches are "Fast but Simple"

Many standard network switches are designed to be incredibly fast at moving data. To keep that speed, they often don't want to "open the envelope" of the IP packet to see the DSCP value. Instead, they just look at the **CoS bits** on the outside of the VLAN tag. It's a quick "glance" that allows the switch to prioritize your Zoom call in nanoseconds.

#### 2. Routers are "Smart but Thorough"

When your data reaches the router to go to **Azure**, the router "rips off" the Ethernet header (and your CoS bits) to read the IP address. If you didn't have **DSCP**, your priority would be deleted right there! The DSCP value ensures that when the packet arrives at Cloud Provider's router in Chicago, they still knows it’s an urgent packet. Note: Most of the ISP/cloud provider dose not take DSCP into consideration unless there is an agreement between.

---

In most networks, **you** (the administrator) are the one who decides how these values are assigned. However, the "who" can change depending on how your hardware is configured.

Here is the breakdown of who actually does the tagging:

### 1. The Application (The Source)

Some high-end applications are "QoS aware."

* **VoIP Phones:** Most IP phones automatically tag their own traffic with **CoS 5** and **DSCP 46 (EF)** right out of the jack.
* **Enterprise Software:** Apps like Microsoft Teams or Zoom can be configured via Group Policy to tag their packets with specific DSCP values before they even leave the computer.

### 2. The Network Switch (The "Access" Layer)

This is the most common place for assignment. If your devices (like a cheap PC or a printer) aren't tagging their own traffic, you configure the switch to do it for them.

* **By Port:** You can tell a switch: "Anything plugged into Port 4 is a security camera; tag it all as CoS 4."
* **By Protocol:** You can tell the switch to look for specific traffic (like web traffic on port 443) and apply a tag.

### 3. The Router (The "Gateway")

The router is the "Heavy Lifter" for DSCP. Since it sits at the boundary between your internal network and the outside world, it often performs **Class-Based Marking**:

* **Mapping:** The router can take incoming **CoS** values from the switch and "copy" them into **DSCP** values so the priority survives the hop.
* **NBAR (Network Based Application Recognition):** Advanced routers use "Deep Packet Inspection" to see that you are watching a video and will assign a DSCP tag based on the application type, regardless of what the computer sent.

---

### The Concept of the "Trust Boundary"

This is the most important rule in QoS assignment. You have to decide where the network starts "trusting" the tags.

| Device Type | Behavior |
| --- | --- |
| **Untrusted (Home PC)** | The switch ignores any tags from the PC and assigns its own (or sets them to 0). |
| **Trusted (IP Phone)** | The switch sees the phone's CoS/DSCP tags and allows them to pass through unchanged. |
| **Conditional Trust** | The switch trusts the device only if it identifies itself correctly (e.g., via LLDP-MED). |

---

# Queuing mechanisms: FIFO, Priority Queuing, WFQ

Once you’ve tagged your traffic with CoS or DSCP, your router needs a plan for what to do when the "exit door" (the bandwidth) gets crowded. This is **Queuing**.

Think of queuing like the checkout lines at a grocery store. Depending on the store's policy, different people get to move through at different speeds.

---

### 1. FIFO (First-In, First-Out)

This is the "no-policy" policy. It is the default for almost all networking devices.

* **How it works:** Exactly like a standard line at a bank. The first packet to arrive is the first one to be sent out.
* **The Catch:** If a huge, "heavy" file download arrives just before a tiny, "fragile" voice packet, the voice packet has to wait. This causes **jitter** and **latency**.
* **Best for:** High-bandwidth links where congestion rarely happens.

### 2. Priority Queuing (PQ)

This is the "VIP Treatment" model. You create strictly ranked buckets (High, Medium, Normal, Low).

* **How it works:** The router **always** empties the "High" queue first. As long as there is a single packet in the High queue, the "Normal" queue is completely ignored.
* **The Catch:** **Packet Starvation.** If your High-priority traffic is too heavy (e.g., a massive video stream accidentally marked as Priority), the lower-priority traffic (like email) might never get sent at all. It just sits there and eventually "dies" (drops).
* **Best for:** Critical, low-bandwidth traffic like voice calls.

### 3. WFQ (Weighted Fair Queuing)

This is the "Fairness" model. It tries to give everyone a seat at the table, but some seats are bigger than others.

* **How it works:** The router automatically identifies different "flows" (conversations) and gives them a fair share of the bandwidth. "Weighted" means it looks at the IP Precedence or DSCP tags to give more "weight" (bandwidth) to important flows.
* **The Catch:** It is mathematically complex and can be hard on a router's CPU. It also doesn't provide a "guarantee" for voice traffic as strictly as PQ does.
* **Best for:** General office environments where you want to ensure no single user can hog the entire connection with a single download.

---

### Comparison Summary

| Mechanism | Analogy | Pros | Cons |
| --- | --- | --- | --- |
| **FIFO** | Standard line | Simplest, no CPU load | "Bully" packets slow everyone down |
| **PQ** | VIP Red Carpet | Guarantees zero delay for VIPs | Can "starve" non-VIP traffic to death |
| **WFQ** | Multi-lane Highway | Fair; prevents bandwidth hogging | Complex; no absolute priority |

---

# Congestion management and avoidance (RED, ECN)

While **Queuing** (which we just discussed) is about how to organize traffic when the line is long, **Congestion Management and Avoidance** is about preventing the "room" from getting too crowded in the first place.

When a router's memory (buffer) fills up, it has no choice but to drop packets. Standard behavior is **Tail Drop**—the router simply throws away every new packet that arrives until there is space again. This is bad because it causes "Global Synchronization," where all your applications freak out and restart their data transfers at the same time, leading to a cycle of empty and overflowing links.

Here is how **RED** and **ECN** fix that.

---

### 1. RED (Random Early Detection)

RED is the "Proactive" approach. Instead of waiting for the buffer to be 100% full (Tail Drop), RED starts dropping packets *randomly* once the buffer hits a certain threshold.

* **How it works:** As the buffer fills up, RED starts "poking" specific connections by dropping a random packet here and there.
* **The Goal:** TCP (the protocol most apps use) is designed to slow down when it detects a dropped packet. By dropping a few packets early, RED "tricks" the sending devices into slowing down *before* the router is actually overwhelmed.
* **WRED (Weighted RED):** This is the version you'll actually use. It uses those **DSCP tags** we talked about. It will drop low-priority packets (like a background download) much sooner than high-priority packets.

---

### 2. ECN (Explicit Congestion Notification)

ECN is the "Polite" approach. It’s like RED, but instead of "punching" the connection by dropping a packet, it "taps it on the shoulder" with a warning.

* **How it works:** ECN uses two bits in the **IP Header**. When a router sees its buffer is getting full, it doesn't drop the packet; it marks it with a "Congestion Experienced" flag and sends it on its way.
* **The Reaction:** When the receiver gets the marked packet, it tells the sender, "Hey, the routers along the way are getting stressed. Slow down!"
* **The Catch:** Both the sender and the receiver (the two computers talking) must support ECN for this to work. If they don't, the router falls back to dropping packets (RED).

---

### Comparison: RED vs. ECN

| Feature | RED / WRED | ECN |
| --- | --- | --- |
| **Action** | Drops packets randomly. | Marks packets with a flag. |
| **Communication** | Indirect (Sender assumes congestion due to loss). | Direct (Sender is told about congestion). |
| **Efficiency** | Good, but causes retransmissions. | Excellent, prevents unnecessary drops. |
| **Requirement** | Works on any TCP traffic. | Requires support from both end-hosts. |

---

### The Big Picture

* **Queuing (PQ, WFQ):** Decides *who* goes first.
* **Avoidance (RED, ECN):** Decides *how* to tell everyone to slow down so the router doesn't crash.

> **Fun Fact:** ECN is like a "Low Fuel" light in a car. It gives you a warning so you can fix the problem before the engine (the network) actually stops running.

---

I hear you. QoS and Control Plane security are concepts where the "devil is in the details." Let’s peel back the layers on these three pillars so you can see exactly how the gears turn.

---

# Policing vs. Shaping: The Mechanical Deep Dive

Think of these as two different ways to handle a crowd entering a stadium through a narrow gate.

### Traffic Policing (The Bouncer)

Policing is "hard-line." It checks the traffic rate against a configured **Committed Information Rate (CIR)**.

* **The Bucket Logic:** It uses a "Token Bucket" algorithm. If a packet arrives and there’s a "token" in the bucket, the packet passes. If the bucket is empty (meaning the rate has been exceeded), the packet is **immediately dropped** or "re-marked" to a lower priority.
* **The TCP Problem:** Policing is brutal on TCP. Because TCP relies on "windowing" (speeding up until it sees a drop), a policer causes TCP to constantly crash its throughput, leading to a "sawtooth" wave that never stays at the maximum bandwidth.

### Traffic Shaping (The Waiting Room)

Shaping is "soft-line." Instead of dropping the excess, it stores it in a buffer (a queue).

* **Smoothing:** It releases the buffered packets at a steady rate. This is essential when you have a fast local port (1Gbps) connected to a slower WAN circuit (100Mbps).
* **The Buffer Penalty:** The downside is **bufferbloat**. If the buffer gets too full, the "packets" sit there waiting, which increases **latency**. If the buffer overflows, you get "tail drops" anyway.

---

# Control Plane Protection: Guarding the Brain

Your router has two "planes" of existence:

1. **Data Plane:** The fast-path (ASICs) that switches packets from Port A to Port B.
2. **Control Plane:** The CPU that handles the "thinking" (routing protocols, SSH access, SNMP).

### Why it’s a vulnerability

If I send 10,000 Pings (ICMP) per second to your router's IP address, the Data Plane can't just "switch" them. It has to hand them to the **Control Plane CPU** to answer. If the CPU is busy answering pings, it might miss an OSPF "Hello" packet from a neighbor. The neighbor thinks the router is dead, drops the connection, and your entire network reconverges (crashes).

( The "Me" Traffic (Terminating Traffic)
The Data Plane is designed to move traffic through the router. If a packet is addressed to the router’s own IP address, the ASIC doesn't have a "next hop" to send it to. The Ping Example: When you ping the router, the ASIC sees the destination IP matches its own interface. It can't "switch" the packet to another port, so it sends it to the CPU.

The Process: The CPU must interrupt its routing calculations, open the ICMP packet, generate an ICMP Echo Reply, and send it back down to the Data Plane to be transmitted.

The Risk: If I send 1 million pings, I am essentially forcing your CPU to stop doing "smart" work to answer "dumb" questions.)

### The Defense: CoPP (Control Plane Policing)

CoPP treats the CPU like it's just another interface. We create a "filter" that says:

* **Routing Protocols (BGP, OSPF):** Allow 10Mbps (High Priority).
* **Management (SSH):** Allow 1Mbps.
* **Everything Else (ICMP/Untrusted):** Allow 100kbps and drop the rest.

---

# Real-World QoS Tradeoffs & Failure Scenarios

In a lab, QoS works perfectly. In production, "Quality of Service" often feels like "Quality of Suffer."

### The "Micro-Burst" Failure

Most monitoring tools (like SolarWinds or PRTG) poll every 1 or 5 minutes. They might show your link is only 40% full. However, a server might send a 100MB burst in **20 milliseconds**.

* **The Result:** That 20ms burst exceeds the "Burst Size" of your policer or the depth of your buffers. You see "Output Drops" on the interface, but your graphs say the link is healthy. This is the #1 cause of "ghost" performance issues.

### The Voice-Data Death Spiral

We often use **LLQ (Low Latency Queuing)** for Voice. This gives Voice traffic "Strict Priority."

* **The Scenario:** If a virus or a misconfigured app starts tagging its traffic as "Voice" (DSCP EF), it enters the Priority Queue.
* **The Failure:** Because it's "Strict Priority," the router will serve that queue until it is empty **before it looks at any other queue**. It will effectively "starve" your data traffic to death. The fix is to always put a "policer" inside your priority class to limit it to, say, 30% of the link.

### Fragmented Reality

Large packets (1500 bytes) can block small, sensitive voice packets.

* **The Tradeoff:** To fix this on slow links, we use **LFI (Link Fragmentation and Interleaving)**. It breaks big packets into tiny pieces so voice can "cut in line" between them.
* **The Failure:** LFI is CPU-intensive. On modern high-speed links (above 1Gbps), LFI actually causes more problems than it solves due to the processing overhead.

---

**Would you like me to walk through a "Day in the Life of a Packet" to see exactly where these drops happen in the hardware pipeline?**







