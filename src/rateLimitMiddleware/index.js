//Middleware de rate limit para agregar al flujo de express. Aplica algoritmo de ventana deslizante
//para limitar la cantidad de requests por IP, por path de destino, o por ambas

const redis = require('ioredis')
const logger = require('../logger')

//instancia local redis para prueba de concepto. (sudo apt install redis-server | redis-server --port 7000)
//el escenario real demanda un cluster ya que todas las instancias del proxy deben compartir estado

const client = redis.createClient({
    port: process.env.REDIS_PORT || 7000,
    host: process.env.REDIS_HOST || 'localhost',
  })
  client.on('connect', function () {
    console.log('Conectado a REDIS');
  });

//Obtengo limites por IP y por path
const limitedIPs = process.env.limitedIPs
const limitedPaths = process.env.limitedPaths

const rateLimitMiddleware = async (req, res, next) => {
    //De no haber limite por IP se setea el valor default
    const ip = req.socket.remoteAddress
    const limitByIp = limitedIPs ? limitedIPs[ip] : 10
    //De no haber limite por path se setea en 0 y el proceso la ignora
    const path = req.url
    const limitByPath = limitedPaths ? limitedPaths[path] : 0

    //Seteamos ventana de expiracion para la key
    //Se incrementa la key en REDIS y si el valor actual excede el limite retorna true
    const isOverLimit = async (key, limit) => {
        if (!limit) return false
        let result
        try {
            result = await client.incr(key)
          } 
        catch (err) {
            console.error('IsOverLimit: no se pudo incrementar la key')
            throw err
          }
        
        //Agregamos headers de rate limit
        res.append('X-Rate-Limit-Limit', limit)
        res.append('X-Rate-Limit-Remaining', limit - result > 0 ? limit - result : 0)
        const reset = await client.ttl(key)
        res.append('X-Rate-Limit-Reset', reset >= 0 ? reset : 0)
        
        if (result > limit) {
          return true
        }
        client.expire(key, process.env.limitWindow || 10)
        
    }

    //si se excede el limite por IP o por path se rechaza la request con STATUS CODE 429
    //de permitirse se da paso al siguiente middleware. en ambos casos se loggea la request
    try {
        const rejectedByIP = await isOverLimit(ip, limitByIp)
        const rejectedByPath = await isOverLimit(path, limitByPath)
        if (rejectedByIP || rejectedByPath) {
            logger(ip, path, 'Rechazada', rejectedByIP ? 'IP' : 'Path')
            res.status(429).send('Demasiadas requests');
        }
        else {
            logger(ip, path, 'Permitida')
            next()
        }

    }
    catch (err) {
        console.error('Error handling: ', err)
      }
    

}

module.exports = rateLimitMiddleware;