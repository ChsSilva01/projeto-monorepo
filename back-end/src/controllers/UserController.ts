import { Request, Response} from 'express';
import { User } from '../models/User';

export class UserController {
    // GET /api/users - lista todos os usuários
    public static async index(req: Request, res: Response) : Promise<Response>{
        try {
            const users = await User.findAll({
                attributes: ['id', 'nome', 'email', 'createdAt', 'updatedAt']
            });
            return res.status(200).json(users);
        } catch (error: any){
            return res.status(500).json({erro: 'Erro ao listar usuários', detalhe: error.message});
        }
    }

    // GET /api/users/id - busca um usuário por ID
    public static async show(req: Request, res: Response) : Promise<Response>{
        try {
            const id = parseInt(req.params.id as string, 10);
            if(isNaN(id) || id <= 0){
                return res.status(400).json({ erro: 'O ID informado deve ser um número válido.'})
            }

            const users = await User.findByPk(Number(id), {
                attributes: ['id', 'nome', 'email', 'createdAt', 'updatedAt']
            });

            if (!users){
                return res.status(404).json({erro: 'Usuário não encontrado.'});
            }
            return res.status(200).json(users);
        } catch (error: any){
            return res.status(500).json({erro: 'Erro ao listar usuários', detalhe: error.message});
        }
    }

     // POST /api/users - cria um novo usuario
    public static async create(req: Request, res: Response) : Promise<Response>{
        try {
            const { nome, email, senha_hash } = req.body;
            
            if (!nome || typeof nome !== 'string' || nome.trim() === ''){
                return res.status(400).json({erro: 'Os campos nome é obrigatório.'});
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || emailRegex.test(email.trim())){
                return res.status(400).json({erro: 'Informe um e-mail válido'})
            }

            if (!senha_hash || typeof senha_hash !== 'string' || senha_hash.length < 6){
                return res.status(400).json({erro: 'A senha deve conter o minimo 6 caracteres.'});
            }

            const userExistente = await User.findOne({ where: { email: email.trim() }});
            if(userExistente) {
                return res.status(400).json({ erro: 'Já existe um usuário cadastrado com este e-mail'})
            }

            const novoUser = await User.create({
                nome: nome.trim(), 
                email: email.trim().toLowerCase(), 
                senha_hash
            })
                

            return res.status(201).json({
                id: novoUser.id,
                nome: novoUser.nome,
                email: novoUser.email,
                createdAt: novoUser.createdAt
            });
        } catch (error: any){
            return res.status(500).json({erro: 'Erro ao listar usuários', detalhe: error.message});
        }
    }

     // PUT /api/users/:id - atualiza um usuario
    public static async update(req: Request, res: Response) : Promise<Response>{
        try {
            const id = parseInt(req.params.id as string, 10);
            if(isNaN(id) || id <= 0){
                return res.status(400).json({ erro: 'O ID informado deve ser um número válido.'})
            }

            const { nome, email } = req.body;
            
            const users = await User.findByPk(Number(id))

            if (!users){
                return res.status(404).json({erro: 'Não encontrado'});
            }
                
            if (nome) users.nome = nome;
            if (email) users.email = email;
            
            if (!users){
                return res.status(404).json({ erro: "Usuário não encontrado."})
            }

            if (nome !== undefined) {
                if(typeof nome !== 'string' || nome.trim() == ''){
                    return res.status(404).json({ erro: 'O campo deve ser um texto válido.'})
                }

                users.nome = nome.trim()
            }

            if (email != undefined) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email || emailRegex.test(email.trim())){
                    return res.status(400).json({erro: 'Informe um e-mail válido'})
                }

                const emailEmUso = await User.findOne({ where: {email: email.trim().toLowerCase()}});
                if (emailEmUso && emailEmUso.id !== id){
                    return res.status(400).json({ erro: 'Este e-mail já está em uso' })
                }

                users.email = email.trim().toLowerCase();
            }

            await users.save();

            return res.status(200).json({
                id: users.id,
                nome: users.nome,
                email: users.email,
                createdAt: users.createdAt
            });
        } catch (error: any){
            return res.status(500).json({erro: 'Erro ao atualizar usuário', detalhe: error.message});
        }
    }

     // DELETE /api/users/:id - busca um usuário por ID
    public static async delete(req: Request, res:Response): Promise<Response>{
        try {
            const id = parseInt(req.params.id as string, 10);
            if(isNaN(id) || id <= 0){
                return res.status(400).json({ erro: 'O ID informado deve ser um número válido.'})
            }
            
            const users = await User.findByPk(Number(id))
            
            if (!users) {
                return res.status(404).json({erro: 'Usuário não encontrado'})
            }

            await users.destroy()


            return res.status(204).send();
        } catch (error: any){
            return res.status(500).json({erro: 'Erro ao listar usuários', detalhe: error.message});
        }
    }
}

