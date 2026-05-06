import jwt from "jsonwebtoken";

const isAuth = async (req,res,next) => {
    try {
        let {token} = req.cookies

        if(!token){
            return res.status(401).json({message : "User dose not have a token"})
        }

        const varifyToken = await jwt.verify(token,process.env.JWT_SECRET)
        if(!varifyToken){
            return res.status(400).json({message : "User dose not have a valid token"})
        }
        req.userId = varifyToken.userId

        next()

    } catch (error) {
        return res.status(500).json({message : `isAuth Failed error ${error.message}`})
    }
}

export default isAuth