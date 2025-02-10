module.exports = app => {
    const items = require("../controllers/tutorial.controller.js");

    var router = require("express").Router();

    // Login route
    router.post("/login", items.login);

    // Create a new Item
    router.post("/", items.create);

    // Retrieve all Items
    router.get("/", items.findAll);

    // Retrieve all published Items
    router.get("/published", items.findAllPublished);

    // Retrieve a single Item with id
    router.get("/:id", items.findOne);

    // Update a Item with id
    router.put("/:id", items.update);

    // Delete a Item with id
    router.delete("/:id", items.delete);

    // Create a new Item
    router.delete("/", items.deleteAll);

    // Replace photo for a Item
    router.put("/:id/photo", items.updatePhoto);

    // Delete photo for a Item
    router.delete("/:id/photo", items.deletePhoto);


    app.use("/api/tutorials", router);
};
