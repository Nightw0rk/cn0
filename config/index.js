module.exports = {
    web: {
        port: process.env.WEB_PORT||2080,
    },
    db:{
        connection_string:"mongodb://192.168.0.176:2717/crm"
    }
}
