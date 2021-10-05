const { totalParticipations, updateParticipations, updatePercentage } = require('../../models/athlete.model');
const { getMyAthletes, getMyAllOffers, getMyOffersRejecteds, offerById, deleteAccount, editSponsor, editUser, getAll, getAthleteById, orderByPercentage, orderByLimitdate, newOffer, getById, getInvertible, getAthletesBySport, getAthletesByCountry, getCountries, getSports, getNoInvertibles, getSportsSponsors, getFavoriteSportsSponsors, addAthleteFavorite, addSportFavorite, getMyAthletesFavorites, getIdSponsorByEmail, getSponsorExists, getEmailSponsor, AthletesByTokens, athleteIsFavorite, revertFavorite, getMySponsors, getAthleteSponsors, AthletesByCountry, getTimeOutAthletes, AthletesByResults, resetPassword, trendsAthletes } = require('../../models/sponsor.model');

const router = require('express').Router();

const bcrypt = require('bcryptjs');

const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'public/images' });

const nodemailer = require("nodemailer");
const { response } = require('express');
const { resourceUsage } = require('process');


// todos los deportistas

router.get('/allAthletes', async (req, res) => {
    try {
        const result = await getAll();
        res.json(result);
    } catch (err) {
        res.json({error: err.message});
    }
});

// todos los deportistas con ofertas caducadas

router.get('/athletesTimeOut', async (req, res) => {
    const result = await getTimeOutAthletes();
    res.json(result);
})


// todas las ofertas realizadas 

router.get('/myAllOffers/:idSponsor', async (req, res) => {
    try {
        const idSponsor = req.params.idSponsor;
        const result = await getMyAllOffers(idSponsor);
        res.json(result);
    } catch (err) {
        res.json({error: err.message});
    }
})


// todas las ofertas rechazadas 

router.get('/myOffersRejecteds/:idSponsor', async (req, res) => {
    try {
        const idSponsor = req.params.idSponsor;
        const result = await getMyOffersRejecteds(idSponsor);
        res.json(result);
    } catch (err) {
        res.json({error: err.message});
    }
})


router.get('/offer/:idOffer', async (req, res) => {
    try {
        const idOffer = req.params.idOffer;
        const result = await offerById(idOffer);
        console.log(result)
        res.json(result);
    } catch (err) {
        res.json({error: err.message});
    }
})

// ver atletas ordenados por fecha de expiración

router.get('/athletesLimitdate', async (req, res) => {
    const result = await orderByLimitdate();
    res.json(result);
})




// ver atletas ordenados por porcentaje 

router.get('/athletesPercentage', async (req, res) => {
    try {
        const result = await orderByPercentage();
        res.json(result);
    } catch (err) {
        res.json({error: err.message});
    }
})







// ver todos

router.get('/athletes/filterCountry/:nameCountry', async (req, res) => {
    try {
        const nameCountry = req.params.nameCountry;// extraer el nombre del pais de la ruta
        const result = await getAthletesByCountry(nameCountry);
        res.json(result);

    } catch (err) {
        res.json({ error: err.message });
    }
});


router.get('/athletes/filterSport/:nameSport', async (req, res) => {
    try {
        const nameSport = req.params.nameSport;
        const result = await getAthletesBySport(nameSport);
        res.json(result);
    } catch (err) {
        res.json({ error: err.message });

    }
});



router.get('/athletes/countries', async (req, res) => {
    const result = await getCountries();
    console.log(result);
    res.json(result);
});


router.get('/athletes/sports', async (req, res) => {
    const result = await getSports();
    res.json(result);
});

router.get('/athletes/invertibles', async (req, res) => {
    const result = await getInvertible();
    res.json(result);
    console.log(result);
});


router.get('/athletes/noInvertibles', async (req, res) => {
    const result = await getNoInvertibles();
    res.json(result);
    console.log(result);
});



// ver un atleta 

