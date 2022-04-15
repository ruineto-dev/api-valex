import { Request, Response } from 'express';
import * as employeeService from '../services/employeeService.js';
import * as cardService from '../services/cardService.js';

export async function createCard(req: Request, res: Response) {
	const { employeeId, type } = req.body;
	const employeeIdParams = parseInt(req.params.employeeId);

	const employee = await employeeService.employeeValidation(employeeId, employeeIdParams);
	const cardholderName = employeeService.generateEmployeeCardName(employee.fullName);
	const expirationDate = cardService.generateExpirationDate();
	const number = cardService.generateCardNumber();
	const securityCode = cardService.generateCardCVV();

	const newCard = {
		employeeId,
		number,
		cardholderName,
		securityCode,
		expirationDate,
		password: null,
		isVirtual: false,
		originalCardId: null,
		isBlocked: true,
		type
	};

	await cardService.searchCardByTypeAndEmployeeId(type, employeeId);
	await cardService.insertNewCard(newCard);

	res.sendStatus(201);
}

export async function activationCard(req: Request, res: Response) {
	const cardData = req.body;

	const searchedCard = await cardService.findCardById(cardData);
	cardService.expirationDateValid(searchedCard.expirationDate);
	cardService.isActivatedCard(searchedCard.password);
	cardService.isValidCVV(cardData.cvv, searchedCard.securityCode);
	const passwordHashed = cardService.cardPasswordHashed(cardData.password);

	const activatedCard = {
		...searchedCard,
		password: passwordHashed
	};

	await cardService.activeCard(cardData.cardId, activatedCard);

	res.sendStatus(200);
}