import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

export async function login(req, res) {
  try {
    console.log('Login attempt:', { email: req.body.email });
    const { email, password } = req.body;
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findByEmail(email);
    console.log('User found:', !!user);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await User.comparePassword(password, user.password);
    console.log('Password match:', ok);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // Convert role to lowercase for consistent permission checks
    const userRole = user.role ? user.role.toLowerCase() : 'member';
    
    const token = jwt.sign({ 
      id: user.id, 
      email: user.email, 
      role: userRole 
    }, process.env.SECRET_KEY, {
      expiresIn: '7d'
    });

    console.log('Login successful for user:', user.email, 'with role:', userRole);
    return res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: userRole 
      } 
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Login failed' });
  }
}

export async function register(req, res) {
  try {
    console.log('Register attempt:', { email: req.body.email });
    const { email, password } = req.body;
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findByEmail(email).catch(() => null);
    console.log('Existing user check:', !!existingUser);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Set role in lowercase for consistency
    const role = email === 'admin@example.com' ? 'admin' : 'member';
    const user = await User.create({ email, password, role });
    console.log('User created:', user.email);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SECRET_KEY, {
      expiresIn: '7d'
    });

    console.log('Registration successful for user:', user.email);
    return res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) {
    console.error('Registration error:', e);
    res.status(500).json({ error: 'Registration failed' });
  }
}
