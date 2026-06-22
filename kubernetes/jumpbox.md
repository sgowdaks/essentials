# Install Azure CLI (assuming Ubuntu/Debian VM)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Install kubectl via Azure CLI
sudo az aks install-cli

# Log in to your Azure account
az login

# Fetch the credentials for your AKS cluster to configure kubectl
az aks get-credentials --resource-group <Your-Resource-Group> --name <Your-AKS-Cluster-Name>

## This below command will give error, if docker is not installed in the current machine
(When you run az acr login, the Azure CLI looks for a local Docker installation on your VM and tries to pass the login credentials to it. Since this is a brand new test VM, Docker isn't set up yet.)
az acr login --name mymlopsregistry

# 1. Update your package index
sudo apt-get update

# 2. Install Docker
sudo apt-get install -y docker.io

# 3. Start the Docker service and enable it to run on boot
sudo systemctl start docker
sudo systemctl enable docker

# 4. Give your user permission to run Docker without typing 'sudo' every time
sudo usermod -aG docker $USER

# 5. Force the terminal to activate this permission right now
newgrp docker

# 6. Test it (watch the spelling on this one!)
docker ps

docker build -t mymlopsregistry.azurecr.io/myapp:v1 .
docker push mymlopsregistry.azurecr.io/myapp:v1

## Now you would have been able to login, if previously if were not able to login.

