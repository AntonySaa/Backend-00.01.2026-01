const orders = [];
let orderIdCounter = 1;

exports.listOrders = (req, res) => {
    const { page = 1, limit = 10, sort = 'asc' } = req.query;
    let sorted = [...orders];
    if (sort === 'desc') sorted.reverse();
    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginated = sorted.slice(start, start + parseInt(limit));
    res.status(200).json({
        data: paginated,
        page: parseInt(page),
        limit: parseInt(limit),
        total: orders.length
    });
}

exports.createOrder = (req, res) => {
    const { items, customerID } = req.body;
    const order = {
        id: orderIdCounter++,
        items,
        customerID,
        status: 'pending',
        createdAt: new Date()
    };
    orders.push(order);
    res.status(201).json(order);
}

exports.exportCSV = (req, res) => {
    let csv = 'ID,CustomerID,Status,CreatedAt\n';
    orders.forEach(order => {
        csv += `${order.id},${order.customerID},${order.status},${order.createdAt}\n`;
    });
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="orders.csv"');
    res.send(csv);
}
