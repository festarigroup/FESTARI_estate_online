import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import type { Express } from "express";

const PORT = Number(process.env.PORT ?? 1234);

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Festari Estates Online API",
    version: "1.0.0",
    description: `
      Backend API for Festari Estates Online — property listings, hotels, artisan services,
      subscriptions, Paystack payments, a social feed, and notifications.
    `
  },
  servers: [
    {
      url: process.env.API_BASE_URL ?? `http://localhost:${PORT}/api/v1`,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/app/docs/*.ts", "./dist/app/docs/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export function mountSwagger(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
