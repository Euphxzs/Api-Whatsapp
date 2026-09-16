import { Router } from 'express';
import { z } from 'zod';

import { AppError } from '../../shared/http/errors.js';
import { getCurrentUserFromToken, loginWithBootstrapAdmin } from './service.js';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});

export const authRouter = Router();

authRouter.post('/login', async (request, response, next) => {
  try {
    const parsed = loginSchema.safeParse(request.body);

    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Request body is invalid', 400, parsed.error.flatten());
    }

    const result = await loginWithBootstrapAdmin(parsed.data.email, parsed.data.password);
    response.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', async (request, response, next) => {
  try {
    const user = await getCurrentUserFromToken(request.header('authorization'));
    response.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});
