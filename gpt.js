import OpenAI from "openai"

const token = ''
const org = ''


const openai = new OpenAI({
    apiKey : token,
})

export default async function chat(msg){

    const chatCompletion = await openai.chat.completions.create({
        messages : [{
            'role' : 'user',
            'content' : `${msg}`,
        }],
        model : 'gpt-3.5-turbo'
    })
    console.log(chatCompletion) 
    return chatCompletion;

}

