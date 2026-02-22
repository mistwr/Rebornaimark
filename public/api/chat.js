import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: "Método não permitido" });
  }

  const { input } = req.body;

  if(!input) return res.json({ reply: "Por favor insira uma pergunta." });

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: input })
    });

    const data = await response.json();

    let reply = "";
    if(data.hasOwnProperty("error")){
      reply = "Modelo temporariamente indisponível.";
    } else if(Array.isArray(data) && data[0].hasOwnProperty("generated_text")){
      reply = data[0].generated_text;
    } else {
      reply = "Não consegui gerar resposta.";
    }

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ reply: "Erro ao processar a pergunta." });
  }
}
