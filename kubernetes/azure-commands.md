# Create an ACR instance:
az group create --name myMLOpsResourceGroup --location eastus
az acr create --resource-group myMLOpsResourceGroup --name mymlopsregistry --sku Basic

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

az aks get-credentials --resource-group myMLOpsResourceGroup --name myMLOpsCluster
# Verify you are pointing to Azure
kubectl get nodes

kubectl apply -f service.yaml
# Wait a minute or two for the EXTERNAL-IP to provision
kubectl get service ml-model-service --watch

curl -X POST http://<public ip>/predict -H "Content-Type: application/json" -d '{"texts": ["Azure Kubernetes Service is finally working!", "I hate debugging bugs."]}'
{"task_id":"0bf3a092-45ff-475e-9b76-2e40bc208bf2","status":"Pending"}

curl http://<public ip>/result/YOUR_TASK_ID_HERE

kubectl scale deployment/ml-model-deployment --replicas=0
kubectl scale deployment/celery-worker-deployment --replicas=0
kubectl scale deployment/redis-deployment --replicas=0

kubectl scale deployment/ml-model-deployment --replicas=2
kubectl scale deployment/celery-worker-deployment --replicas=2
kubectl scale deployment/redis-deployment --replicas=1
