import { Request, Response } from "express";
import { userSchemaModel } from "../../../models/users/user.mongoose";

export async function handleLoginMongoDb(
  request: Request<{}, {}, { email: string; password: string }>,
  response: Response,
) {
  const { email, password } = request.body;

  const result = await userSchemaModel.findOne({ email, password });

  response.status(200).json(result);
}
