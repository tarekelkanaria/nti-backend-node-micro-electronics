const authMiddleware = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) return res.status(401).json({ msg: "Token not found" });
    const token = authHeaders.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
  }
};
module.exports = authMiddleware;
