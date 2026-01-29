import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {

  // === jangan pake headers kalo mau poke cookie aja
  // const authHeaders = req.headers["authorization"];
  // const token = authHeaders && authHeaders.split(" ")[1];
  const token = req.cookies.token
  if (token == null)
    return res.status(401).json({ msg: "Unauthorized, Please Login" });

  // == jika dapat token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "akses dilarang" });
    req.email = decoded.userEmail;
    req.userName = decoded.userName;
    req.userId = decoded.userId
    next();
  });
};

