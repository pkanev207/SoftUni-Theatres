const router = require('express').Router();

const playService = require('../services/playService');

// TODO replace with real controller by assignment
router.get('/', async (req, res) => {
    const plays = await playService.getAllSortedByDate();
    // console.log(plays);

    res.render('home', { plays });
});

module.exports = router;
