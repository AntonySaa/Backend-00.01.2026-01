const users = [];
let idCounter = 1;

exports.listUsers = (req, res) => {
    res.status(200).json(users);
}

exports.createUser = (req, res) => {
    const { name, email } = req.body;
    const user = { id: idCounter++, name, email, createdAt: new Date() };
    users.push(user);
    res.status(201).json(user);
}

exports.getUser = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(user);
}
