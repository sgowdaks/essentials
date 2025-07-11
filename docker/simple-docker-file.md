# Docker Architecture

```
+----------------------------+
|     User Applications     |  ← e.g., Docker CLI, VS Code, Chrome
+----------------------------+
|     Operating System      |  ← Windows, Linux, macOS
+----------------------------+
|          Kernel           |  ← Manages CPU, memory, I/O, etc.
+----------------------------+
|         BIOS/UEFI         |  ← Firmware that boots the system
+----------------------------+
|         Hardware          |  ← CPU, RAM, Disk, etc.
+----------------------------+

```

* Docker runs on top of the OS, but it talks directly to the kernel to create and manage containers.
* It uses the kernel (especially Linux kernel features like namespaces and cgroups) to isolate containers.
* On Linux, Docker uses the host’s kernel directly.
* On Windows/macOS, Docker runs a lightweight Linux VM (via WSL2 or HyperKit) because containers need a Linux-compatible kernel.

# Docker simple file creation

## Install Python 
 * Download Miniconda Installer : `wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh` 
 * Run the Installer: `bash Miniconda3-latest-Linux-x86_64.sh` 
 * Activate Conda: `source ~/miniconda3/bin/activate`
 * conda initilization: `conda init`

## Install Docker
* https://docs.docker.com/engine/install/ubuntu/

## Create Docker Image

Docker Script
```
# Use a base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy the script into the container
COPY app.py .

# Define the command to run the script
CMD ["python", "app.py"] 

```

* Create a Dockerfile: `touch Dockerfile` and add the above script into the docker file
* Create a simple hello world python file: `app.py`
* Add Your User to the Docker Group: `sudo usermod -aG docker $USER`
* Build docker image: `docker build -t my-python-app .`
* Run docker container: `docker run my-python-app` (non interative)
* Run the container: `docker run -it ymy-python-app` (interactive)
* List running container: `docker ps`
* List running container that has completed excecuted: `docker ps -a`
* Docker Images: `docker images`
* Keeps running the short docker: `docker run -it --name <container name> my-python-app tail -f /dev/null`
* Docker command to get into the conatiner: `docker exec -it <container name> /bin/bash`
*  Docker port mapping from container 8080 to local machine 80: `docker run -d -p 8080:80 simple-webapp`

  







