import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";
import CustomError from "#app/utils/CustomError.js";

type SplitSchema = { body?: ObjectSchema; params?: ObjectSchema; query?: ObjectSchema };

function isSplitSchema(schema: ObjectSchema | SplitSchema): schema is SplitSchema {
  return !("validate" in schema);
}

export function validateSchema(schema: ObjectSchema | SplitSchema) {
  const { body, params, query } = isSplitSchema(schema)
    ? schema
    : { body: schema, params: undefined, query: undefined };

  return (req: Request, _res: Response, next: NextFunction) => {
    const errors: string[] = [];

    if (params) {
      const { error } = params.validate(req.params, { abortEarly: false });
      if (error) errors.push(...error.details.map((d) => d.message));
    }

    if (query) {
      const { error } = query.validate(req.query, { abortEarly: false });
      if (error) errors.push(...error.details.map((d) => d.message));
    }

    if (body) {
      const { error } = body.validate(req.body, { abortEarly: false });
      if (error) errors.push(...error.details.map((d) => d.message));
    }

    if (errors.length) {
      throw new CustomError(errors.join(", "), 400);
    }

    next();
  };
}