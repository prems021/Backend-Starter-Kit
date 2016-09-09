import * as express from 'express';

// import { ctrl } from '../controllers';

const router = express.Router();

// router.get('/', ctrl);

import { User } from '../models';
const multer  = require('multer');
const upload = multer({ dest: 'public/uploads/' });

router.get( '/', (req: any, res: any) => {
  User.find({ }, (err: any, users: any) => {
    if( err ) throw err;
    res.render( 'index', { users : users, page_title : 'User', title : 'User' } );
  });
});

router.get('/create', (req: any, res: any) => {
  res.render( 'create', { page_title : 'Create', title : 'Create New User'} );
});

router.post('/insert', upload.single('image'), (req: any, res: any) => {
  let user = new User({
    name: req.body.name,
    user_name: req.body.user_name,
    password: req.body.password,
    image: (req.file) ? `/uploads/${req.file.filename}` : '',
    created_at: new Date()
  });

  user.save((err: any) => {
    if (err) throw err;
    res.redirect('/');
  });
});

router.get('/:id/edit', (req: any, res: any) => {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    User.findById(req.params.id, (err: any, user: any) => {
      if (err) throw err;
      res.render('edit', { user: user, page_title: 'Edit', title: 'Edit User' });
    });
  }
});

router.put('/:id', upload.single('image'), (req: any, res: any) => {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    User.findById(req.params.id, (err: any, user: any) => {
      if (err) throw err;
      user.name = req.body.name;
      user.user_name = req.body.user_name;
      user.image = (req.file) ? `/uploads/${req.file.filename}` : req.body.current_image;
      user.updated_at = new Date();
      user.save((err: any) => {
        if (err) throw err;
        res.redirect('/');
      });
    });
  }
});

router.get('/:id', (req: any, res: any) => {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    User.findByIdAndRemove(req.params.id, (err: any) => {
      if (err) throw err;
      res.redirect('/');
    });
  }
});

export const route = router;
