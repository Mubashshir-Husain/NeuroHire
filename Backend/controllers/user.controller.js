import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message : "User not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log("Error in getCurrentUser controller",error)
        return res.status(500).json({message : `Get Current User Failed ${error.message}`})
    }
}