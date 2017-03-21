import express from 'express';
import path from 'path';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res, next) => {
  res.sendFile (path.resolve (__dirname+ '/../views/file.html'));
});

export default router;
