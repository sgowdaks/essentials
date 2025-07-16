# 🔗 TCP Handshake (Three-Way Handshake)
The TCP handshake is the foundational process that establishes a reliable connection between a client and a server before any data is exchanged. It involves three steps:

* SYN (Synchronize): The client sends a SYN packet to the server to initiate a connection.
* SYN-ACK (Synchronize-Acknowledge): The server responds with a SYN-ACK packet, acknowledging the client's request and offering its own synchronization.
* ACK (Acknowledge): The client sends an ACK packet back to the server, confirming the connection.
  
At this point, both sides are ready to begin data transmission. This process ensures that both the client and server are synchronized and agree on initial sequence numbers for reliable communication .

# 🔐 SSL/TLS Handshake
The SSL handshake (now more accurately referred to as the TLS handshake) builds on top of the TCP connection to establish a secure, encrypted communication channel. Here's how it works:

* ClientHello: The client sends a message with supported TLS versions, cipher suites, and a random number.
* ServerHello: The server responds with its chosen TLS version, cipher suite, and its own random number. It also sends its digital certificate.
* Certificate Verification: The client verifies the server's certificate using a trusted Certificate Authority (CA).
* Key Exchange: The client and server agree on a shared session key using algorithms like RSA or Diffie-Hellman.
* Session Key Generation: Both parties generate the same session key independently.
* Finished Messages: Both sides send encrypted "Finished" messages to confirm that the handshake was successful.
  
Once complete, all further communication is encrypted using the shared session key.

# Well-Known Ports (0–1023):

* Reserved for system processes and widely-used services like HTTP (80), HTTPS (443), FTP (20/21), SSH (22), and DNS (53).

* Registered Ports (1024–49151): Assigned to user processes or applications. Examples include Microsoft SQL Server (1433), MySQL (3306), and RDP (3389).

* Dynamic/Private Ports (49152–65535): Not assigned by IANA. Used for ephemeral or temporary connections, often by client-side applications.
