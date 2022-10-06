const userService = require("../services/user");

const createUser = async (req, res) => {
  if (!req.body.data){
    res.status(400).json({message: '누락된 정보가 있습니다.'})
    return;
  }
  const { name, birth, height, phone } = req.body.data
  
  try {
    if (!name || !birth || !height || !phone) {
      res.status(400).json({message: '누락된 정보가 있습니다.'})
      return;
    }
    await userService.checkUserInput(name, birth, height, phone)
    await userService.createUser(name, birth, height, phone)
    res.status(200).json({message: '회원 등록 성공'})

  } 
  catch (err) {
    console.log(err)
    res.status(err.statusCode || 500).json({message: err.message})
  }
};

const getUsers = async (req,res) => {
  try{
    const users = await userService.getUsers()
    res.status(200).json({message: '모든 회원 정보 가져오기 성공!', result: users})
  } 
  catch (err) {
    console.log(err)
    res.status(err.statusCode || 500).json({message: err.message})
  }
};

const getAUserByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id
    const user = await userService.getAUserByUserId(userId)
    res.status(200).json({message: '회원 정보 가져오기 성공!', result: user})
  } 
  catch (err) {
    console.log(err)
    res.status(err.statusCode || 500).json({message: err.message})
  }
};

const updateUser = async (req, res) => {
  if (!req.body.data){
    res.status(400).json({message: '누락된 정보가 있습니다.'})
    return;
  }
  const { name, birth, height, phone } = req.body.data
  const userId = req.body.data.user_id
  
  try{
    if (!(userId && name && birth && height && phone )) {
      res.status(400).json({message: '누락된 정보가 있습니다.'})
      return;
    }
    await userService.checkUserInput(name, birth, height, phone)
    await userService.getAUserByUserId(userId)
    await userService.updateUser(userId, name, birth, height, phone)
    res.status(200).json({message: '회원 정보 수정 성공!'})
  }
  catch (err) {
    console.log(err)
    res.status(err.statusCode || 500).json({message: err.message})
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.user_id
  try {
    await userService.getAUserByUserId(userId)
    await userService.deleteUser(userId)
    res.status(204).json()
  }
  catch (err) {
    console.log(err)
    res.status(err.statusCode || 500).json({message: err.message})
  }
};

module.exports = {
  createUser, getUsers, getAUserByUserId, updateUser, deleteUser
};
