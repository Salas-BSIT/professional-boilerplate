import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { UnauthorizedError } from '../utils/errors';
import { config } from '../config/env';
import { createLogger } from '../utils/logger'; 

const logger = createLogger('AuthService');
const userRepository = AppDataSource.getRepository(User);

interface LoginInput {
    email: string;
    password: string;
}

interface TokenPayload {
    userId: number;
    email: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string; 
    };
}

export class AuthService {
    static async login(input: LoginInput): Promise<AuthResponse> {
        const { email, password } = input;  

        const user = await userRepository.findOne({
            where: { email },
            select: { id: true, name: true, email: true, password: true, isActive: true },
        });

        if (!user) {
            logger.warn('Loggin attempt with non-existing email', { email });
            throw new UnauthorizedError('Invalid email or password');
        }    

        // 2. Check if the user is active
        if (!user.isActive) {
            logger.warn('Loggin attempt with inactive account', { email });
            throw new UnauthorizedError('Invalid email or password');
        }    

        // 3. Compare passwords with bycrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            logger.warn('Loggin attempt with invalid password', { email });
            throw new UnauthorizedError('Invalid email or password');
        }

        // 4. Generate JWT token
        const tokenPayload: TokenPayload = {
            userId: user.id,
            email: user.email,
        };

        const token = jwt.sign(tokenPayload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
        });

        logger.info('User logged in successfully', { userId: user.id, email: user.email });

        // 5. Return the token and user data
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }


    // Method to verify JWT token

    static async verifyToken(token: string): Promise<TokenPayload> {
        try {
            const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
            return decoded;
        } catch (error: unknown) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError('Token has expired');
            }
            
            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError('Invalid token');
            }

            throw new UnauthorizedError('Authentication failed');
        }
    }    

    // Get user from token (useful for getting full user data)
    static async getUserFromToken(token: string): Promise<User> {
        const decoded = await this.verifyToken(token);

        const user = await userRepository.findOne({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                createdAt: true,
                },
        }); 

        if (!user) {        
            throw new UnauthorizedError('User not found');
        }

        if (!user.isActive) {
            throw new UnauthorizedError('User account is deactivated');
        }   

        return user;
    }    
}       