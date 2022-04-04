const express = require('express');
const router = express.Router();
const tasksCtrl = require('../../controllers/tasks');

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/
router.get('/', tasksCtrl.index);
router.get('/subtasks/:id', tasksCtrl.indexByUser);
router.get('/category', tasksCtrl.indexCategory);
router.get('/punchcardsbytask/:id', tasksCtrl.indexPunchCardsByTask);
router.get('/punchcardsbyuser/:id', tasksCtrl.indexPunchCardsByUser);

router.post('/create', tasksCtrl.create);
router.post('/category/create', tasksCtrl.createCategory);
router.post('/punchcard/create', tasksCtrl.createPunchCard);

router.put('/update', tasksCtrl.update)
router.put('/punchcard/update', tasksCtrl.updatePunchCard)

module.exports = router;