// // const 
// const User = require("../models/User");

// exports.registerController = async (req,res) =>{
//     try {
//         const {email,password} = req.body;
//         //validation
       
//         // if(!email){
//         //     return res.status(400).json({
//         //         success: false,
//         //         message:"Please provide email"
//         //     });
//         // }
//         // if(!password){
//         //     return res.status(400).json({
//         //         success: false,
//         //         message:"Please provide password"
//         //     });
//         // }
        
//         //check if user already exists
//         const existingUser = await User.findOne({email: email});
//         if(existingUser) {
//             return res.status(409).json({
//                 success: false,
//                 message:"Please login,user is already registered!"
//             });
//         }

//         //register
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password,saltRounds);
        
//         const newUser = await new User({
//             email: email,
//             password : hashedPassword ,
//         }).save();
        
//         return res.status(201).json({
//             success: true,
//             message:"User registered successfully!",
//             newUser,
//         });

//     }catch(err) {
//         console.log(err);
//         res.status(500).json({
//             success: false,
//             message:'Error in registration',
//          err,
//         });

//     }
// };
// //POST LOGIN
// exports.loginController = async(req, res) => {
//     try{
//         const {email, password} = req.body;

//         //validation
//         if(!email) {
//             return res.status(400).json({
//                 success: false,
//                 message:"Please provide valid email!"
//             })
//         }
//         if(!password) {
//             return res.status(400).json({
//                 success: false,
//                 message:"Please provide correct password!"
//             })
//         }
//         // check if user exists
//         const user = await User.findOne({email});
//         if (!user){
//             return res.status(400).json({
//                 success: false,
//                 message :'Email is not registered'
//             })
//         }
//         //check if password is correct
//         const match = await bcrypt.compare(password, user.password);
//         if(!match) {
//             return res.status(400).json({
//                 success:false,
//                 message:'Incorrect Password!!'
//                 })
//             }
//         const payload = {
//             _id: user._id,
//         };

//         let token = jwt.sign(payload, process.env.JWT_SECRET, {
//             expiresIn: '6h'
//         });
//         res.status(200).send({
//             success: true,
//             message:'Login successful!',
//             user:{
//                 _id: user._id,   
//                 email:user.email,
//                 password:password,
//             },
//             token
//         })
//     }catch(err) {
//         console.log(err);
//         res.status(500).json({
//             success: false,
//             message:'Error in login',
//             err
//         })
//     }
// };