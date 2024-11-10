import { type Express, Router } from 'express';
import { readdirSync } from 'fs';
import { join } from 'path';

interface RouteModule {
  default: (router: Router) => void;
}

export default async (app: Express): Promise<void> => {
  const router = Router();
  app.use('/api', router);

  const routeFiles = readdirSync(join(__dirname, '../routes')).filter(
    (file) => !file.endsWith('.map') && !file.endsWith('.test.ts') && !file.endsWith('.spec.ts')
  );

  await Promise.all(
    routeFiles.map(async (file) => {
      const route = (await import(`../routes/${file}`)) as RouteModule;
      route.default(router);
    })
  );
};
