import * as express from 'express';
import { authenticate } from 'passport';

import { getRegister, postRegister, getLogin, postLogin, getLogout } from './controllers';

const router = express.Router();

router.get('/', (req: any, res: any) => {
  res.render('index', { user : req.user });
});

router.get('/register', getRegister);
router.post('/register', postRegister);
router.get('/login', getLogin);
router.post('/login', authenticate('local', { failureRedirect: '/login', failureFlash: true }), postLogin);
router.get('/logout', getLogout);

export = router;
