import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { JWT_SECRET } from '../config/auth';

export class AuthController{
    // POST /api/auth/login
    public static async login (req: Request, res: Response) : Promise<Response> {
        try{
            const { email, password } = req.body;

            if (!email || !password){
                return res.status(400).json({ erro: 'Email e senha são obrigatórios'})
            }

            // Busca usuário no banco local
            const user = await User.findOne({ where: {email: email.trim().toLowerCase()}})
            if (!user || !user.senha_hash){
                return res.status(401).json({ erro: 'Credencias inválidas.'});
            }

            // Valida a senha comparando o texto puro com hash
            const senhaValida = await bcrypt.compare(password, user.senha_hash);
            if (!senhaValida) {
                return res.status(401).json({ erro: 'Credencias inválidas. '})
            }

            // Gera o token JWT com validade de 1 hora
            const token = jwt.sign(
                { id: user.id, email: user.email, nome: user.nome},
                JWT_SECRET,
                { expiresIn: '1h'}
            );

            return res.status(200).json({
                message: 'Login realizado com sucesso!',
                token
            })

        } catch (error: any){
            return res.status(500).json({ erro: error.message })
        }

        
    }
}
