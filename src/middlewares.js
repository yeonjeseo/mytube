export const localsMiddlewares = (req, res, next) => {
  //locals object에 loggedIn 넘기기
  // 결과가 undefined같은 이상한 놈일 수 있으니 Boolean 객체로 만들어줌
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "MyTube";
  res.locals.loggedInUser = req.session.user;
  next();
};
