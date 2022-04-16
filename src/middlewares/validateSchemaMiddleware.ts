import { NextFunction, Request, Response } from "express";
import { stripHtml } from "string-strip-html";
import cardSchema from "../schemas/cardSchema.js";
import cardActivationSchema from "../schemas/cardActivationSchema.js";
import paymentSchema from "../schemas/paymentSchema.js";
import rechargeSchema from "../schemas/rechargeSchema.js";

function sanitizeString(string: string) {
  return (stripHtml(string).result).trim();
}

const schemas = {
  "/card": cardSchema,
  "/card/activation": cardActivationSchema,
  "/recharge": rechargeSchema,
  "/payment": paymentSchema
}

export default async function validateSchemaMiddleware(req: Request, res: Response, next: NextFunction) {
  const { body } = req;

  let schema;
  if(req.path.includes("activation")){
    schema = schemas['/card/activation'];
  }else{
    schema = schemas["/" + req.path.split("/")[1]];
  }

  Object.keys(body).forEach(key => {
    if (typeof (body[key]) === "string") body[key] = sanitizeString(body[key])
  });

  const validation = schema.validate(body, { abortEarly: false });
  if (validation.error) return res.status(422).send(validation.error.message);

  next();
}