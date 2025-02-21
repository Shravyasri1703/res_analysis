import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const validateCredentials = {
  username: "naval.ravikant",
  password: "05111974"
}

const SECRET = process.env.JWT_SECRET

export const login = (req, res) => {

    try{
        const { username, password } = req.body

        if(!username || !password){
            return res.status(400).json({
                error: "Username and password are required"
            })
        }

        if (username === validateCredentials.username && password === validateCredentials.password){

            const token = jwt.sign(
                { username },
                SECRET,
                { expiresIn: '24h' }
            )

            return res.status(200).json({ JWT: token})
        }else{
            return res.status(401).json({ error: "Invalid credentials" });
        }

    }catch(err){
        console.error("Authentication error:", err);
        return res.status(500).json({ error: "Authentication failed" });
    }
}