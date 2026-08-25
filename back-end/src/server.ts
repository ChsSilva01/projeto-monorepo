import express, {Request, Response} from 'express'
import cors from 'cors';
import dotenv from 'dotenv'
import { sequelize } from './config/database';
import { appRoutes } from './routes';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares - Faz uma checagem antes de encaminhar o usuário
app.use(cors())
app.use(express.json())

// Rota de Health Check
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: "OK",
        messagem: 'Servidor Backend rodando com sucesso.',
        timestamp: new Date().toISOString()
    });
});

// Registrando todas as rotas de aplicação sob o prefixo /api
app.use('/api', appRoutes)

async function main(){
    try{
        await sequelize.authenticate();
        console.log("Conexão com o PostgreSQL no Supabase realizado com sucesso");

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Health Check disponível em: http://localhost:${PORT}/api/health`)
        });

    } catch(error){
        console.log('Erro ao conectar com o banco de dados: ', error);
    }
}

main();