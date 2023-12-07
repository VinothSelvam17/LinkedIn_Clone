exports.isAlreadyLogin= (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect("/homePage");
  } else {
    return next();
  }
};
  
exports.isLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect("/loginPage");
  }
};