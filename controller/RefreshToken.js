import users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    // ambil token dari cookie untuk melihat apa dia sudah login
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ msg: "Unauthorized, Please Login" });

    // kalau valid / telah login maka cocokkan refresh token yang ada di cookie dengan yang ada di database
    const user = await users.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) return res.status(403).json({ msg: "Akeses dilarang" });

    // kalau ada , tinggal verifikasi dengan jwt untuk cek valid expires nya
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.status(403).json({ msg: "Akses Dilarang" });
        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const accessToken = jwt.sign({userId,name,email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:'20s'
        })
        res.json({accessToken})
      },
    );
   
  } catch (error) {
    console.log(error);
  }
};

