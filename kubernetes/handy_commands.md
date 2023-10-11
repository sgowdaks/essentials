# Some usefull kubernetes commands:
* To get images used by all the pods: `kubectl get pods --all-namespaces -o jsonpath="{..image}"`
* List of all the namespaces in the pods: `kubectl get pods --all-namespaces | awk '{print $1}' | sort | uniq`
* 

