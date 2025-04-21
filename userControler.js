import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 
import pool from '../lib/connect.js'; 

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.execute(
      'SELECT id, password FROM amazyy WHERE email = ?', 
      [email]
    );

    
    if (rows.length == 0) {
      return res.status(401).json({ error: 'user not found '});
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password , user.password);


if (!passwordMatch) {
  return res.status(404).json({error:"invalid password"})
}
    const token = jwt.sign(
      { id: user.id, email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "10m" }
    );

    return res.json({ success: true,message:"logged succesfully", token });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const  getAllUsers= async(req, res)=>{
  try {
    const [rows] = await pool.execute(
      'SELECT id, email, name FROM amazyy'
    );
    
    if (rows.length ==0  ) {
      return res.status(404).json({error:"no user found"});
    }
    return res.status(200).json({ 
      success: true, 
      amazyy: rows 
    });

  } catch (error) {
    console.error("Get amazyy error:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const { email } = req.body;
    
    const [rows] = await pool.execute(
      'SELECT id, email, name FROM amazyy WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ 
      success: true, 
      user: {
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email
      }
    });

  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const signupUser = async (req, res) => {
  const { password, email, name, role } = req.body;
  // console.log(email,password,name,role)
  console.log(req.body)


  try {
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [existingUsers] = await pool.execute(
      'SELECT email FROM amazyy WHERE email = ? OR name = ?',
      [email, name]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const [result] = await pool.execute(
      'INSERT INTO amazyy (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    return res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      userId: result.insertId
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};