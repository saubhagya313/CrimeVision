import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'crimevision_secret_jwt_key_super_secure_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc    Register a new investigator/analyst
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department, organization, badgeNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An investigator account with this email already exists.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Investigator',
      department: department || 'Cyber Forensics Unit',
      organization: organization || 'State Police Cyber Cell',
      badgeNumber: badgeNumber || `CYB-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    const token = generateToken(user._id);

    // Create audit log
    await AuditLog.create({
      action: 'USER_REGISTER',
      performedBy: user._id,
      userName: user.name,
      userRole: user.role,
      ipAddress: req.ip || '127.0.0.1',
      details: `New investigator registered: ${user.name} (${user.email}) - Badge: ${user.badgeNumber}`,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        badgeNumber: user.badgeNumber,
        department: user.department,
        organization: user.organization,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login investigator & return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password.',
      });
    }

    // Find user by email and select password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No user found with this email.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    // Create audit log
    await AuditLog.create({
      action: 'USER_LOGIN',
      performedBy: user._id,
      userName: user.name,
      userRole: user.role,
      ipAddress: req.ip || '127.0.0.1',
      details: `Investigator logged in: ${user.name} (${user.email})`,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        badgeNumber: user.badgeNumber,
        department: user.department,
        organization: user.organization,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

/**
 * @desc    Update investigator profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    const { name, phone, department, organization, avatar } = req.body;

    if (name) fieldsToUpdate.name = name;
    if (phone) fieldsToUpdate.phone = phone;
    if (department) fieldsToUpdate.department = department;
    if (organization) fieldsToUpdate.organization = organization;
    if (avatar) fieldsToUpdate.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Request password reset link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // Simulated password reset response
  res.status(200).json({
    success: true,
    message: `Password reset verification link has been dispatched to ${email || 'your registered email'}.`,
  });
};
