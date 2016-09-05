import * as express from 'express';

import { ctrl } from '../controllers';

const router = express.Router();

router.get('/', ctrl);

export const index = router;
export * from './account';
