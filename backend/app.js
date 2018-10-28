const serverConfig =  require('./../server.js');
const app = serverConfig.app;

app.get("/data", (req, res) => {
    res.send("Congrats!!!");
});
