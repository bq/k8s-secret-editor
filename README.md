# k8s-secret-editor
Secret Editor Web interface for Kubernetes

![alt tag](https://raw.githubusercontent.com/bq/k8s-secret-editor/master/docs/screenshot.png)

# Directly deploy
```
kubectl create -f k8s-deployment.yaml
kubectl create -f k8s-svc.yaml
```

# Just pull the image

It will only work if deployed to Kubernetes as it uses injected service account and environment variables to connect to K8S API service

```
docker pull bqitdevops/k8s-secret-editor
```
