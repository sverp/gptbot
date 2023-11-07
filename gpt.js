import OpenAI from "openai"

const token = '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'
const org = 'org-XL9DyYt4nP4khUfesEDpYxwP'


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

