const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.redirect("/");
  }
  next();
};

module.exports = isAdmin;
