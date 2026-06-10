# 1. Create the Resource Group (if not already done)
az group create --name myMLOpsResourceGroup --location eastus

# 2. Create the VNet
az network vnet create \
    --resource-group myMLOpsResourceGroup \
    --name myMLOpsVNet \
    --address-prefixes 10.0.0.0/16

# 3. Create a subnet for AKS nodes
az network vnet subnet create \
    --resource-group myMLOpsResourceGroup \
    --vnet-name myMLOpsVNet \
    --name aks-subnet \
    --address-prefixes 10.0.1.0/24

# 4. Create a subnet for Private Endpoints (Disable network policies for private endpoints)
az network vnet subnet create \
    --resource-group myMLOpsResourceGroup \
    --vnet-name myMLOpsVNet \
    --name private-endpoint-subnet \
    --address-prefixes 10.0.2.0/24

# 1. Create Premium ACR
az acr create \
    --resource-group myMLOpsResourceGroup \
    --name mymlopsregistry \
    --sku Premium \
    --public-network-access false # Blocks all public internet traffic

# 2. Create the Private Endpoint for ACR
az network private-endpoint create \
    --name acrPrivateEndpoint \
    --resource-group myMLOpsResourceGroup \
    --vnet-name myMLOpsVNet \
    --subnet private-endpoint-subnet \
    --private-connection-resource-id $(az acr show --name mymlopsregistry --query id --output tsv) \
    --group-id registry \
    --connection-name acrConnection


# Create the Private DNS Zone
az network private-dns zone create \
    --resource-group myMLOpsResourceGroup \
    --name privatelink.azurecr.io

# Link the DNS zone to your VNet
az network private-dns link vnet create \
    --resource-group myMLOpsResourceGroup \
    --zone-name privatelink.azurecr.io \
    --name myDNSLink \
    --virtual-network myMLOpsVNet \
    --registration-enabled false

# Create the DNS zone configuration for the private endpoint
az network private-endpoint dns-zone-group create \
    --resource-group myMLOpsResourceGroup \
    --endpoint-name acrPrivateEndpoint \
    --name acrZoneGroup \
    --private-dns-zone privatelink.azurecr.io \
    --zone-name registry

# Get the subnet ID for AKS
AKS_SUBNET_ID=$(az network vnet subnet show --resource-group myMLOpsResourceGroup --vnet-name myMLOpsVNet --name aks-subnet --query id --output tsv)

# Create Private AKS Cluster attached to your Premium ACR
az aks create \
    --resource-group myMLOpsResourceGroup \
    --name myMLOpsCluster \
    --node-count 2 \
    --node-vm-size standard_dc4ds_v3 \
    --generate-ssh-keys \
    --vnet-subnet-id $AKS_SUBNET_ID \
    --enable-private-cluster \
    --attach-acr mymlopsregistry \
    --network-plugin azure \
    --service-cidr 10.240.0.0/16 \
    --dns-service-ip 10.240.0.10
