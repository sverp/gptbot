import express from 'express'
import axios from 'axios'
import bodyParser from 'body-parser'
import chat from './gpt.js'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const port = 5000;
const token = ''


app.get('/*',(req,res) => {
    console.log(req.query)
    const mode = req.query['hub.mode']
    const challenge = req.query['hub.challenge']
    const token = req.query['hub.verify_token']

    console.log("Headers:"+ JSON.stringify(req.headers, null, 3));
    console.log("Body:"+ JSON.stringify(req.body, null, 3));
    if(mode && token){
        if(mode === 'subscribe' && token === '12345'){
            console.log('verified')
            res.status(200).send(challenge)
        }
    }
})

app.post('/webhooks', async (req,res) => {
    //console.log("body:"+ JSON.stringify(req.body, null, 3));


    if(req.body.entry[0].changes[0].value.messages){
        res.sendStatus(200);
        const inreq = req.body.entry[0].changes[0].value
        const msg = inreq.messages[0]

        let messageid = msg.id
        let phoneno = msg.from
        let mssg = msg.text.body 

        let replydata = await chat(mssg)
        let replymsg = replydata.choices[0].message.content;
        let replytoken = replydata.usage.total_tokens;
        console.log("token used => " + replytoken );

        const resd = await axios({
            method : 'post',
            url : 'https://graph.facebook.com/v18.0/169672706221839/messages',
            headers : {
                'Authorization' : `Bearer ${token}` ,
                'Content-Type' : 'application/json'
            },
            data: {
                'messaging_product' : 'whatsapp',
                'reciepient_type' : 'individual',
                'context' : {
                    'message_id' : messageid,
                },
                'to' : phoneno,
                'type' : 'text',
                'text' : {
                    'body' : `${replymsg}`
                }, 
            }

        })
    }  
    
    if(req.body.entry[0].changes[0].value.statuses){
        res.sendStatus(200);
    }
})

app.listen(port, ()=> {
    console.log('listening ' + port)
})
