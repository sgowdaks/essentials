# Why do we need Kubernetes, when there is docker

## 🧱 1. Scalability & Load Balancing
Docker Compose: You can scale services manually using docker-compose up --scale, but it lacks built-in load balancing.
Kubernetes: Automatically scales pods based on CPU/memory usage or custom metrics. It also includes built-in load balancing via Services.
## 🔁 2. Self-Healing
Docker Compose: If a container crashes, it stays down unless manually restarted.
Kubernetes: Automatically restarts failed containers, replaces them, and reschedules them on healthy nodes.
## 🔄 3. Rolling Updates & Rollbacks
Kubernetes: Supports rolling updates with zero downtime and can roll back to previous versions if something goes wrong.
Docker Compose: No native support for rolling updates or rollbacks.
## 🌍 4. Multi-Node Clustering
Docker Compose: Runs on a single host.
Kubernetes: Manages applications across a cluster of machines, distributing workloads and ensuring high availability.
## 🔐 5. Secrets & Config Management
Kubernetes provides native support for managing secrets and configuration separately from application code.
## 📊 6. Observability & Monitoring
Kubernetes integrates with tools like Prometheus, Grafana, and Fluentd for logging, monitoring, and alerting.
## 🧩 7. Ecosystem & Extensibility
Kubernetes has a vast ecosystem (Helm, Operators, CRDs) and is cloud-agnostic, making it easier to deploy across AWS, Azure, GCP, or on-prem.

# Kubernetes example that runs flask in the backend and retrives data from a database

Your Application Components:

Flask Server: This is your application's "brain" that handles requests and serves data.

Database: This is where your application's data is stored.

How Pods, Nodes, and Cluster Come into Picture in Kubernetes:
First, before Kubernetes, you'd likely containerize each part of your application. So, you'd have:

A Docker image for your Flask server.

A Docker image for your database (e.g., a PostgreSQL or MySQL image).

Now, let's bring in Kubernetes:

1. The Pods (Your Application's Building Blocks)
Flask Server Pod:

You would create a Pod definition (a YAML file) specifically for your Flask server.

This Pod would contain one container: your Flask server's Docker image.

Why a Pod for the Flask server? This is the fundamental unit of deployment. Kubernetes manages pods, not individual containers. If your Flask server needs to scale, Kubernetes will create more pods of your Flask server.

Database Pod:

You would create a separate Pod definition for your database.

This Pod would contain one container: your database's Docker image (e.g., postgres:latest).

Why a Pod for the database? Similar to the Flask server, the database needs its own managed unit. For production databases, you'd often use a special Kubernetes object called a StatefulSet to manage database pods, as they require stable identities and persistent storage, but for simplicity, let's consider it a Pod for now.

Communication between Flask Server Pod and Database Pod:

Crucially, these two pods will need to communicate. In Kubernetes, you'd use a Service (a networking abstraction) to provide a stable network endpoint for your database. Your Flask server pod would then connect to the database via this Service name, not directly to the database pod's IP address (which can change).

2. The Nodes (Where Your Pods Live)
Imagine your factory (Cluster) has multiple workstations (Nodes).

When you "deploy" your Flask Server Pod and Database Pod, the Kubernetes Scheduler (part of the Control Plane) decides which Node each pod should run on.

Node 1 (e.g., a machine named worker-node-a):

The Scheduler might decide to place your Flask Server Pod on this node because it has available CPU and memory.

The kubelet on worker-node-a would then instruct its container runtime (e.g., Docker) to pull your Flask server image and start the container within the Flask Server Pod.

Node 2 (e.g., a machine named worker-node-b):

The Scheduler might decide to place your Database Pod on this node.

The kubelet on worker-node-b would then instruct its container runtime to pull your database image and start the container within the Database Pod.

What if a Node Fails? This is a key benefit of Kubernetes. If worker-node-a suddenly crashes, Kubernetes detects that your Flask Server Pod is no longer running. The Controller Manager will then tell the Scheduler to find another healthy Node in the cluster (e.g., worker-node-c) and reschedule your Flask Server Pod there, ensuring your application stays available.

3. The Cluster (Your Entire Automated Factory)
Your Flask Server Pod and Database Pod are running on different Nodes, but they are all part of the same Kubernetes Cluster.

The Control Plane of your cluster is constantly monitoring everything:

Is the Flask Server Pod healthy?

Is the Database Pod healthy?

Are the Nodes healthy?

Are there enough resources?

Scaling: If your Flask application becomes popular and you need to handle more users, you can tell Kubernetes to scale up your Flask server. The Controller Manager will then create more instances of your Flask Server Pod, and the Scheduler will distribute them across the available Nodes in your Cluster.

Networking: The kube-proxy on each Node, along with Kubernetes Services, ensures that your Flask Server Pod can reliably find and communicate with your Database Pod, even if they move to different Nodes or new pods are created.

Management: You interact with the API Server of your Cluster (e.g., using kubectl commands) to deploy your pods, services, and other Kubernetes objects. You don't directly log into the Nodes to start containers.

Summary of the Flow:
You containerize your Flask server and database into separate Docker images.

You write Kubernetes YAML files defining:

A Pod (or a higher-level object like a Deployment) for your Flask server, specifying its container image.

A Pod (or StatefulSet) for your database, specifying its container image and persistent storage needs.

Services to allow your Flask server to find and talk to the database, and to expose your Flask server to the outside world.

You use kubectl apply -f your-manifests.yaml to tell your Kubernetes Cluster about your desired application state.

The Control Plane (Scheduler, Controller Manager) orchestrates:

Deciding which Nodes to place your Flask Server Pod and Database Pod on.

Ensuring these Pods are running their respective containers.

Monitoring their health and restarting them if necessary (possibly on different Nodes).

Handling networking so your Flask server can connect to the database, and users can access your Flask server.

