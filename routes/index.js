import express from 'express';
import path from 'path';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res, next) => {
  res.sendFile (path.resolve (__dirname+ '/../views/file.html'));
});

router.get ('/dashboard', (req, res) => {

  if (req.isAuthenticated()) {
    res.sendFile (path.resolve (__dirname+ '/../views/dashboard.html'));
  } else {
    console.log ('session error');
    res.sendFile (path.resolve (__dirname+ '/../views/sessionerror.html'));
  }
})

export default router;
