# The Three Planes of Existence
Every high-end router is split into three functional layers:

Management Plane: The "Human Interface." This is where you SSH into the router, change the password, or update the firmware. It's how you talk to the router.

Control Plane: The "Brain." This is where the routing protocols (OSPF, BGP) live. It builds the map and calculates the best path. It doesn't move your YouTube video; it just decides how it should move.

Data Plane: The "Muscle." Also called the Forwarding Plane. Once the Control Plane says "Send traffic for Google to Port 5," the Data Plane handles the actual electrical/optical switching of packets at lightning speed.
