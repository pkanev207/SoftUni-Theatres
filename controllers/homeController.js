const router = require('express').Router();

const playService = require('../services/playService');

// TODO replace with real controller by assignment
router.get('/', async (req, res) => {
    const theatre = await playService.getAllSortedByDate();
    let plays;

    if (req.user) {
        plays = theatre;
    } else {
        plays = theatre
            .sort((a, b) => b.likes.length - a.likes.length)
            .slice(0, 3);
    }

    res.render('home', { plays });
});

module.exports = router;
