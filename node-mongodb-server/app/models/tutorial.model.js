module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            title: String,
            description: String,
            technicalData: String,
            links: String,
            type: String,
            photoUrl: String,
            category: String
        },
        {timestamps: true}
    );

    schema.method("toJSON", function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });

    const Tutorial = mongoose.model("tutorial", schema);
    return Tutorial;
};
