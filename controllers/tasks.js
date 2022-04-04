const Task = require('../models/task');

module.exports = {
    index,
    indexByUser,
    indexCategory,
    indexPunchCardsByTask,
    indexPunchCardsByUser,
    create,
    createCategory,
    createPunchCard,
    update,
    updatePunchCard,
  };

//INDEX

async function index(req, res){
    try{
        const tasks = await Task.task.find({});

        res.status(200).json({tasks});
    }catch(err){
        console.log(err, 'ERROR')
        res.status(500).json({message: err})
    }
}

async function indexByUser(req, res){
    try{
        const tasks = await Task.task.find({'user': req.params.id})
        console.log(tasks.length, 'TASKS')

        res.status(200).json({tasks})
    }catch(err){
        console.log(err, 'ERROR')
        res.status(500).json({message: err})
    }
}

async function indexCategory(req, res){
    try{
        const categories = await Task.category.find({});

        res.status(200).json({categories});
    }catch(err){
        console.log(err, 'ERROR')
        res.status(500).json({message: err})
    }
}

async function indexPunchCardsByTask(req, res){
    try{
        const punchCards = await Task.punchCard.find({'task': req.params.id})

        res.status(200).json({punchCards})
    }catch(err){
        console.log(err, 'ERROR')
        res.status(500).json({message: err})
    }
}

async function indexPunchCardsByUser(req, res){
    try{
        const punchCards = await Task.punchCard.find({'user': req.params.id})

        res.status(200).json({punchCards})
    }catch(err){
        console.log(err, 'ERROR')
        res.status(500).json({message: err})
    }
}

//CREATE

async function create(req, res){
    try{
        const newTask = await new Task.task({...req.body})

        await newTask.save();

        console.log(newTask, 'TASK')
        res.status(201).json({task: newTask});
    }catch(err){
        console.log(err, 'ERROR')
        res.status(500).json({message: err})
    }
}

async function createCategory(req, res){
    try{
        const newCategory = await new Task.category({...req.body})

        await newCategory.save();

        console.log(newCategory, 'CATEGORY')
        res.status(201).json({category: newCategory});
    }catch(err){
        console.log(err, 'ERROR')
        res.status(500).json({message: err})
    }
}

async function createPunchCard(req, res){
    try{
        const newPunchCard = await new Task.punchCard({...req.body})

        await newPunchCard.save();

        res.status(201).json({message: 'Punched in', punchCard: newPunchCard})
    }catch(err){
        console.log(err, 'ERROR')
        res.status(500).json({message: err})
    }
}

//UPDATE

async function update(req, res){
    try{
        await Task.task.findByIdAndUpdate({'_id': req.body.id}, {'$set': {...req.body.task}})
        res.status(200).json({message: 'success'})
    }catch(err){
        console.log(err, 'ERROR')
        res.status(500).json({message: err})
    }
}

async function updatePunchCard(req, res){
    try{
        Task.punchCard.findOneAndUpdate({'task': req.body.taskID, 'punchOut': 'none'}, {'$set': {...req.body.punchCard}}, function(err, punchCard){
            if(err) throw(err)
            res.status(200).json({punchCard})
        })

    }catch(err){
        console.log(err, 'ERROR')
        res.status(500).json({message: err})
    }
}



//Helper Functions
