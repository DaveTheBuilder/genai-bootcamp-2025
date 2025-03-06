$MINIKUBE_IP = *.*.*.*

kubectl create configmap minikube-ip --from-literal=MINIKUBE_IP=$minikube_ip

export HFTOKEN=""

.\helm install lvm oci://ghcr.io/opea-project/charts/lvm-uservice --set global.HUGGINGFACEHUB_API_TOKEN=${HFTOKEN} -f .\llava-service.yaml

