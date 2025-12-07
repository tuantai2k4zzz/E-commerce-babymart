import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "admin", "manager"],
      default: "admin"
    }
  },
  { timestamps: true }
);

// ==============================
// ⭐ PRE-SAVE HOOK – CHUẨN NODE 22
// ==============================
UserSchema.pre("save", async function () {
  // Nếu không đổi password → bỏ qua
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10); // gen salt
  this.password = await bcrypt.hash(this.password, salt); // hash mật khẩu
});

// ==============================
// ⭐ SO SÁNH MẬT KHẨU
// ==============================
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", UserSchema);
