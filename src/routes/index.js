import user from './user';
import auth from './auth';
import insert from './insert';
import book from './book';
import { notFound } from '../middlewares/handle_error';

const innitRoutes = (app) => {
    app.use('/api/v1/user', user);
    app.use('/api/v1/auth', auth);
    app.use('/api/v1/insert', insert);
    app.use('/api/v1/book', book);

    app.use(notFound)
}

export default innitRoutes;