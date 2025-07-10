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
* create a simple hello world python file: `app.py`
  







