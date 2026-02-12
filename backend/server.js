

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// --- Configuration ---
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/intern_assignment';

// --- Database Connection ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ DB Connection Error:', err));

// --- Database Schemas ---
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const NoteSchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: String,
    stock: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Task = mongoose.model('Task', TaskSchema);
const Note = mongoose.model('Note', NoteSchema);
const Product = mongoose.model('Product', ProductSchema);


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = user;
        next();
    });
};

const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: `Forbidden: Requires ${role} role` });
        }
        next();
    };
};


const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: { title: 'Backend Intern API', version: '1.0.0', description: 'Full CRUD with Auth & RBAC' },
        servers: [{ url: `http://localhost:${PORT}` }],
        components: {
            securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } }
        }
    },
    apis: ['./server.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: {type: string, example: "user@test.com"}
 *               password: {type: string, example: "password123"}
 *               role: {type: string, enum: [user, admin], example: "user"}
 *     responses:
 *       201:
 *         description: User registered successfully
 */
app.post('/api/v1/auth/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, role: role || 'user' });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and get JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: {type: string, example: "user@test.com"}
 *               password: {type: string, example: "password123"}
 *     responses:
 *       200:
 *         description: Login successful (Returns token, role, and email)
 */
app.post('/api/v1/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, role: user.role, email: user.email });
});


/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: View tasks
 *     security: [{ bearerAuth: [] }]
 *   post:
 *     tags: [Tasks]
 *     summary: Create task
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: {type: string}
 *               description: {type: string}
 *               status: {type: string, enum: [pending, in-progress, completed]}
 */
app.get('/api/v1/tasks', authenticateToken, async (req, res) => {
    const query = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const tasks = await Task.find(query);
    res.json(tasks);
});

app.post('/api/v1/tasks', authenticateToken, async (req, res) => {
    const newTask = new Task({ ...req.body, userId: req.user.id });
    await newTask.save();
    res.status(201).json(newTask);
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Update task and Status
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: {type: string}
 *               description: {type: string}
 *               status: {type: string, enum: [pending, in-progress, completed]}
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
app.put('/api/v1/tasks/:id', authenticateToken, async (req, res) => {
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });
    res.json(task);
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete task
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
app.delete('/api/v1/tasks/:id', authenticateToken, async (req, res) => {
    const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, userId: req.user.id };
    const task = await Task.findOneAndDelete(query);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
});



/**
 * @swagger
 * /api/v1/notes:
 *   get:
 *     tags: [Notes]
 *     summary: View notes
 *     security: [{ bearerAuth: [] }]
 *   post:
 *     tags: [Notes]
 *     summary: Create note
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content: {type: string}
 */
app.get('/api/v1/notes', authenticateToken, async (req, res) => {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
});

app.post('/api/v1/notes', authenticateToken, async (req, res) => {
    const newNote = new Note({ ...req.body, userId: req.user.id });
    await newNote.save();
    res.status(201).json(newNote);
});

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   put:
 *     tags: [Notes]
 *     summary: Update note
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
app.put('/api/v1/notes/:id', authenticateToken, async (req, res) => {
    const note = await Note.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
});

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   delete:
 *     tags: [Notes]
 *     summary: Delete note
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
app.delete('/api/v1/notes/:id', authenticateToken, async (req, res) => {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
});



/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     tags: [Products]
 *     summary: View all products
 *     security: [{ bearerAuth: [] }]
 *   post:
 *     tags: [Products]
 *     summary: Add product (Admin Only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: {type: string}
 *               price: {type: number}
 */
app.get('/api/v1/products', authenticateToken, async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post('/api/v1/products', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update product (Admin Only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
app.put('/api/v1/products/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete product (Admin Only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
app.delete('/api/v1/products/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
});

app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}/api-docs`));
