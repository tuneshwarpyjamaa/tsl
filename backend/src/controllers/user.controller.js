import { User } from '../models/User.js';

export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Remove sensitive information like password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
}

export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const allowed = ['Member', 'Contributor', 'Editor', 'Admin'];
    if (!allowed.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await User.updateRole(id, role);
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    // Prevent self-deletion to avoid locking out the only admin
    if (String(req.user?.id) === String(id)) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }
    await User.delete(id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
}