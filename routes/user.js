const express = require("express");
const userController = require("../controllers/user");

const router = express.Router();

router.post('', userController.createUser);
router.get('', userController.getUsers);
router.get('/:user_id', userController.getAUserByUserId);
router.post('/update', userController.updateUser);
router.delete('/delete/:user_id', userController.deleteUser);

module.exports = router;
