# apiproxy

API Proxy routea todas las requests entrantes hacia una API destino siempre y cuando no se exceda el rate limit. El rate limit puede ser por IP, por path de destino, o por ambos. El algoritmo aplicado es de ventana deslizante.


Para priorizar la performance y escalabilidad la aplicacion:

-Se utiliza Nginx como reverse proxy y load balancer.

-La aplicación en node.js corre con cluster en contenedores docker (o similar). Escala horizontalmente agregando instancias.

-Las instancias de la aplicacion mantienen el estado mediante un servidor Redis. Este escala verticalmente hasta el límite, luego escala horizontalmente agregando nuevas masters, slaves, y réplicas al cluster.

-Los logs se delegan a una cola FIFO hacia la base de datos de manera asincronica para mayor performance de la aplicacion.

-Una aplicacion web muestra estadisticas de uso del proxy nutriendose de los logs almacenados en la base de datos.