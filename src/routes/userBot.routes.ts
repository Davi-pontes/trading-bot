import {Router} from 'express'
import {UserBotConfigController} from '../controller/userBotController'

const router = Router()

const controller = new UserBotConfigController();

router.post('/', controller.create.bind(controller));
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));


export {router as UserRouter};