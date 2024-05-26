import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { AllRoutes } from './routes';
import { globalErrorHandler } from './error/globalErrorHandler';
import { HTTPStatusCode } from './utils/httpCode';
import config from './config';

export class Rocket {
  private app: Express;

  constructor() {
    this.app = express();
  }

  // express parsers
  load() {
    this.app.use(express.json());
    this.app.use(cors({ origin: config.CLINT_URL, credentials: true }));
    this.app.use(cookieParser());
  }

  initiate() {
    /**
    * all api routes
    */
    this.app.use('/api', AllRoutes);

    /**
     * Home route
     */
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).send(`
        <body style="background-color:black;">
          <h1 style="color:white;">🛩️ Travel Buddy</h1>
        </body>
      `)
    })

    // global error handler
    this.app.use(globalErrorHandler)

    /**
     * Not found route
     */
    this.app.use((req: Request, res: Response) => {
      res.status(HTTPStatusCode.NotFound).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
          path: req.originalUrl,
          message: "Your requested path is not found!"
        }
      })
    })
  }

  launch(port: any) {
    this.app.listen(port, () => console.info('Server 🔥 on port:', port))
  }
};