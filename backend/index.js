const connectToMongo = require("./db");
const express = require('express')
const cors = require('cors')

const app = express()
const port = 8000
app.use(express.json());
app.use(cors())
//MonogDb Connection
connectToMongo() ;

//Available Routes
app.get("/",(req,res)=>{
    res.send("Hello")
})
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/notes', require('./routes/notes'));

app.listen(port,()=>{
    console.log(`App listening on http://localhost:${port}`)
})