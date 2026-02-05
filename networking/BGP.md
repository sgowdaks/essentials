# Learn BGP

This is the "Life of a Packet" saga. It’s Saturday night, and you are at your home in **Seattle**, sitting on your couch, trying to access a file stored on a **Microsoft Azure** server located in **Virginia**.

Here is how the Autonomous Systems, iBGP, eBGP, and AS Paths work together to make that happen.

---

### The Players

* **You:** A home user in Seattle.
* **Comcast (AS7922):** Your ISP. They have massive "Core Routers" in Seattle and New York.
* **Azure (AS8075):** Microsoft’s cloud network.
* **Google (AS15169):** A neighboring network.

---

### Step 1: The "Last Mile" (Home to Seattle Hub)

You click "Download." Your **Home Router** doesn't know where Virginia is. It doesn't speak BGP. It simply has a "Default Route" that says: *"If I don't know where it is, send it to Comcast."*

* **Protocol:** DHCP / Static Routing.
* **Status:** Your request arrives at the **Comcast Seattle Core Router**.

### Step 2: The "Internal Gossip" (iBGP)

The Seattle Router looks at the destination IP (Azure). It thinks, *"I don't have a direct physical cable to Azure here in Seattle, but I know someone in our company does."*

Because of **iBGP**, the Seattle router has been "gossiping" with the **Comcast New York Router**. The New York router previously sent an iBGP message saying: *"Hey Seattle, I have a direct connection to Azure. Send that traffic to me!"*

* **Protocol:** **iBGP** (Within AS7922).
* **Path:** Data flies across Comcast’s private fiber lines from Seattle to New York.

### Step 3: The "Diplomatic Handshake" (eBGP)

Now the data is in New York. The Comcast New York router is physically connected to an **Azure Border Router** in a shared data center (a "Meet-Me Room").

They talk via **eBGP**. Azure has "advertised" its IP addresses to Comcast, saying: *"I am AS8075. Give me anything destined for these IPs."* Comcast sees this is the shortest way to the destination.

* **Protocol:** **eBGP** (AS7922  AS8075).
* **Action:** The packet crosses the "border" from Comcast's network into Microsoft's network.

### Step 4: The AS Path (The Passport Stamps)

As your request travels, it builds a "Passport" called the **AS Path**. If we looked at the packet when it reached Azure, the path would look like this:

> **AS_PATH: 8075, 7922**

This tells the network: "This packet started in **AS7922** (Comcast) and is now in **AS8075** (Azure)."

---

### What if things break? (The Detour)

Imagine the direct cable between Comcast NY and Azure Virginia is cut by a construction crew.

1. The **eBGP** session between them drops.
2. Comcast NY checks its backup plans. It sees an advertisement from **Google (AS15169)** saying: *"I can get you to Azure!"*
3. The new **AS Path** becomes: **8075, 15169, 7922**.
4. Your data now goes **Comcast  Google  Azure**. It's a longer trip, but the internet stays alive.

---

### Summary of the Story

| Location | Router Type | Protocol | Role |
| --- | --- | --- | --- |
| **Your Living Room** | Home Router | Default Route | Just sends it to the ISP. |
| **Comcast Seattle** | Core Router | **iBGP** | Finds the best exit *inside* the company. |
| **Comcast New York** | Border Router | **eBGP** | Hands the packet to the next *country* (AS). |
| **The Global Web** | All Routers | **AS Path** | The "map" used to ensure the packet doesn't get lost. |

----------------------------------------------------------------------------------------------------------

Let's use a concrete, step-by-step example with your **Tacoma R1** and **New York (NY)** routers.

---

### The Concrete Scenario

* **Azure (AS2)** is physically connected to **Comcast NY** in a data center in Manhattan.
* **Comcast Tacoma R1** is 3,000 miles away. It has no physical connection to Azure.

#### Step 1: The eBGP Handshake (The Border)

The Azure router talks to the Comcast NY router via **eBGP**.

* **Azure says:** "Hey NY, I have the route to `13.0.0.0/8`. Send that traffic to my IP: `200.1.1.1`."
* **Comcast NY** now has this in its table. It knows: `13.0.0.0/8`  Next Hop: `200.1.1.1`.

#### Step 2: The iBGP Gossip (The Internal Info)

Now, **Comcast NY** needs to tell **Tacoma R1** about this. They talk via **iBGP**.

* **NY says to Tacoma:** "I found a way to Azure (`13.0.0.0/8`). The Next Hop is `200.1.1.1`."
* **The Problem:** Tacoma R1 looks at its map and says, "Wait, I don't know who `200.1.1.1` is. That's an Azure IP. I don't have a road to it!"

#### Step 3: The "Next-Hop-Self" Fix (The Solution)

To fix this, Comcast engineers use a famous command called **`next-hop-self`**.

* Now, **Comcast NY** says to Tacoma: "I have a route to Azure. **But just send it to ME (Comcast NY)**. I'll handle the rest."
* **Tacoma R1** now has this instruction: `13.0.0.0/8`  Next Hop: **Comcast NY's IP**.

---

### How they work together (The Final Chain)

When you at home send a packet to Azure:

