import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verify_token';
import { isAdmin, isModeratorOrAdmin } from '../middlewares/verify_roles';

const router = express.Router();

router.get('/', controllers.getBooks);

// router.use(verifyToken);
// router.use(isModeratorOrAdmin);
router.get('/',[verifyToken], controllers.getCurrent);

export default router;