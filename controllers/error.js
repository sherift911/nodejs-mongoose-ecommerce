const get404 = (req, res) => {
  res.status(404).render("404", {
    pageTitle: "404 page",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};

module.exports = { get404 };
