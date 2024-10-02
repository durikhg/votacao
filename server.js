const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Variáveis para armazenar votos e IPs que já votaram
let votos = { david: 0, akattana: 0 };
let registroDeVotos = [];
let ipRegistrados = new Set();  // Armazena os IPs que já votaram

// Função auxiliar para obter o IP do usuário
function obterIp(req) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip;
}

// Endpoint para votar
app.post('/votar', (req, res) => {
    const { nome, candidato } = req.body;
    const ipUsuario = obterIp(req);

    // Verificar se o IP já votou
    if (ipRegistrados.has(ipUsuario)) {
        return res.status(403).json({ message: 'Você já votou.' });
    }

    if (candidato === 'david' || candidato === 'akattana') {
        votos[candidato] += 1;
        registroDeVotos.push({ nome, candidato });
        ipRegistrados.add(ipUsuario);  // Armazena o IP

        res.json({ message: 'Voto computado com sucesso.' });
    } else {
        res.status(400).json({ message: 'Candidato inválido.' });
    }
});

// Endpoint para mostrar os resultados
app.get('/resultado', (req, res) => {
    res.json({ votos, registroDeVotos });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
