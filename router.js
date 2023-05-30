const Router = require('express');
const UserController = require('./controllers.js');

const router = new Router();

router.post('/user', UserController.createUser);
router.get('/user/:email/:password', UserController.getAllUsers);
router.put('/user/:email/:password', UserController.changeStatus);
router.delete('/user/:email/:password', UserController.deleteUsers);


module.exports = router;