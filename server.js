let express = require('express');
let path = require("path")

let app = express();

app.use(express.static(path.join(__dirname, 'public')));


app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname + '/view/index.html'))
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});