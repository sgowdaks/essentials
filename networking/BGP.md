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

