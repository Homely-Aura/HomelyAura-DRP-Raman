import User from '../models/User.js';
import Employee from '../models/Employee.js';

/**
 * @desc    Get the logged-in employee's profile
 * @route   GET /api/employee/profile
 * @access  Employee
 */
export const getProfile = async (req, res, next) => {
  try {
    // Find the user document
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the employee profile
    let profile = await Employee.findOne({ user: user._id });
    if (!profile) {
      // No profile yet—return basic user info
      return res.json({
        user: { id: user._id, name: user.name, email: user.email },
        profile: null
      });
    }

    // Convert to plain object & merge user info
    profile = profile.toObject();
    profile.email = user.email;
    profile.name = user.name;

    // Build full URL for the uploaded photo
    profile.photo = profile.photo
      ? `${req.protocol}://${req.get('host')}/uploads/${profile.photo}`
      : null;

    res.json({ user: { id: user._id }, profile });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create or update the employee's profile (one-time)
 * @route   POST /api/employee/profile
 * @access  Employee
 */
export const upsertProfile = async (req, res, next) => {
  try {
    const { designation, age, gender, dateOfJoining } = req.body;
    const file = req.file; // multer puts the uploaded file here

    // Validate required fields
    if (!designation || !age || !gender || !dateOfJoining) {
      return res.status(400).json({ message: 'All fields except photo are required' });
    }

    // Build profile data
    const profileData = {
      user: req.user.id,
      designation,
      age,
      gender,
      dateOfJoining: new Date(dateOfJoining)
    };
    if (file) {
      profileData.photo = file.filename;
    }

    // Upsert the employee document
    const profile = await Employee.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileData },
      { new: true, upsert: true, runValidators: true }
    );

    // Prepare response object
    const profileObj = profile.toObject();
    profileObj.photo = profile.photo
      ? `${req.protocol}://${req.get('host')}/uploads/${profile.photo}`
      : null;

    res.json(profileObj);
  } catch (err) {
    next(err);
  }
};
