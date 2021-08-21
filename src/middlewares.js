export const localsMiddlewares = (req, res, next) => {
  //locals object에 loggedIn 넘기기
  // 결과가 undefined같은 이상한 놈일 수 있으니 Boolean 객체로 만들어줌
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "MyTube";
  //user가 없는 경우에도 예외처리
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }

  // 내가 로그인을 이미 했는데 다시 로그인을 해도 안됨!
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
