const router = require('express').Router();

const playService = require('../services/playService');
const { parseError } = require('../util/errorParser');

const { isUser, isGuest } = require('../middleware/guards');

router.get('/create', isUser(), (req, res) => {
    res.render('create');
});

router.post('/create', isUser(), async (req, res) => {
    try {
        const { title, description, imageURL, ...rest } = req.body;
        console.log(rest);

        if (title == '' || description == '' || imageURL == '') {
            throw new Error('All fields are required!');
        }

        const play = req.body;

        play.isPublic ? play.isPublic = true : play.isPublic = false;

        play.owner = req.user._id;
        // play.createdAt = (new Date()).toISOString().slice(0, 10);

        const created = await playService.create(play);
        console.log(created);

        res.redirect('/');
    } catch (err) {
        console.log(err);
        const errors = parseError(err);

        res.render('create', {
            errors,
            // data: { username: req.body.username },
            data: { ...req.body }
        });
    }
});

router.get('/details/:id', isUser(), async (req, res) => {
    const play = await playService.getModelAndUsers(req.params.id);

    if (req.user?._id == play.owner._id) {
        play.isAuthor = true;
    }

    res.render('details', { ...play });
});

router.get('/edit/:id', isUser(), async (req, res) => {
    const play = await playService.getModelAndUsers(req.params.id);

    if (req.user?._id != play.owner._id) {
        res.clearCookie('token');
        res.redirect('/auth/login');
    }

    res.render('edit', { ...play });
});

router.post('/edit/:id', isUser(), async (req, res) => {
    try {
        const { title, description, imageUrl, ...rest } = req.body;

        if (title == '' || description == '' || imageUrl == '') {
            throw new Error('All fields are required!');
        }

        const play = await playService.getModelAndUsers(req.params.id);

        if (req.user?._id != play.owner._id) {
            res.clearCookie('token');
            res.redirect('/auth/login');
        }

        if (req.body.isPublic) {
            req.body.isPublic = true;
        } else {
            req.body.isPublic = false;
        }

        await playService.update(req.params.id, req.body);

        res.redirect('/');
    } catch (err) {
        console.log(err);
        const errors = parseError(err);

        res.render('edit', { errors, ...req.body, _id: req.params.id });

    }
});


router.get('/delete/:id', isUser(), async (req, res) => {
    const play = await playService.getModelAndUsers(req.params.id);

    if (req.user?._id != play.owner._id) {
        res.clearCookie('token');
        res.redirect('/auth/login');
    }

    try {
        await playService.del(req.params.id);

        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;









// const router = require('express').Router();

// const { mapErrors } = require('../util/mapErrors');

// const modelService = require('../services/modelService');

// router.post('/:id/edit', async (req, res) => {
//     const hotel = await getById(req.params.id);

//     if (hotel.owner != req.user._id) {
//         return res.redirect('/auth/login');
//     }

//     const edited = {
//         name: req.body.name,
//         city: req.body.city,
//         imageUrl: req.body.imageUrl,
//         rooms: Number(req.body.rooms),
//     };

//     try {
//         if (Object.values(edited).some(v => !v)) {
//             throw new Error('All fields are required!');
//         }

//         await update(req.params.id, edited);
//         res.redirect(`/hotel/${req.params.id}/details`);
//     } catch (err) {
//         res.render('edit', {
//             title: 'Edit Hotel Again!',
//             hotel: Object.assign(edited, { _id: req.params.id }),
//             // because we need the id for the address to work,
//             errors: mapErrors(err),
//         });
//     }
// });


// module.exports = router;
