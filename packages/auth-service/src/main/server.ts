import { MongoHelper } from "../infra/db/mongodb/helpers/mongo-helper"
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const { default: app } = await import("./config/app");
    app.listen(env.port, () => { console.log(`server running at http://localhost:${env.port}`); }) 
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  });