1. **Tacoma R1** receives the packet. It checks its **iBGP** table: "Destination Azure? iBGP says go to **Comcast NY**."
2. **Tacoma R1** checks its **OSPF** map: "How do I get to NY? OSPF says use the fiber path through Chicago."
3. The packet travels through the internal Comcast "roads" (OSPF) until it hits **Comcast NY**.
4. **Comcast NY** receives it. It checks its **eBGP** table: "Destination Azure? I'm connected right here. Hand it over the wire!"

### Summary Table: Who told whom?

| Interaction | Type | The Message |
| --- | --- | --- |
| **Azure  Comcast NY** | **eBGP** | "I own this prefix, here is my border IP." |
| **Comcast NY  Tacoma R1** | **iBGP** | "To reach Azure, send the data to **ME** (NY)." |
| **Tacoma R1 internal math** | **OSPF** | "The fastest way to reach **NY** is through Chicago." |

---

### Why iBGP is necessary

If you didn't have iBGP, Tacoma R1 would be "blind." It would know how to reach every other Comcast router (thanks to OSPF), but it would have no idea that Azure even exists or which Comcast router is the "door" to get there. **iBGP is the bridge that brings the external news (eBGP) to the internal routers.**

Would you like to see the specific BGP "Next Hop" command as it looks in a router's configuration file?

[Understanding BGP Next-Hop-Self](https://www.youtube.com/watch?v=KTrGzMcanZg)

This video is helpful because it visually demonstrates the "Next Hop" problem where internal routers see an external IP they can't reach, and explains exactly how the `next-hop-self` command solves it.

--------------------------------------------------------------------------------
This is the "final boss" of understanding networking architecture. Let’s clear the air: **OSPF and IS-IS are "competitors" (they do the same job), while iBGP is their "partner" (it does a different job).**

To understand how they fit together, think of a **Delivery Truck** (your data).

* **OSPF / IS-IS** are the **GPS** that tells the truck which streets are paved and which bridges are open.
* **iBGP** is the **Shipping Manifesto** that tells the truck which packages go to which cities.

---

## 1. OSPF vs. IS-IS (The "IGP" Rivals)

Both are **Link-State** protocols. They both use the **Dijkstra (SPF) algorithm**. They are essentially the same "engine," but they are built differently.

| Feature | OSPF (Open Shortest Path First) | IS-IS (Intermediate System to IS) |
| --- | --- | --- |
| **Layer** | Runs on top of **IP** (Layer 3). | Runs on top of **Data Link** (Layer 2). |
| **History** | Built specifically for the TCP/IP internet. | Built for a different networking standard (OSI), then adapted. |
| **Scaling** | Uses "Areas" (Area 0 is the center). | Uses "Levels" (L1 for local, L2 for backbone). |
| **Stability** | If IP breaks, OSPF can fail. | Very stable; it doesn't need IP to stay alive. |
| **Popularity** | Standard for **Enterprises** (Banks, Offices). | Standard for **Service Providers** (Comcast, AT&T). |

**Why Comcast uses IS-IS:** Because IS-IS doesn't run on IP, it is considered more "flexible" and easier to scale when you have thousands of routers. It is very "clean."

---

## 2. Is OSPF part of iBGP?

**No.** They are separate processes running in the **Control Plane**, but they have a "dependency" relationship.

* **OSPF/IS-IS provides the "Reachability":** It ensures Router A can "ping" Router B inside the same AS.
* **iBGP provides the "Intelligence":** It sits **on top** of OSPF. It uses the connection OSPF built to send lists of global internet addresses.

> **Crucial Concept:** If OSPF fails, iBGP also fails. If the GPS (OSPF) doesn't know how to get to the New York router, the Shipping Manifesto (iBGP) can't tell you to send packages there.

---

## 3. The "Structural Flow" Comparison

Let's look at how they live inside that **Comcast Seattle Router**:

### The Internal Engine (OSPF or IS-IS)

1. **Job:** Map every cable in Seattle/Tacoma.
2. **Traffic:** Only cares about **internal** IPs (e.g., `10.0.0.1`).
3. **Speed:** Extremely fast. If a cable breaks, it recalculates in milliseconds.

### The External Messenger (iBGP)

1. **Job:** Share the "Azure" and "Google" addresses learned from the border.
2. **Traffic:** Cares about **external** IPs (e.g., `13.x.x.x`).
3. **Speed:** Slower. It doesn't care about the cables; it just cares about the "Next Hop" router.

---

## 4. Scaling Characteristics (Why not just use one?)

You might ask: *"Why can't iBGP just do everything?"*

* **iBGP is a "Distance Vector" style protocol:** It's great at carrying millions of routes, but it's terrible at finding the "fastest street." It doesn't know about fiber speed or congestion.
* **OSPF/IS-IS is a "Link-State" protocol:** It's a genius at finding the "fastest street," but it would "overthink" and crash if you gave it 1,000,000 routes to calculate.

---

## Summary: Putting it all together

If you are the Comcast Seattle Router:

1. **IS-IS (or OSPF)** tells you: "I have a fiber path to our New York router."
2. **iBGP** tells you: "The New York router is the gateway to Azure."
3. **The Control Plane** combines this: "To get to Azure, I'll use the fiber path to New York."
4. **The Data Plane** executes: Pushes your packet out the door.

Does the distinction between "building the road" (OSPF/IS-IS) and "knowing what's at the end of the road" (iBGP) make sense? Would you like to see how **Route Filtering** allows Comcast to choose which "packages" they are willing to carry?
