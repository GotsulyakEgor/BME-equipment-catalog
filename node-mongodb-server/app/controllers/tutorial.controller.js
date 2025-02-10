const db = require("../models");
const items = db.tutorials;
const upload = require("../middleware/upload");
require("dotenv").config();

// Login method for checking credentials
exports.login = (req, res) => {
    const { username, password } = req.body;

    // Загружаем данные из .env
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Проверка введенных данных
    if (username === adminUsername && password === adminPassword) {
        res.status(200).send({
            message: "Login successful",
            isAdmin: true, // Можно передать роль пользователя
        });
    } else {
        res.status(401).send({
            message: "Invalid username or password",
            isAdmin: false,
        });
    }
};

// Create and Save a new items
exports.create = (req, res) => {
    upload.single("photo")(req, res, (err) => {
        if (err) {
            return res.status(400).send({ message: err.message });
        }

        // Validate request
        if (!req.body.title) {
            res.status(400).send({ message: "Content cannot be empty!" });
            return;
        }

        // Create a items
        const tutorial = new items({
            title: req.body.title,
            description: req.body.description,
            technicalData: req.body.technicalData,
            links: req.body.links,
            type: req.body.type,
            category: req.body.category,
            photoUrl: req.file ? `http://localhost:8080/uploads/${req.file.filename}` : null, // Store the photo URL
        });

        // Save items in the database
        tutorial.save(tutorial)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the items.",
                });
            });
    });
};
// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? {title: {$regex: new RegExp(title), $options: "i"}} : {};

    items.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

// Find a single items with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    items.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found items with id " + id});
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({message: "Error retrieving items with id=" + id});
        });
};

// Update a items by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    // Загрузка новой фотографии
    upload.single("photo")(req, res, (err) => {
        if (err) {
            return res.status(400).send({ message: err.message });
        }

        items.findById(id)
            .then((tutorial) => {
                if (!tutorial) {
                    return res.status(404).send({ message: `items not found with id=${id}` });
                }

                // Удаление старой фотографии, если она существует
                const fs = require("fs");
                if (req.file && tutorial.photoUrl) {
                    const filePath = tutorial.photoUrl.replace("http://localhost:8080/uploads/", "uploads/");
                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) console.error("Failed to delete old photo:", unlinkErr);
                    });
                }

                // Обновление полей туториала
                tutorial.title = req.body.title;
                tutorial.description = req.body.description;
                tutorial.technicalData = req.body.technicalData;
                tutorial.links = req.body.links;
                tutorial.type = req.body.type;
                tutorial.category = req.body.category;

                // Если была загружена новая фотография, обновляем URL
                if (req.file) {
                    tutorial.photoUrl = `http://localhost:8080/uploads/${req.file.filename}`;
                }

                tutorial
                    .save()
                    .then(() => res.send({ message: "items updated successfully!" }))
                    .catch((saveErr) => {
                        res.status(500).send({
                            message: `Error updating items with id=${id}`,
                            error: saveErr.message,
                        });
                    });
            })
            .catch((findErr) => {
                res.status(500).send({
                    message: `Error retrieving items with id=${id}`,
                    error: findErr.message,
                });
            });
    });
};

// Delete a items with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    items.findById(id)
        .then(tutorial => {
            if (!tutorial) {
                return res.status(404).send({
                    message: `Cannot delete items with id=${id}. Maybe items was not found!`
                });
            }

            // Удаление файла фотографии, если он существует
            const fs = require("fs");
            if (tutorial.photoUrl) {
                const filePath = tutorial.photoUrl.replace("http://localhost:8080/uploads/", "uploads/");
                console.log("Deleting file at path:", filePath);

                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Failed to delete photo file:", err);
                    } else {
                        console.log("Photo file deleted successfully.");
                    }
                });
            }

            // Удаление туториала из базы данных
            items.findByIdAndRemove(id, { useFindAndModify: false })
                .then(data => {
                    if (!data) {
                        return res.status(404).send({
                            message: `Cannot delete items with id=${id}. Maybe items was not found!`
                        });
                    } else {
                        res.send({
                            message: "items and its photo were deleted successfully!"
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Could not delete items with id=" + id
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving items with id=" + id,
                error: err.message,
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    items.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Tutorials were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
    items.find({published: true})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

// Update photo for a items
exports.updatePhoto = (req, res) => {
    const id = req.params.id;

    upload.single('photo')(req, res, (err) => {
        if (err) {
            return res.status(400).send({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).send({ message: 'No photo provided!' });
        }

        items.findById(id)
            .then(tutorial => {
                if (!tutorial) {
                    return res.status(404).send({ message: "items not found with id " + id });
                }

                // Удаление старой фотографии, если она существует
                const fs = require('fs');
                if (tutorial.photoUrl) {
                    const filePath = tutorial.photoUrl.replace('http://localhost:8080/uploads/', 'uploads/');
                    fs.unlink(filePath, (err) => {
                        if (err) console.error("Failed to delete old photo: ", err);
                    });
                }

                // Обновление URL фотографии
                tutorial.photoUrl = `http://localhost:8080/uploads/${req.file.filename}`;
                tutorial.save()
                    .then(() => res.send({ message: 'Photo updated successfully!' }))
                    .catch(err => res.status(500).send({
                        message: "Error updating photo for items with id=" + id,
                        error: err.message,
                    }));
            })
            .catch(err => res.status(500).send({
                message: "Error retrieving items with id=" + id,
                error: err.message,
            }));
    });
};

// Delete photo for a items
exports.deletePhoto = (req, res) => {
    const id = req.params.id;

    console.log("Received request to delete photo for id:", id);

    items.findById(id)
        .then(tutorial => {
            if (!tutorial) {
                console.log("items not found with id:", id);
                return res.status(404).send({ message: "items not found with id " + id });
            }

            console.log("Found tutorial:", tutorial);

            // Удаление фотографии
            const fs = require("fs");
            if (tutorial.photoUrl) {
                const filePath = tutorial.photoUrl.replace("http://localhost:8080/uploads/", "uploads/");
                console.log("Deleting file at path:", filePath);

                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Failed to delete file:", err);
                        return res.status(500).send({ message: "Failed to delete photo." });
                    }

                    tutorial.photoUrl = null;
                    tutorial.save()
                        .then(() => res.send({ message: "Photo deleted successfully!" }))
                        .catch(err => res.status(500).send({ message: "Error updating tutorial after deleting photo.", error: err.message }));
                });
            } else {
                console.log("No photo to delete for tutorial with id:", id);
                res.status(400).send({ message: "No photo to delete!" });
            }
        })
        .catch(err => {
            console.error("Error retrieving tutorial:", err);
            res.status(500).send({ message: "Error retrieving tutorial with id=" + id, error: err.message });
        });
};
