const express = require('express');
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const pg = require('pg')


const app = express()
app.use(cors())
app.use(bodyParser.json())


const Pool = pg.Pool

const pool = new Pool({
    user:"blog",
    host:"localhost",
    password:"natuurlijk",
    database:"blog",
    port:5432
})

app.use(express.static('public'))

app.get('/api/getArticles', async (req,res)=>{
    const response =  await pool.query('select * from articles')
    const result = response.rows
    return res.status(200).json(result)
})
app.post('/api/uploadVote', async (req,res)=>{
    
    const id =req.body.id
    const client = await pool.connect()

    try{
        await client.query('BEGIN')
        await client.query(`update articles set votes=votes+1 where article_id='${id}'`);
        await client.query('COMMIT')
        return res.status(200).json('Updated')
    }
    catch(e){
        await client.query('ROLLBACK')
        res.status(400).json('Ups, something went wrong!')
        throw e
        
    }
})


const PORT = process.env.PORT || 5555;

app.listen(PORT, ()=>{
    console.log(`App is listening on port: ${PORT}`)
})