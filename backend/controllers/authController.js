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
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      city,
      state,
      pincode,
      department,
      organization,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists. Please login or use a different email.',
      });
    }

    // Designate Admin if email is the configured admin email (ajitkumarsethi34@gmail.com or admin@crimevision.in)
    const isAdminEmail =
      normalizedEmail === 'ajitkumarsethi34@gmail.com' ||
      normalizedEmail === 'admin@crimevision.in';

    const assignedRole = isAdminEmail ? 'Admin' : role || 'User';

    // Create user with address coordinates for official complaint/resolution delivery
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      role: assignedRole,
      department: department || (isAdminEmail ? 'Platform Administration & Cyber Cell' : 'General User'),
      organization: organization || (isAdminEmail ? 'CrimeVision System Management' : 'Citizen'),
    });

    const token = generateToken(user._id);

    // Create audit log
    await AuditLog.create({
      action: 'USER_REGISTER',
      performedBy: user._id,
      userName: user.name,
      userRole: user.role,
      ipAddress: req.ip || '127.0.0.1',
      details: `New ${user.role} registered: ${user.name} (${user.email}). Address: ${user.city || 'N/A'}`,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
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

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email and select password
    let user = await User.findOne({ email: normalizedEmail }).select('+password');

    // Auto-provision primary Admin account if missing from database
    if (
      !user &&
      (normalizedEmail === 'ajitkumarsethi34@gmail.com' || normalizedEmail === 'admin@crimevision.in') &&
      password === 'password123'
    ) {
      await User.create({
        name: normalizedEmail === 'ajitkumarsethi34@gmail.com' ? 'Ajit Kumar Sethi (System Admin)' : 'CrimeVision System Admin',
        email: normalizedEmail,
        password: 'password123',
        role: 'Admin',
        department: 'Platform Administration & Cyber Cell',
        organization: 'CrimeVision System Management',
        phone: '+91 98765 43210',
        address: 'Plot 42, Cyber Security Complex, Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        isActive: true,
      });
      user = await User.findOne({ email: normalizedEmail }).select('+password');
    }

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

    // Auto-elevate configured admin email if not already Admin
    if (
      (normalizedEmail === 'ajitkumarsethi34@gmail.com' || normalizedEmail === 'admin@crimevision.in') &&
      user.role !== 'Admin'
    ) {
      user.role = 'Admin';
      await user.save();
    }

    const token = generateToken(user._id);

    // Create audit log
    await AuditLog.create({
      action: 'USER_LOGIN',
      performedBy: user._id,
      userName: user.name,
      userRole: user.role,
      ipAddress: req.ip || '127.0.0.1',
      details: `User logged in: ${user.name} (${user.email})`,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
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
 * @desc    Update investigator/citizen profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    const { name, phone, address, city, state, pincode, department, organization, avatar } = req.body;

    if (name) fieldsToUpdate.name = name;
    if (phone) fieldsToUpdate.phone = phone;
    if (address !== undefined) fieldsToUpdate.address = address;
    if (city !== undefined) fieldsToUpdate.city = city;
    if (state !== undefined) fieldsToUpdate.state = state;
    if (pincode !== undefined) fieldsToUpdate.pincode = pincode;
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
