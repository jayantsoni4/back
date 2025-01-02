const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // For JSON requests
app.use(express.static('public')); // Serve static files like CSS and JS

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todoapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));

// Task Model
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

const Task = mongoose.model('Task', taskSchema);

// Routes

// Dashboard: Show tasks
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: Get all tasks
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// API: Add a new task
app.post('/api/tasks', async (req, res) => {
    const { taskName } = req.body;
    const newTask = new Task({ name: taskName });
    await newTask.save();
    res.status(201).json(newTask);
});

// API: Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    await Task.findByIdAndDelete(taskId);
    res.status(200).send('Task deleted');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
