import User from "../models/user.model.js";
import { generateToken } from "../utils/generateTokens.js";
import { sendVerifyEmail } from "../utils/sendVerificationEmail.js";
import { sendWelcomeEmail } from "../utils/sendWelcomeEmail.js";
import jwt from "jsonwebtoken"

export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    const gmailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9]){4,}@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Gmail address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    const createdUser = await User.create({ username, email, password });

    const authToken = jwt.sign(
      { id: createdUser._id },
      process.env.AUTH_JWT_SECRET,
      { expiresIn: process.env.AUTH_JWT_EXPIRES_IN }
    );

    createdUser.authToken = authToken;
    await createdUser.save();

    await sendWelcomeEmail(email,createdUser.username)
    await sendVerifyEmail(authToken, email, username);

    return res.status(201).json({
      success: true,
      message: "User registered. Please verify your email.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
}


export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const loggedUser = await User.findOne({ email }).select("+password");

    if (!loggedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await loggedUser.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!loggedUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const { accessToken, refreshToken } = generateToken(loggedUser._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({
        success: true,
        message: "Login successful",
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token missing",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.AUTH_JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Email already verified",
      });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}

export async function logoutUser(req,res) {
  try {

    res.clearCookie("accesstoken", {httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Logout Failed",
      error: err.message
    })
  }
}

export async function updateUser(req,res) {
  try {
    const { username, email } = req.body;
    if (!username && !email) {
      return res.status(400).json({
        success: false,
        message: "Required Field Are not Provide"
      })
    }
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not find in DataBase"
      })
    }
    if (username) {
      
      user.username = username
      await user.save()
      return res.status(200).json({
        success: true,
        message: "Update Successful"
      })
    }
    if (email) {
      user.email = email
      await user.save()
      return res.status(200).json({
        success: true,
        message: "Update Successful"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update User",
      error: err.message
    })
  }
}

export async function forgetPassword(req, res) {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "All required fields are not iven"
      })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password length must be 8 or greater than 8"
      })
    }
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not found"
      })
    }
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is not verified.Please verify user check your email"
      })
    }
    user.password = newPassword;
    user.save()
    return res.status(200).json({
      success: true,
      message: "Password Update Successful"
    })
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update Password",
      error: err.message
    })
  }
}

// we make resend verification mail

export async function resendVerifyEmail(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Required fields are not found."
      })
    }
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({
        success: false,
        message: "Email address is invaild."
      })
    }

    const user = await User.findOne({ email });
    if (!user){
      return res.status(404).json({
        success: false,
        message: "User not found."
      })
    }
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already Verified."
      })
    }


    const authToken = jwt.sign(
      { id: user._id },
      process.env.AUTH_JWT_SECRET,
      { expiresIn: process.env.AUTH_JWT_EXPIRES_IN }
    );

    user.authToken = authToken

    user.save()
    await sendVerifyEmail(authToken, email, user.username)
    
    return res.status(200).json({
      success: true,
      message: "Resend Verification Email Successful."
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error occured while resending verification email.",
      error: err.message
    })
  }
}