router.get('/athletes/:idAthlete', async (req, res) => {
    try {
        const idAthlete = req.params.idAthlete;
        const result = await getAthleteById(idAthlete);
        res.json(result);
    } catch (err) {
        res.json({error: err.message})
    }
});


// ver sponsors por atleta 

router.get('/sponsors/:idAthlete/', async (req, res) => {
    try {
        const idAthlete = req.params.idAthlete;
        const result = await getAthleteSponsors(idAthlete);
        res.json(result);
    } catch (err) {
        res.json({error: err.message})
    }
})


// deportistas invertidos

router.get('/myathletes/:idSponsor', async (req, res) => {
    try {
        const idSponsor = req.params.idSponsor;
        const result = await getMyAthletes(idSponsor);
        res.json(result);
    } catch (err) {
        res.json({error: err.message});
    }
});


// recuperar atletas favoritos 

router.get('/myFavorites/:idSponsor', async(req, res) => {
    const idSponsor = req.params.idSponsor;
    const result = await getMyAthletesFavorites(idSponsor);
    res.json(result);
})



router.get('/sportsSponsors', async (req, res) => {
    const result = await getSportsSponsors();
    res.json(result);
})

router.get('/sportsBySponsor/:idSponsor', async (req, res) => {
    const idSponsor = req.params.idSponsor;
    const result = await getFavoriteSportsSponsors(idSponsor);
    res.json(result);
})


// email del sponsor 

router.get('/email/:idSponsor', async (req, res) => {
    const idSponsor = req.params.idSponsor;
    const result = await getEmailSponsor(idSponsor);
    res.json(result);
    console.log(result);
});


// ---- Comprobar si es favorito

router.get('/athleteIsFavorite/:idSponsor/:idAthlete', async (req, res) => {
    const idSponsor = req.params.idSponsor;
    const idAthlete = req.params.idAthlete;
    const result = await athleteIsFavorite(idAthlete, idSponsor);
    res.json(result);
})


// Atletas en tendencia 

router.get('/trendsAthletes', async (req, res) => {
    const result = await trendsAthletes();
    res.json(result);
})



// Recomendaciones -----------------

// Recomendaciones por tokens

router.get('/recommendsByTokens/:idAthlete/:tokens', async (req, res) => {
    const tokens = parseInt(req.params.tokens);
    const idAthlete = parseInt(req.params.idAthlete);
    const rangoIniTokens = tokens - 50;
    const rangoFinTokens = tokens + 50;
    const result = await AthletesByTokens(rangoIniTokens, rangoFinTokens, idAthlete);
    res.json(result);
});


// Recomendaciones por rendimiento

router.get('/recommendsByResults/:idAthlete/:results', async (req, res) => {
    const idAthlete = req.params.idAthlete;
    const rendimiento = parseInt(req.params.results);
    const rangoIniRendimiento = rendimiento - 1;
    const rangoFinRendimiento = rendimiento + 1;
    const result = await AthletesByResults(idAthlete, rangoIniRendimiento, rangoFinRendimiento);
    res.json(result);
});


// Recomendaciones por país

router.get('/recommendsByCountry/:idAthlete/:country', async (req, res) => {
    const idAthlete = req.params.idAthlete;
    const country = req.params.country;
    const result = await AthletesByCountry(idAthlete, country);
    res.json(result);
});



// sponsor por Id 

router.get('/:idSponsor', async (req, res) => {
    const idSponsor = req.params.idSponsor;
    const result = await getById(idSponsor);
    res.json(result);
    console.log(result);
})




// nueva oferta

