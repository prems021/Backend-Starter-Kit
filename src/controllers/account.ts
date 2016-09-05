import { authenticate } from 'passport';

import { Account } from '../models';

export const getRegister = (req: any, res: any) => {
  res.render('register', { });
};

export const postRegister = (req: any, res: any, next: any) => {
  Account.register(new Account({ username : req.body.username }), req.body.password, (err: any, account: any) => {
    if (err) {
      return res.render('register', { error : err.message });
    }

    authenticate('local')(req, res, () => {
      req.session.save((err: any) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
};

export const getLogin = (req: any, res: any) => {
  res.render('login', { user: req.user, error: req.flash('error') });
};

export const postLogin = (req: any, res: any, next: any) => {
  req.session.save((err: any) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

export const getLogout = (req: any, res: any, next: any) => {
  req.logout();
  req.session.save((err: any) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
