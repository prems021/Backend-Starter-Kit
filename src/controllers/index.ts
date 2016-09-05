export * from './account';

export const ctrl = (req: any, res: any) => {
  res.render('index', { user : req.user });
};
