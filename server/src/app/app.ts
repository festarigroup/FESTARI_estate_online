import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import limiter from "./middlewares/rateLimiter.js";
import baseRouter from "./routes/baseRoute.js";
import globalErrorHandler, {
  routeNotFound,
} from "./controllers/errorController.js";
import { mountSwagger } from "./config/swagger.js";

const app: Express = express();

app.set("trust proxy", 1);

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cookieParser());

const configuredClientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
const isLocalhostOrigin = (origin: string) => /^https?:\/\/localhost(:\d+)?$/.test(origin);

app.use(
  cors({
    // Any localhost origin is allowed in addition to CLIENT_ORIGIN so the
    // web client and its local dev previews (each on their own port) can
    // all reach this API during local development — this has no effect in
    // production, where requests never carry a localhost Origin.
    origin: (origin, callback) => {
      if (!origin || origin === configuredClientOrigin || isLocalhostOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "500kb" }));

mountSwagger(app);
app.use("/api/v1", baseRouter);
// app.use("/api/v1", limiter, baseRouter);

app.get("/", (req: Request, res: Response) => {
  const hostUrl = `${req.protocol}://${req.get("host") ?? "localhost"}`;
  res.send(
    `
      <h1>Festari Estates Online API</h1>
      <p><a href="${hostUrl}/api-docs">Swagger docs</a></p>
    `
  );
});
app.use(routeNotFound);
app.use(globalErrorHandler);

export default app;
