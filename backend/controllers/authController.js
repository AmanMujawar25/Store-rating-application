const pool = require("../config/db");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
    return passwordRegex.test(password);
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message: "Password must be 8-16 characters with at least one uppercase letter and one special character"
            });
        }

        const result = await pool.query(
            "SELECT password FROM users WHERE id = $1",
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const bcrypt = require("bcryptjs");

        const isMatch = await bcrypt.compare(
            currentPassword,
            result.rows[0].password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
            [hashedPassword, req.user.userId]
        );

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Change password error:", error);

        res.status(500).json({
            message: "Failed to change password"
        });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, address, password } = req.body;

        // Basic check
        if (!name || !email || !address || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check existing email
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await pool.query(
            `INSERT INTO users 
            (name, email, password, address, role)
            VALUES ($1, $2, $3, $4, 'NORMAL_USER')
            RETURNING id, name, email, address, role`,
            [name, email, hashedPassword, address]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


const forgotPassword = async (req, res) => {
  try {
    console.log("FORGOT PASSWORD REQUEST RECEIVED");
    console.log("Email:", req.body.email);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const result = await pool.query(
    "SELECT id, name, email FROM users WHERE email = $1",
    [email]
);

console.log("User found:", result.rows.length);

    // Same response whether email exists or not
    if (result.rows.length === 0) {
      return res.json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    const user = result.rows[0];

    const resetToken = crypto.randomBytes(32).toString("hex");

    const expiry = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await pool.query(
      `UPDATE users
       SET reset_token = $1,
           reset_token_expiry = $2
       WHERE id = $3`,
      [
        resetToken,
        expiry,
        user.id,
      ]
    );

   const resetLink =
    `http://localhost:5173/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Store Rating - Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          
          <h2 style="color: #162234;">
            Store Rating
          </h2>

          <p>
            Hello ${user.name},
          </p>

          <p>
            We received a request to reset your Store Rating
            account password.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <a
            href="${resetLink}"
            style="
              display: inline-block;
              padding: 12px 22px;
              background: #111827;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top: 25px;">
            This link will expire in 15 minutes.
          </p>

          <p>
            If you did not request this password reset,
            you can safely ignore this email.
          </p>

          <hr />

          <p style="color: #777;">
            Store Rating Application
          </p>

        </div>
      `,
    });

    res.json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
        message: error.message,
    });
}
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const result = await pool.query(
            `SELECT id, name, email, password, address, role
             FROM users
             WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (password.length < 8 || password.length > 16) {
      return res.status(400).json({
        message: "Password must be between 8 and 16 characters",
      });
    }

    const result = await pool.query(
      `SELECT id
       FROM users
       WHERE reset_token = $1
       AND reset_token_expiry > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Reset link is invalid or expired",
      });
    }

    const userId = result.rows[0].id;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users
       SET password = $1,
           reset_token = NULL,
           reset_token_expiry = NULL
       WHERE id = $2`,
      [
        hashedPassword,
        userId,
      ]
    );

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
    register: registerUser,
    login: loginUser,
    forgotPassword,
    resetPassword,
    changePassword,
    validatePassword
};