document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      // Envia a solicitação de login para o servidor
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      const data = await response.json();
      
      if (response.ok) {
        // Login bem-sucedido
        document.getElementById('message').textContent = data.message;
        localStorage.setItem('authToken', data.token);  // Armazena o token no localStorage
        window.location.href = 'dashboard.html'; 
      } else {
        // Exibe a mensagem de erro
        document.getElementById('message').textContent = data.message;
      }
    } catch (error) {
      document.getElementById('message').textContent = 'Erro ao se conectar com o servidor';
    }
  });
  