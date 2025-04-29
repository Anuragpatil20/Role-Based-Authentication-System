const express = require ('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require ('bcrypt')
const jwt = require ('jsonwebtoken')
const cookieParser = require ('cookie-parser')
const UserModel = require('./models/User')



const app = express()
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials:  true
}))
app.use(cookieParser())

mongoose.connect('mongodb://127.0.0.1:27017/LoginRole')

app.get('/getUser/:id', (req, res) =>{
    const id = req.params.id;
    UserModel.findById({_id:id})
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.put('/updateUser/:id', (req, res) =>{
    const id = req.params.id;
    UserModel.findByIdAndUpdate({_id: id}, 
    {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role 

    })
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.delete("/deleteUser/:id", (req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndDelete({ _id: id })          
        .then(deletedUser => res.json(deletedUser))
        .catch(err => res.status(500).json(err));
});


app.get('/edite',(req, res) =>{
    UserModel.find({})
    .then(users => res.json(users))
    .catch(err => res.json(err))
})


app.get('/',(req, res) =>{
    UserModel.find({})
    .then(users => res.json(users))
    .catch(err => res.json(err))
})


const varifyUser = (req , res, next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.json("Token is missing")
    }else{
        jwt.verify(token, "jwt-secret-key", (err , decoded) => {
            if(err) {
                return res.json("Error with token")
            }else{
                if(decoded.role === "admin"){
                    next()
                } else {
                    return res.json("not admin")
                }
            }
        })
    }
}

app.get('/dashboard',varifyUser ,(req , res) =>{
    res.json("Success")
} )

app.post('/register', (req , res) =>{
   const {name , email , password} = req.body;
   bcrypt.hash(password, 10)
   .then(hash => {
    UserModel.create({name, email, password: hash})
    .then(user => res.json("Success"))
    .catch(err => res.json(err))
   }).catch(err => res.json(err))
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.json("No record existed");
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.json("The password is incorrect");
      }
  
      const token = jwt.sign(
        { email: user.email, role: user.role },
        "jwt-secret-key",
        { expiresIn: '1d' }
      );
  
      res.cookie('token', token, { httpOnly: true });
      return res.json({Status: "Success", role: user.role});
  
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server error");
    }
  });
  


app.listen(3001, () =>{
    console.log("Server is Running")
})