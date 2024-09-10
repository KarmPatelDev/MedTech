import OpenAI from "openai";

const chatgptController = async (req, res) => {
    try{
        const { symptoms } = req.body;
        
        const openai = new OpenAI({ apiKey: process.env.CHATGPT_API });

        const completion = await openai.chat.completions.create({
            messages: [{role: "user", content: `${symptoms}`}],
            model: "gpt-3.5-turbo"
        });
        console.log(completion.choices[0]);
        res.status(201).send({
            success: true,
            message: "ChatGPT route hit!",
            answer: completion.choices[0].message.content,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "ChatGPT not hit!",
            error: error,
        });
    }
};

export {chatgptController};