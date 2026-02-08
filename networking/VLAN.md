# The Step-by-Step Journey
If Device A (VLAN 1) wants to send a packet to Device B (VLAN 2), here is the play-by-play:

The Realization: Device A looks at Device B's IP address and realizes, "Hey, this isn't on my local network."

The Gateway: Instead of sending it directly to Device B, Device A sends the data to its Default Gateway (the router's interface for VLAN 1).

The Tagging: The switch receives the data, tags it as belonging to VLAN 1, and sends it up the trunk line to the router.

The "Jump": The router receives the packet, strips off the VLAN 1 tag, looks at the destination IP, and sees it belongs to VLAN 2.

The Return: The router tags the packet for VLAN 2 and sends it back down to the switch.

Delivery: The switch sees the VLAN 2 tag and delivers the packet to Device B’s port.
