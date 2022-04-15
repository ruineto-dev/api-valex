import { Router } from 'express';
import * as cardController from '../controllers/cardController.js';
import { validateApiKeyMiddleware } from '../middlewares/validateApiKeyMiddleware.js';
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js';

const cardRouter = Router();

cardRouter.post('/card/:employeeId', validateApiKeyMiddleware, validateSchemaMiddleware, cardController.createCard);

export default cardRouter;
