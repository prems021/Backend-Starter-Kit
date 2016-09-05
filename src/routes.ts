import * as express from 'express';
import { authenticate } from 'passport';

import { getRegister, postRegister, getLogin, postLogin, getLogout } from './controllers';

const router = express.Router();

router.get('/', (req: any, res: any) => {
  res.render('index', { user : req.user });
});

router.route('/register')
  .get(getRegister)
  .post(postRegister);

router.route('/login')
  .get(getLogin)
  .post(authenticate('local', { failureRedirect: '/login', failureFlash: true }), postLogin);

router.get('/logout', getLogout);

export = router;
