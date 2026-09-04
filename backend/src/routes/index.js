import { Router } from 'express';
import trainRoutes from './trainRoutes.js';
import stationRoutes from './stationRoutes.js';
import routeRoutes from './routeRoutes.js';
import issueRoutes from './issueRoutes.js';

const apiRouter = Router();

// Infrastructure routes supporting issue context
apiRouter.use('/trains', trainRoutes);
apiRouter.use('/stations', stationRoutes);
apiRouter.use('/routes', routeRoutes);

// Component 3: Transport Issue Reporting
apiRouter.use('/issues', issueRoutes);

export default apiRouter;
