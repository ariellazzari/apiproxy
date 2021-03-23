//Idealmente loggeariamos con Winston o similar para escribir los logs al servidor de elasticSearch

const logger = (ip, path, resultado, razon = '') => {
    console.log('Enviando a DB:', new Date(), ip, path, resultado, razon)
}

module.exports = logger