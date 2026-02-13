import { AuthService } from './auth.service';
import { Response } from 'express';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(user: User, res: Response): Promise<void>;
    logout(user: User, res: Response): Promise<void>;
    refresh(user: User, res: Response): Promise<void>;
}
