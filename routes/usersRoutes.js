const UsersController = require("../controllers/usersController");
const passport = require("passport");

module.exports = (app, upload) => {
  app.get("/api/users/getAll", UsersController.getAll);

  app.get("/api/users/findDeliveryMen", UsersController.findDeliveryMen);

  app.get(
    "/api/users/findById/:id",
    passport.authenticate("jwt", { session: false }),
    UsersController.findById
  );

  app.post(
    "/api/users/create",
    upload.array("image", 1),
    UsersController.registerWithImage
  );

  app.post("/api/users/login", UsersController.login);

  app.put(
    "/api/users/update",
    passport.authenticate("jwt", { session: false }),
    upload.array("image", 1),
    UsersController.update
  );

  app.post("/api/users/logout", UsersController.logout);
};
