import { Router } from 'express';
import newsControler from './controler.js'

const newsRouter = new Router();

//роути 
newsRouter.get('/', newsControler.get);
newsRouter.post('/', newsControler.post);
newsRouter.delete('/:id', newsControler.delete_id);
newsRouter.patch('/:id', newsControler.patch);

export default newsRouter;