"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares - Faz uma checagem antes de encaminhar o usuário
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rota de Health Check
app.get('/apli/health', (req, res) => {
    res.status(200).json({
        status: "OK",
        messagem: 'Servidor Backend rodando com sucesso.',
        timestamp: new Date().toISOString()
    });
});
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Health Check disponível em: http://localhost:${PORT}/api/health`);
});
