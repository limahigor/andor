# **Projeto Andor**

O **Projeto Andor** é uma plataforma inovadora que centraliza e organiza diferentes tipos de mídia (como IPTV, torrents e Google Drive) em um único lugar. O sistema permite que os usuários criem e gerenciem canais personalizados para organizar suas mídias, oferecendo funcionalidades avançadas como streaming direto, categorização de conteúdos, suporte a dispositivos DLNA e controle remoto de reprodução.

A plataforma é composta por múltiplos serviços que trabalham em conjunto para entregar uma experiência integrada e modular. Cada funcionalidade é gerida por um serviço específico, conforme descrito abaixo.

---

## **Objetivo do Projeto**
O objetivo do Projeto Andor é simplificar o gerenciamento e a reprodução de mídias ao combinar diferentes fontes em uma interface unificada. Ele oferece:
- Organização personalizada através de canais.
- Streaming direto para o player integrado ou dispositivos DLNA.
- Suporte para diversos formatos de mídia, incluindo links de torrent, IPTV e Google Drive.
- Experiência segura e privativa, garantindo que apenas o usuário tenha acesso aos seus dados.

---

## **Arquitetura do Sistema**
O projeto é organizado em uma arquitetura modular, composta por diversos serviços:

### **1. media-service**
- Gerencia a agregação, edição e exclusão de mídias.
- Suporta diferentes fontes como IPTV, torrents e Google Drive.
  
### **2. channel-service**
- Permite a criação de canais personalizados onde as mídias são organizadas.

### **3. auth-service**
- Garante que os dados e mídias sejam acessíveis apenas pelo usuário autenticado.

### **4. api-gateway**
- Detecta dispositivos DLNA na rede local.
- Gerencia a transmissão de mídias e controle remoto de reprodução.

---

## **Como Instalar**
### Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas:
- **Node.js** (versão 16 ou superior)
- **Yarn** (versão 1.22 ou superior)
- **MongoDB** (para serviços que requerem banco de dados)

### Passos
1. Clone o repositório:
   ```bash
   git clone https://github.com/usuario/andor.git
   cd andor
   ```

2. Instale as dependências:
   ```bash
   yarn install
   ```

---

## **Como Executar**
### Para rodar o projeto:
1. Certifique-se de estar na pasta raiz do projeto (`andor`).
2. Execute o seguinte comando:
   ```bash
   yarn start
   ```

### Serviços Disponíveis:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API Gateway**: [http://localhost:5051](http://localhost:5051)
- **Media Service**: [http://localhost:3000](http://localhost:3000)
- **Auth Service**: [http://localhost:5050](http://localhost:5050)
- **Channel Service**: [http://localhost:4000](http://localhost:4000)

---


---

## **Observações**
- **Banco de Dados MongoDB**: Certifique-se de que o MongoDB está rodando localmente antes de iniciar o projeto:
  ```bash
  mongod
  ```

- **Erros Comuns**:
  - Se algum serviço não iniciar corretamente, apague as pastas node_modules e reinstale as dependências:
    ```bash
    yarn install
    ```
