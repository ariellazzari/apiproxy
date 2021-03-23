# API Proxy

API Proxy routea todas las requests entrantes hacia una API destino siempre y cuando no se exceda el rate limit. El rate limit puede ser por IP, por path de destino, o por ambos. El algoritmo aplicado es de ventana deslizante.


Para priorizar la performance y escalabilidad la aplicacion:

-Se utiliza Nginx como reverse proxy y load balancer.

-La aplicación en node.js corre en kubernetes.

-Las instancias de la aplicacion mantienen el estado mediante un servidor Redis. Este escala verticalmente hasta el límite, luego escala horizontalmente agregando nuevas masters, slaves, y réplicas al cluster. Se usa Winston para redirigir los logs hacia un servidor de ElasticSearch.

-Utilizamos Kibana para monitorear la aplicacion.



##Arquitectura:

![API Proxy](docs/apiproxy.png?raw=true "API Proxy")



##Diagrama funcional:

![Diagrama funcional](docs/funcional.png?raw=true "Diagrama funcional")


###Uso:

Instancia local Redis:
```
sudo apt install redis-server
redis-server --port 7000
```

Servidor destino:
```
npm run target
```

Aplicacion API proxy:
```
npm run start
```



