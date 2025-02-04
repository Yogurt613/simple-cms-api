import cors from 'cors';
import express from 'express';
import { body, validationResult } from 'express-validator';
import Collection from './collection.js';

const app = express();
const port = 3000;

const corsOptions = {
  origin: '*',
  allowedHeaders:'*',
};
// 添加 CORS 中介層
app.use(cors(corsOptions));
// 啟用 JSON 解析
app.use(express.json());
// 取得集合
const collection = new Collection('customers');

// 假資料
// const customers = [
//   { id: 1, name: 'Customer 1' },
//   { id: 2, name: 'Customer 2' },
// ];

// 測試端點
app.get('/api', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// 取得所有客戶端點
app.get('/api/customers', async (req, res) => {
  const customers = await collection.getItems();
  res.json(customers);
});

// 取得單個客戶端點
app.get('/api/customers/:id', async (req, res) => {
  const id = req.params.id;
  const customer = await collection.getItem(id);
  if (!customer) {
    return res.status(404).json({
      message: 'Customer not found',
    });
  }

  res.json(customer);
});

// 建立客戶端點
app.post('/api/customers', [
  body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors);
  }

  const customer = {
    name: req.body.name,
  };

  const id = await collection.addItem(customer);
  customer.id = id;

  res.status(201).json(customer);
});

// 更新客戶端點
app.put('/api/customers/:id', [
  body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors);
  }

  const id = req.params.id;
  const customer = await collection.getItem(id);
  if (!customer) {
    return res.status(404).json({
      message: 'Customer not found',
    });
  }

  customer.name = req.body.name;
  await collection.updateItem(id, customer);

  res.json(customer);
});

// 刪除客戶端點
app.delete('/api/customers/:id', async (req, res) => {
  const id = req.params.id;
  const customer = await collection.getItem(id);
  
  if (!customer) {
    return res.status(404).json({
      message: 'Customer not found',
    });
  }

  await collection.removeItem(id);

  res.status(204).send();
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
