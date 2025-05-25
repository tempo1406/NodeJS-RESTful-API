import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verify_token';
import { isAdmin, isCreatorOrAdmin } from '../middlewares/verify_roles';
import uploadCloud from '../middlewares/uploader';

const router = express.Router();

router.get('/', controllers.getBooks);

router.use(verifyToken);
router.use(isCreatorOrAdmin);
router.post('/', uploadCloud.single('image'), controllers.createNewBook);
router.put('/', uploadCloud.single('image'), controllers.updateBook);
router.delete('/', controllers.deleteBook);


export default router;