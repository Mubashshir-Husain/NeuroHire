import User from "../models/user.model.js";
import generateToken  from "../config/token.js";

export const googleAuth = async (req, res) => {
    try {
        const {name , email} = req.body
        let user = await User.findOne({email})
        if(!user){
            user = await User.create({name: name ,
                 email: email
                })
        }
        const token = await generateToken(user._id)
        res.cookie("token", token,{
            http:true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        return res.status(200).json(user)

    } catch (error) {
        console.log("Error in googleAuth controller",error)
        return res.status(500).json({message : `Google Auth Failed ${error.message}`})
    }
}


export const logOut = async (req, res) => {
    try {
       await res.clearCookie("token")
        return res.status(200).json({message : "Logout Success"})
    } catch (error) {
        console.log("Error in logOut controller",error)
        return res.status(500).json({message : `Logout Failed ${error.message}`})
    }
}