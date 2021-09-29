const { createToken } = require('../../helpers');
const { getByEmail, changeStatus, createAthlete, registerUser, createSponsor, getAthletesNews, getAllAthletes, updateFollowers, introduceTokens } = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const router = require('express').Router();

const puppeteer = require('puppeteer');





// ver noticias

router.get('/news', async (req, res) => {
    const result = await getAthletesNews();
    res.json(result);
});




router.get('/followers', async (req, res) => {
    const athletes = await getAllAthletes();
    console.log(athletes);
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    for (let athlete of athletes) {
        await page.goto(`https://www.instagram.com/${athlete.userinstagram}/?hl=es`);
        await page.waitForSelector('.g47SY');
        let seguidoresInsta = await page.evaluate(() => document.querySelectorAll('.g47SY')[1].innerText);
        console.log('Instagram', seguidoresInsta);
        
        await page.goto(`https://www.tiktok.com/@${athlete.usertiktok}?`);
        let seguidoresTikTok = await page.evaluate(() => document.querySelectorAll('.number')[1].innerText);
        console.log('TikTok', seguidoresTikTok);

        // insertar base de datos:
        const followers = await updateFollowers(seguidoresInsta, seguidoresTikTok, athlete.id);
        await page.waitForTimeout(500);
    }

    await browser.close();

    res.json('Todo ok');

    // recuperar todos los atletas 
    // recorrer cada atleta 
    // lanzar el scrappy para cada uno de ellos 
});




// register athlete

router.post('/register/athlete', 
    body('password', 'Dabes incluir un password mayor de 3 caracteres y que contenga, al menos: una mayúscula, una minúscula, un número y un símbolo especial').exists().isLength({ min: 4 }).custom(value => {
        const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})");
        return regex.test(value);
    }),
    body('email', 'Debes incluir un email correcto').exists().isEmail(), 
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            const user = await getByEmail(req.body.email);
            if (user) {
                return res.json({ error: 'Error en el registro. Por favor, revise los datos' });
            }
            const athlete = await createAthlete(req.body);
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            const result = await registerUser(req.body, athlete.insertId, null, 'A');
            res.json(result);
        } catch (err) {
            res.json({error: err.message})
        }
});



// init tokens 

router.post('/registertokens', async (req, res) => {
    const result = await introduceTokens(req.body);
    res.json(result);
})




// register sponsor

router.post('/register/sponsor', 
    body('password', 'Dabes incluir un password mayor de 3 caracteres y que contenga, al menos: una mayúscula, una minúscula, un número y un símbolo especial').exists().isLength({ min: 4 }).custom(value => {
        const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})");
        return regex.test(value);
    }),
    body('email', 'Debes incluir un email correcto').exists().isEmail(), 
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            const user = await getByEmail(req.body.email);
            if (user) {
                return res.json({ error: 'Error en el registro. Por favor, revise los datos' });
            }
            const sponsor = await createSponsor(req.body);
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            const result = await registerUser(req.body, null, sponsor.insertId, 'S');
            res.json(result);
        } catch (err) {
            res.json({ error: err.message })
        }
});



// login

router.post('/login', async (req, res) => {
    const user = await getByEmail(req.body.email);
    if (!user) {
        return res.json({ error: 'Error en usuario y/o contraseña' });
    }
    const equal = bcrypt.compareSync(req.body.password, user.password);
    console.log('console', user);
    if (equal) {
        res.json({ success: 'Login correcto',
                token: createToken(user),
                role: user.role,
                userId: user.fk_athlete || user.fk_sponsor
                });
    } else {
        res.json ({ error: 'Error en usuario y/o contraseña' });
    }
});




// cambiar status oferta

router.put('/offers', async (req, res) => {
    const result = await changeStatus(req.body);
    res.json(result);
});






module.exports = router;