import User from '../models/User';

class UserController {
    async store(req, res) {
        const userExists = await User.findOne({ where: { email: req.body.email } });

        if (userExists) {
            return res.status(400).json({ Error: "User already exists"});
        }

        const { id, name, email, provider } = await User.create(req.body);

        return res.json({ 
            id, 
            name, 
            email, 
            provider 
        });
    };

    async update(req, res) {
        const { email, oldpassword } = req.body;

        const user = await User.findByPk(req.userId);

        if (email != user.email) {
            const userExists = await User.findOne({ where: { email: req.body.email } });
            if (userExists) {
                return res.status(400).json({ Error: "User already exists"});
            } 
        }

        if (oldpassword && !(await user.checkPassword(oldpassword))) {
            return res.status(400).json({ error: "Password does not match" });
        };

        const { id, name, provider } = await user.update(req.body);

        return res.status(200).json({id, name, provider});
    }
}

export default new UserController();