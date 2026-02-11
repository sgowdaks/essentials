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





