# Some usefull kubernetes commands:
* To get images used by all the pods: `kubectl get pods --all-namespaces -o jsonpath="{..image}"`
* List of all the namespaces in the pods: `kubectl get pods --all-namespaces | awk '{print $1}' | sort | uniq`
* https://youtu.be/s_o8dwzRlu4?si=eFM2Ke-IvrZwKRat
* https://youtu.be/X48VuDVv0do?si=W-psogDaPWw1eESV
* https://devopscube.com/kubernetes-architecture-explained/

* https://learn.microsoft.com/en-us/troubleshoot/azure/azure-kubernetes/logs/capture-tcp-dump-linux-node-aks
* https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-portal?tabs=azure-cli
* https://learn.microsoft.com/en-us/troubleshoot/azure/azure-kubernetes/connectivity/connection-issues-application-hosted-aks-cluster#inside-out-troubleshooting
* https://github.com/Azure/application-gateway-kubernetes-ingress
* https://learn.microsoft.com/en-us/azure/aks/app-routing

