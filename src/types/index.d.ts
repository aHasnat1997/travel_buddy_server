import { JwtPayload } from 'jsonwebtoken';
import { TTokenPayload } from '../utils/token';

declare global {
  namespace Express {
    interface Request {
      user: TTokenPayload | JwtPayload | null;
    }
  }
}