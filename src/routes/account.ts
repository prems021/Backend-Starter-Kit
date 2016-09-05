import * as express from 'express';
import { authenticate } from 'passport';

import { getRegister, postRegister, getLogin, postLogin, getLogout } from '../controllers';

const accountRouter = express.Router();

accountRouter.route('/register')
  .get(getRegister)
  .post(postRegister);

accountRouter.route('/login')
  .get(getLogin)
  .post(authenticate('local', { failureRedirect: '/login', failureFlash: true }), postLogin);

accountRouter.get('/logout', getLogout);

export const account = accountRouter;
