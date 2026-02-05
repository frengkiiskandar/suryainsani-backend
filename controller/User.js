import users from "../models/UserModel.js";
import argon2 from "argon2";
import jwt, { decode } from "jsonwebtoken";

// == Get User
export const GetUser = async (req, res) => {
  try {
    const response = await users.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

// == Login
export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await users.findOne({
      where: {
        email: email,
      },
    });
    if (!user) return res.status(404).json({ msg: "email tidk di temukan" });

    const match = await argon2.verify(user.password, password);
    if (!match) return res.status(400).json({ msg: "Password salah" });

    const userId = user.id;
    const userName = user.name;
    const userEmail = user.email;

    const accessToken = jwt.sign(
      { userId, userName, userEmail },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    // ini belum perli digunakan
    // const refreshToken = jwt.sign(
    //   { userId, userName, userEmail },
    //   process.env.REFRESH_TOKEN_SECRET,
    //   { expiresIn: "1d" },
    // );
    await users.update(
      {
        token: accessToken,
      },
      {
        where: {
          id: userId,
        },
      },
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      // === aktifkan ketika sudah di hosting dan menggunakan https
      // secure: false,
    });
    res.json({ accessToken });
  } catch (error) {
    console.log(error);
  }
};

// ===Logout ===
export const Logout = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(204).json({ msg: "No Content" });
  const user = await users.findOne({
    where: {
      token: token,
    },
  });
  if (!user) return res.status(204).json({ msg: "No content" });
  await users.update(
    {
      token: null,
    },
    {
      where: {
        id: user.id,
      },
    },
  );

  res.clearCookie("token");
  return res.status(200).json({ msg: "Berhasil Logout" });
};

// == Register
export const Register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;
    const user = await users.findOne({
      where: {
        email: email,
      },
    });
    if (user)
      return res
        .status(400)
        .json({ msg: "Email has already registered, Please Login !" });
    if (password !== confirmPassword)
      return res
        .json(400)
        .json({ msg: "password dan confirm password tidak sama" });

    const hashPassword = await argon2.hash(password);
    await users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    res.status(200).json({ msg: "user berhasil dibuat" });
  } catch (error) {
    console.log(error);
  }
};

// == update user
export const UpdateUser = async (req, res) => {
  try {
    const { name, password, confirmPassword } = req.body;
    const user = await users.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!user)
      return res
        .status(404)
        .json({ msg: "User dengan id tersebut tidak ada !" });

    let hashPassword = user.password;

    if (password) {
      if (password !== confirmPassword)
        return res
          .status(400)
          .json({ msg: "password dan confirm password tidak sama" });
      const hashPassword = await argon2.hash(password);
    }

    await users.update(
      {
        name: name ?? user.name,
        password: hashPassword,
      },
      {
        where: {
          id: req.params.id,
        },
      },
    );
    return res.status(200).json({ msg: "Update berhasil" });
  } catch (error) {
    console.log(error);
  }
};

// == Delete User
export const DeleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await users.findOne({
      where: {
        id: id,
      },
    });
    if (!user) return res.status(404).json({ msg: "user tidak ditemukan" });

    await users.destroy({
      where: {
        id: id,
      },
    });
    return res.status(200).json({ msg: "user berhasil dihapus", user });
  } catch (error) {
    console.log(error);
  }
};

export const Me = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (token === null) return res.status(404).json({ msg: "user tidak ditemukan" });
     const data = await users.findOne({
      where: {
        token: token,
      },
      attributes : ["name", "email"]
    });
    return res.status(200).json(data)
  } catch (error) {
    console.log(error);
  }
};
