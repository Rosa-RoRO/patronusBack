

// métodos para lanzar las queries 

const { executeQuery, executeUniqueQuery } = require("../helpers");



// recuperar atleta por id 

const getById = (athleteId) => {
         return executeUniqueQuery('SELECT * FROM athletes WHERE id = ?', 
         [athleteId]
    );
};


// recuperar email por id 

const getEmail = (fk_athlete) => {
        return executeQuery('SELECT * FROM users WHERE fk_athlete = ?', 
        [fk_athlete]
    );
}


const getEmailAthlete = (fk_athlete) => {
    return executeQuery('SELECT email FROM patronus.users WHERE fk_athlete = ?',
    [fk_athlete]
    )
};



// recuperar todas las ofertas de un atleta

const getAllOffers = (idAthlete) => {
    return executeQuery('SELECT ats.participations, ats.status, s.company, s.logo, ats.fk_athletes, ats.id FROM patronus.athletes_sponsors ats, patronus.sponsors s WHERE ats.fk_sponsors = s.id AND ats.fk_athletes = ? AND NOT ats.status = 2 ORDER BY ats.status ASC', 
    [idAthlete]);
}



// recuperar todas las ofertas a la espera de respuesta

const getOffersWaiting = (idAthlete) => {
    return executeQuery('SELECT ats.participations, ats.status, s.company, s.logo, ats.fk_athletes FROM patronus.athletes_sponsors ats, patronus.sponsors s WHERE ats.fk_sponsors = s.id AND ats.fk_athletes = ? AND ats.status = 0', 
    [idAthlete]);
}



// recuperar todas las ofertas rechazadas 

const getOffersRejecteds = (idAthlete) => {
        return executeQuery('SELECT ats.participations, ats.status, s.company, s.logo, ats.fk_athletes FROM patronus.athletes_sponsors ats, patronus.sponsors s WHERE ats.fk_sponsors = s.id AND ats.fk_athletes = ? AND ats.status = 2', [idAthlete]
    );
}



// editar perfil tabla athletes

const editDatesAthlete = (idAthlete, { name, surname, age, photo, sport, country, userinstagram, usertiktok }) => {
        return executeQuery('UPDATE patronus.athletes SET name = ?, surname = ?, age = ?, photo = ?, sport = ?, country = ?, userinstagram = ?, usertiktok = ? WHERE id = ?', [name, surname, age, photo, sport, country, userinstagram, usertiktok, idAthlete]
    );

}



// editar perfil tabla users

const editDatesUser = (idAthlete, email) => {
        return executeQuery('UPDATE patronus.users SET email = ? WHERE fk_athlete = ?',
        [email, idAthlete]
    )
};



// aceptar oferta


const acceptOffer = (idOffer) => {
        return executeQuery('UPDATE patronus.athletes_sponsors SET status = ? WHERE id = ?',
        [1, idOffer]
    )
};


// rechazar oferta

const rejectOffer = (idOffer) => {
        return executeQuery('UPDATE patronus.athletes_sponsors SET status = ? WHERE id = ?',
        [2, idOffer]
    )
};



// total participaciones compradas a un atleta

const totalParticipations = (fk_ahtletes) => {
    return executeQuery('SELECT SUM(participations) as "total" FROM patronus.athletes_sponsors WHERE fk_athletes = ? AND NOT status = 2',
    [fk_ahtletes]
   )
};



// actualizar participaciones tabla athlete 

const updateParticipations = (quantityDemand, fk_athletes) => {
        return executeQuery('UPDATE patronus.athletes SET quantitydemand = ? WHERE id = ?',
        [quantityDemand, fk_athletes]
    );
}



// actualizar porcentaje conseguido tabla athlete 

const updatePercentage = (percentageTotal, fk_athlete) => {
        return executeQuery('UPDATE patronus.athletes SET percentage = ? WHERE id = ?',
        [percentageTotal, fk_athlete]
    )
};



// crear noticia 

const createNew = (fk_athletes, {username, summary, photo, date}) => {
        return executeQuery('INSERT INTO patronus.athletes_news (fk_athletes, username, summary, photo, date) VALUES (?, ?, ?, ?, ?)',
        [fk_athletes, username, summary, photo, date]
    )   
};


// // ???????????????

// const getAthleteExists = (fk_sponsor, { email }) => {
//     return executeQuery('SELECT * FROM patronus.users WHERE email = ? AND fk_sponsor = ?',
//     [email, fk_sponsor]
// )
// };



// reset password 

const resetPassword = ({password}, fk_athlete) => {
    return executeQuery('UPDATE patronus.users SET password = ? WHERE fk_athlete = ?',
    [password, fk_athlete]
    )
};


// darse de baja

const deleteAccount = (idAthlete) => {
    return executeQuery('UPDATE patronus.athletes SET status = 0 WHERE id = ?', 
    [idAthlete]);
}



module.exports = {
    getAllOffers, getOffersWaiting, getOffersRejecteds, editDatesAthlete, getById, totalParticipations, deleteAccount, editDatesUser, updateParticipations, acceptOffer, updatePercentage, rejectOffer, createNew, getEmail, getEmailAthlete, resetPassword
}
