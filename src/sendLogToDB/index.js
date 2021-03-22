const sendLogToDB = (ip, path, resultado, razon = '') => {
    console.log('Enviando a DB:', new Date(), ip, path, resultado, razon)
}

module.exports = sendLogToDB