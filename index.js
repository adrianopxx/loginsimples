import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { readFileSync } from 'fs';

const app = express();
const PORT = 3000;

// Middleware para processar requisições JSON
app.use(json());

// Habilita o CORS para qualquer origem (domínio)
app.use(cors({
  origin: '*', // Permite qualquer domínio
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Cabeçalhos permitidos
}));

// Simula uma "tabela" de sessões na memória
const activeSessions = {};

// Função para carregar os usuários do arquivo JSON
const loadUsers = () => {
  const data = readFileSync('users.json', 'utf8');
  return JSON.parse(data);
};

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Senha inválida' });
  }

  // Cria um token simples e armazena a sessão
  const token = `${username}-${Date.now()}`;
  activeSessions[token] = user;

  res.json({ message: 'Login bem-sucedido', token });
});

// Rota protegida
app.get('/dashboard', (req, res) => {
  const token = req.headers.authorization;
  if (!token || !activeSessions[token]) {
    return res.status(403).json({ message: 'Acesso negado. Faça login.' });
  }

  const user = activeSessions[token];
  res.json({ message: `Bem-vindo, ${user.username}!` });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