router.post('/newOffer/:idSponsor', async (req, res) => {
    try {
        const fk_sponsors = req.params.idSponsor;
        const result = await newOffer(fk_sponsors, req.body);
        const sumParticipations = await totalParticipations(req.body.fk_athletes);
        const sumParticipationsNumber = Number(sumParticipations[0].total);
        const athlete = await getAthleteById(req.body.fk_athletes);
        console.log('esto es atleta', athlete);
        const quantityinit = athlete.quantityinit;
        console.log('esto es QUANTITYINIT', athlete);
        const quantityDemand = quantityinit - sumParticipationsNumber;
        const participations = await updateParticipations(quantityDemand, req.body.fk_athletes);
        const percentageTotal = (sumParticipationsNumber * 100) / quantityinit;
        console.log('ESTO ES PERCENTAGETOTAL', percentageTotal);
        const percentage = await updatePercentage(percentageTotal, req.body.fk_athletes)
        res.json(percentage);
    } catch (err) {
        res.json({error: err.message});
    }
})



// añadir favorito 

router.post('/addAthleteFavorite/:idAthlete/:idSponsor', async(req, res) => {
    try {
        const idAthlete = req.params.idAthlete;
        const idSponsor = req.params.idSponsor;
        const result = await addAthleteFavorite(idAthlete, idSponsor);
        res.json(result);
        console.log(result);
    } catch (err) {
        res.json({error: err.message});
    }
});


// quitar favorito

router.put('/revertAthleteFavorite/:idAthlete/:idSponsor', async(req, res) => {
    try {
        const idAthlete = req.params.idAthlete;
        const idSponsor = req.params.idSponsor;
        const result = await revertFavorite(idAthlete, idSponsor);
        res.json(result);
        console.log('esto es revert favorite', result);
    } catch (err) {
        res.json({error: err.message});
    }
});



// añadir un deporte

router.post('/addSportFavorite/:idSponsor/:idSport', async(req, res) => {
    const idSponsor = req.params.idSponsor;
    const fk_sport = req.params.idSport;
    const result = await addSportFavorite(idSponsor, fk_sport);
    res.json(result);
});



// añadir múltiples deportes

    // utilizar función addSportFavorite dentro de un bucle




// editar perfil 

router.put('/profile/:idSponsor', upload.single('logo'), async (req, res) => {
    console.log('Esto es req.file', req.file);
    console.log('Esto es req.body', req.body);
    if(req.file !== undefined) {
        const extension = '.' + req.file.mimetype.split('/')[1];
        const newName = req.file.filename + extension;
        const path = req.file.path + extension;
        fs.renameSync(req.file.path, path);
        req.body.logo = 'images/' + newName;
    }
    try {
        const idSponsor = req.params.idSponsor;
        const sponsorChanged = await editSponsor(idSponsor, req.body);
        const userChanged = await editUser(idSponsor, req.body);
        const sponsor = await getById(idSponsor);
        res.json(sponsor);
    } catch (err) {
        res.json({error: err.message});
    }
});



// enviar email para reset contraseña

router.post("/send-email/:token/:role/:idSponsor", async (req, res) => {
    const token = req.params.token;
    const idSponsor = req.params.idSponsor;
    const role = req.params.role;
    const emailSponsor = await getEmailSponsor(idSponsor);
    if (emailSponsor[0].email === req.body.email) {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });
        
        let mailOptions = {
            from: "Patronus",
            to: req.body.email,
            subject: "Cambio contraseña Patronus",
            text: "http://localhost:4200/reset-pass/" + token + '/' + role + '/' + idSponsor
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

router.put('/resetPassword/:idSponsor', async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const id = parseInt(req.params.idSponsor);
    const result = await resetPassword(req.body, id);
    res.json(result);
});




// darse de baja

router.put('/deleteAccount/:idSponsor', async (req, res) => {
    try {
        const idSponsor = req.params.idSponsor;
        const result = await deleteAccount(idSponsor);
        res.json(result);
    } catch (err) {
        res.json({error: err.message});
    }
});





// // quitar favorito 

// router.put('/removeAthleteFavorite/:idAthlete', async(req, res) => {
//     try {
//         const idAthlete = req.params.idAthlete;
//         const result = await revertFavorite(idAthlete, req.body);
//         res.json(result);
//     } catch (err) {
//         res.json({error: err.message});
//     }
// });



module.exports = router;