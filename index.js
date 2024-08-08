import express from 'express';

const app = express();
const port = 3000;

// 啟用 JSON 解析
app.use(express.json());

// 假資料
const customers = [
  { id: 1, name: 'Customer 1' },
  { id: 2, name: 'Customer 2' },
];

// 測試端點
app.get('/api', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// 取得所有客戶端點
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

// 取得單個客戶端點
app.get('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const customer = customers.find(customer => customer.id === id);
  if (!customer) {
    return res.status(404).json({
      message: 'Customer not found',
    });
  }

  res.json(customer);
});

// 建立客戶端點
app.post('/api/customers', (req, res) => {
  const customer = {
    id: customers.length + 1,
    name: req.body.name,
  };

  customers.push(customer);

  res.status(201).json(customer);
});

// 更新客戶端點
app.put('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const customer = customers.find(customer => customer.id === id);
  if (!customer) {
    return res.status(404).json({
      message: 'Customer not found',
    });
  }

  customer.name = req.body.name;

  res.json(customer);
});

// 刪除客戶端點
app.delete('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = customers.findIndex(customer => customer.id === id);
  if (index === -1) {
    return res.status(404).json({
      message: 'Customer not found',
    });
  }

  customers.splice(index, 1);

  res.status(204).send();
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
