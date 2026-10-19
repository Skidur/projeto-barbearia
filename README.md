# ✂️ BarberFlow — Sistema de Agendamento para Barbearias

Aplicação web full-stack para agendamento online em barbearias. O cliente escolhe o barbeiro, os serviços e um horário livre, e o sistema garante que não existam dois agendamentos no mesmo horário.

> 🚧 **Projeto em desenvolvimento.** O fluxo do cliente (cadastro, login, agendamento e cancelamento) já funciona de ponta a ponta. O painel administrativo da barbearia ainda está sendo construído. Veja o [roadmap](#-roadmap) abaixo.

---

## ✨ Funcionalidades

### Já implementado
- **Site institucional** com apresentação da barbearia, serviços, equipe e galeria
- **Cadastro e login** com senha criptografada (bcrypt) e autenticação via JWT
- **Agendamento em etapas:** escolha do barbeiro → serviços → data → horário disponível → confirmação
- **Cálculo automático de disponibilidade**, considerando:
  - expediente de cada barbeiro por dia da semana
  - folgas cadastradas
  - duração somada dos serviços escolhidos
  - horários já reservados e horários que já passaram no dia
- **Proteção contra reserva dupla:** o agendamento roda em transação com `SELECT ... FOR UPDATE`, então duas pessoas não conseguem reservar o mesmo horário ao mesmo tempo
- **Histórico de preços:** o preço e a duração de cada serviço são gravados no momento da reserva, então mudanças futuras na tabela de preços não alteram agendamentos antigos
- **Minha Conta:** lista de agendamentos do cliente, com cancelamento permitido até 2 horas antes do horário
- **Banco versionado** com migrations (node-pg-migrate) e seed com barbeiros, serviços e expedientes de exemplo

### 🗺️ Roadmap
- [ ] Painel administrativo (dashboard da barbearia e gestão de serviços)
- [ ] Gestão de expediente e folgas pelo próprio barbeiro
- [ ] Rotas de perfil de usuário (editar dados da conta)
- [ ] Envio de lembretes por e-mail e WhatsApp (a preferência já é salva no cadastro)
- [ ] Marcação de atendimentos como concluídos
- [ ] Deploy

---

## 🛠️ Tecnologias

**Frontend**
- React 19 + Vite
- React Router
- Axios
- React Slick (carrossel)

**Backend**
- Node.js + Express 5
- PostgreSQL (`pg`)
- node-pg-migrate
- JWT (`jsonwebtoken`) + bcryptjs

---

## 📁 Estrutura

```
projeto-barbearia/
├── backend/
│   └── src/
│       ├── app/
│       │   ├── controllers/   # regras de negócio (auth, barbeiros, agendamentos)
│       │   └── middlewares/   # autenticação JWT
│       ├── config/            # conexão com o PostgreSQL
│       ├── database/
│       │   ├── migrations/    # schema versionado
│       │   └── seeders/       # dados de exemplo
│       └── routes/
└── frontend/
    └── src/
        ├── components/        # header, footer, carrossel
        ├── contexts/          # contexto de autenticação
        ├── pages/             # Home, Agendamento, Cadastro, Login, Minha Conta
        └── services/          # chamadas à API
```

### Modelo de dados

`users` · `barber_profiles` · `clients` · `services` · `barber_schedules` · `barber_time_off` · `appointments` · `appointment_services`

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL

### 1. Clone o repositório
```bash
git clone https://github.com/Skidur/projeto-barbearia.git
cd projeto-barbearia
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edite o `.env` com os dados do seu banco:
```env
PORT=3333
DATABASE_URL=postgres://usuario:senha@localhost:5432/barberflow
JWT_SECRET=uma_chave_secreta
```

Crie as tabelas, popule os dados de exemplo e suba o servidor:
```bash
npm run migrate:up
npm run seed
npm run dev
```

A API sobe em `http://localhost:3333`. Para conferir: `GET /health`.

### 3. Frontend
Em outro terminal:
```bash
cd frontend
npm install
```

Crie um arquivo `.env` dentro de `frontend/`:
```env
VITE_API_URL=http://localhost:3333
```

E rode:
```bash
npm run dev
```

---

## 🔌 Endpoints da API

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| `GET` | `/health` | — | Status da API |
| `POST` | `/auth/register` | — | Cadastro de cliente |
| `POST` | `/auth/login` | — | Login, retorna o token JWT |
| `GET` | `/barbers` | — | Lista os barbeiros |
| `GET` | `/barbers/:barberId/services` | — | Serviços de um barbeiro |
| `GET` | `/barbers/:barberId/availability?date=AAAA-MM-DD&serviceIds=1,2` | — | Horários livres no dia |
| `POST` | `/appointments` | ✅ | Cria um agendamento |
| `GET` | `/appointments/me` | ✅ | Agendamentos do usuário logado |
| `DELETE` | `/appointments/:id` | ✅ | Cancela um agendamento (mín. 2h de antecedência) |

---

## 👤 Autor

Desenvolvido por **Lucas Durski** — [GitHub](https://github.com/Skidur)
