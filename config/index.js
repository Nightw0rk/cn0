module.exports = {
    web: {
        port: process.env.WEB_PORT||2080,
    },
    db:{
        connection_string:"mongodb://127.0.0.1/crm"
    }
}
