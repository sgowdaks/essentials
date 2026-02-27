### I. The Core Entities (The "Building Blocks")

* **Containers:** The isolated "bubbles" where your code lives. They solve the "it works on my machine" problem by bundling libraries and settings.
* **Docker Images:** The "frozen" blueprint or recipe for a container.
* **Pods:** The smallest unit in Kubernetes. Think of a Pod as a **wrapper** (an envelope) that can hold one or more containers (letters).
* **Sidecars:** Running a helper container (like a logger) alongside your main app in the same Pod so they share the same IP and storage.


* **Nodes:** The physical or virtual servers (the "muscle") that provide RAM, CPU, and GPUs.
* **Cluster:** The collection of all Nodes managed by a single "Brain" (Control Plane).

---

### II. Orchestration & Management (The "Manager")

* **Docker vs. Kubernetes:** Docker builds and runs individual containers; Kubernetes manages hundreds of them across many servers.
* **Control Plane:** The hidden "Brain" of Kubernetes that decides which Node should run which Pod.
* **containerd:** The lightweight "worker" that Kubernetes uses under the hood today, replacing the heavier Docker Engine in production.
* **YAML Files:** The "Owner’s Manual" where you declare your **Desired State** (e.g., "I want 3 copies of my web app"). Kubernetes works 24/7 to make sure reality matches this file.

---

### III. Scaling & Resources (The "Strategy")

* **Resource Requests & Limits:** * **Request:** The minimum RAM/CPU a Pod needs to start.
* **Limit:** The "hard ceiling" to prevent one app from crashing the whole server.


* **Horizontal Scaling:** Adding more **Pods** (clones) to handle more traffic.
* **Vertical Scaling:** Giving a single Node or Pod **more RAM/CPU**.
* **GPU Integration:** Using special labels like `nvidia.com/gpu: 1` in your YAML to ensure your LLM Pod only lands on servers with expensive hardware.

---

### IV. Specialized Workloads (The "Heavy Hitters")

* **Deployments:** Used for "Stateless" apps like your Webapp. If a Pod dies, K8s replaces it with a random new one.
* **StatefulSets:** Used for "Stateful" apps like your **Database**. They provide:
1. Stable names (e.g., `db-0`, `db-1`).
2. Persistent storage (the hard drive "follows" the pod if it moves).


* **Microservices Split:** Ripping the LLM logic out of your main `.py` file so the Webapp and the LLM can scale independently.

---

### V. Networking & Discovery (The "Communication")

* **Services:** A stable "Internal Phone Number" for a group of Pods.
* **Service Discovery:** The ability for your Webapp to talk to your database by simply using the name `db` instead of a shifting IP address.
* **Ports:** The "Doors" (e.g., 5432 for SQL, 8000 for LLM) that containers use to listen for data.

---

