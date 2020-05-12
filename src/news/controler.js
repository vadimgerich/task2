import News from "./model"

const photoControler = {
    //отримати всі
    async get: function (request, response) {
        try {
            const list = await News.find(makeQueryObject(req.query));
            response.send(list);
        }
            catch(error){
            response.status(500).send(error);
        }
    
    },
    
    async post (req, res) {
    try {
        const photo = new photo(req.body);
        await photo.save();
        res.send(photo);

        } catch (error) {
        res.status(500).send(error);
        }
    },
    async delete (req, res) {
        try {
            const photo = await News.findByIdAndDelete(req.params.id);
            if (!photo)
                res.status(404).send("Not found");
            res.send(photo);
        } catch (error) {
            res.status(500).send(error);
        }
    },

    async patch(req, res) {
        try {
            const photo = await News.findByIdAndUpdate(req.params.id, req.body,  {new: true});
            if (!photo)
                res.status(404).send("Not found");
            await News.save();
            res.send(photo);
        } catch (error) {
            res.status(500).send(error);
        }
    }
}


export default photoControler;