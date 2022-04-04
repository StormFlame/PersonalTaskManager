const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: String,
    category: String,
    hours: {type: Number, default: 0},
    predictedHours: Number,
    description: String,
    status: String,
    subTask: Boolean,
    parent: mongoose.Schema.ObjectId,
    user: mongoose.Schema.ObjectId,
    level: Number,
    due: Date,
  }, {
    timestamps: true
  });

const categorySchema = new mongoose.Schema({
    name: String,
    description: String,
}, {
    timestamps: true
});

const punchCardSchema = new mongoose.Schema({
  user: mongoose.Schema.ObjectId,
  task: {type: mongoose.Schema.ObjectId, ref: 'taskSchema'},
  punchIn: String,
  punchOut: String,
}, {
    timestamps: true
});

const task = mongoose.model('Task', taskSchema);
const category = mongoose.model('Category', categorySchema);
const punchCard = mongoose.model('PunchCard', punchCardSchema)

module.exports = {
    task,
    category,
    punchCard
}