Create an ACR instance:

az group create --name myMLOpsResourceGroup --location eastus
az acr create --resource-group myMLOpsResourceGroup --name mymlopsregistry --sku Basic

Log into your registry and push your ML image:


# Log in to ACR via Azure CLI
az acr login --name mymlopsregistry

# Tag your existing local ML image to point to your ACR
docker tag ml-model-api:latest mymlopsregistry.azurecr.io/ml-model-api:v1

# Push the image to Azure
docker push mymlopsregistry.azurecr.io/ml-model-api:v1

#Create an AKS cluster and link it to your ACR
az aks create \
    --resource-group myMLOpsResourceGroup \
    --name myMLOpsCluster \
    --node-count 2 \
    --node-vm-size standard_dc4ds_v3 \
    --generate-ssh-keys \
    --attach-acr mymlopsregistry
