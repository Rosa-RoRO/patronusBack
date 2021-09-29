const router = require('express').Router();


const { getById, getAllOffers, getOffersWaiting, getOffersRejecteds, deleteAccount, editDatesAthlete, editDatesUser, acceptOffer, rejectOffer, createNew, getAthleteExists, getEmail, updateParticipations, updatePercentage, totalParticipations, getEmailAthlete, resetPassword } = require('../../models/athlete.model');
const { route } = require('./sponsors');

const bcrypt = require('bcryptjs');

const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'public/images' });

const nodemailer = require("nodemailer");
const { getEmailSponsor } = require('../../models/sponsor.model');



// ver todas las ofertas recibidas

router.get('/allOffers/:idAthlete', async (req, res) => {
    try {
        const idAthlete = req.params.idAthlete;
        const result = await getAllOffers(idAthlete);
        res.json(result);
    } catch (err) {
        res.json({error: err.message})
    }
});


// ver todas las ofertas (el histórico total)

router.get('/offers/:idAthlete', async (req, res) => {
    try {
        const idAthlete = req.params.idAthlete;
        const result = await getOffersWaiting(idAthlete);
        res.json(result);
    } catch (err) {
        res.json({error: err.message})
    }
})


// ver todas las ofertas que ha rechazado

router.get('/rejectedOffers/:idAthlete', async (req, res) => {
    try {
        const idAthlete = req.params.idAthlete;
        const result = await getOffersRejecteds(idAthlete);
        res.json(result);
    } catch (err) {
        res.json({error: err.message})
    }
})


// ver todas las ofertas que está a la espera de responder

router.get('/holdOffers/:idAthlete', async (req, res) => {
    try {
        const idAthlete = req.params.idAthlete;
        const result = await getOffersWaiting(idAthlete);
        res.json(result);
    } catch (err) {
        res.json({error: err.message})
    }
})


// recuperar usuario 

router.get('/email/:idAthlete', async (req, res) => {
    const idAthlete = req.params.idAthlete;
    const result = await getEmail(idAthlete);
    res.json(result);
})


// recuperar atleta por id

router.get('/:idAthlete', async (req, res) => {
    try {
        const idAthlete = req.params.idAthlete;
        const result = await getById(idAthlete);
        res.json(result);
    } catch (err) {
        res.json({error: err.message});
    }
});


// crear noticia


router.post('/createNew/:idAthlete', upload.single('photo'), async(req, res) => {
    if(req.file !== undefined) {
        const extension = '.' + req.file.mimetype.split('/')[1];
        const newName = req.file.filename + extension;
        const path = req.file.path + extension;
        fs.renameSync(req.file.path, path);
        req.body.photo = 'images/' + newName;
    }
    try {
        const idAthlete = req.params.idAthlete;
        const result = await createNew(idAthlete, req.body);
        res.json(result);
    } catch (err) {
        res.json({error: err.message})
    }
});



// aceptar oferta

router.put('/acceptOffer/:idOffer', async (req, res) => {
    const idOffer = req.params.idOffer;
    const result = await acceptOffer(idOffer);
    res.json(result);
})


// rechazar oferta

router.put('/rejectOffer/:idOffer/:idAthlete', async (req, res) => {
    const idOffer = req.params.idOffer;
    const idAthlete = req.params.idAthlete;
    const result = await rejectOffer(idOffer);
    const sumParticipations = await totalParticipations(idAthlete);
    const sumParticipationsNumber = Number(sumParticipations[0].total);
    const quantityDemand = 1000 - sumParticipationsNumber;
    const participations = await updateParticipations(quantityDemand, idAthlete);
    const percentageTotal = sumParticipationsNumber * 0.1;
    const percentage = await updatePercentage(percentageTotal, idAthlete);
    res.json(percentage);
});



// editar perfil

router.put('/profile/:idAthlete', upload.single('photo'), async (req, res) => {
    console.log('Esto es req.file', req.file);
    console.log('Esto es req.body', req.body);
    if(req.file !== undefined) {
        const extension = '.' + req.file.mimetype.split('/')[1];
        const newName = req.file.filename + extension;
        const path = req.file.path + extension;
        fs.renameSync(req.file.path, path);
        req.body.photo = 'images/' + newName;
    }
    try {
        console.log('esto es limitdate', req.body.limitdate);
        const idAthlete = req.params.idAthlete;
        const athleteChanged = await editDatesAthlete(idAthlete, req.body);
        const userChanged = await editDatesUser(idAthlete, req.body.email);
        const athlete = await getById(idAthlete);
        res.json(athlete);
    } catch (err) {
        res.json({error: err.message})
    }
})


// enviar email para reset contraseña

router.post("/send-email/:token/:role/:idAthlete", async (req, res) => {
    const token = req.params.token;
    const idAthlete = req.params.idAthlete;
    const role = req.params.role;
    const emailAthlete = await getEmailAthlete(idAthlete);
    console.log('esto es email athlete', emailAthlete)
    if (emailAthlete[0].email === req.body.email) {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "patronus.spain@gmail.com",
                pass: "Admin123!"
            }
        });
        
        let mailOptions = {
            from: "Patronus",
            to: req.body.email,
            subject: "Enviado desde nodemailer",
            text: "http://localhost:4200/reset-pass/" + token + '/' + role + '/' + idAthlete
        }
        
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                res.status(500).send(error.message);
            } else {
                console.log("Email enviado.");
                res.status(200).jsonp(req.body);
            }
        })
    };

});


// reset password 

router.put('/resetPassword/:idAthlete', async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const id = parseInt(req.params.idAthlete);
    const result = await resetPassword(req.body, id);
    res.json(result);
});


// borrar cuenta

router.put('/deleteAccount/:idAthlete', async (req, res) => {
    try {
        const idAthlete = req.params.idAthlete;
        const result = await deleteAccount(idAthlete);
        res.json(result);
    } catch (err) {
        res.json({error: err.message});
    }
})



module.exports = router;
