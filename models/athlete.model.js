

// Métodos para lanzar las queries 

const { executeQuery, executeUniqueQuery } = require("../helpers");



// getById 

const getById = (athleteId) => {
         return executeUniqueQuery('SELECT * FROM athletes WHERE id = ?', 
         [athleteId]
    );
};


// get Email 

const getEmail = (fk_sponsors) => {
        return executeQuery('SELECT * FROM users WHERE fk_athlete = ?', 
        [fk_sponsors]
    );
}


// getAllOffers

const getAllOffers = (idAthlete) => {
    return executeQuery('SELECT ats.participations, ats.status, s.company, s.logo, ats.fk_athletes, ats.id FROM patronus.athletes_sponsors ats, patronus.sponsors s WHERE ats.fk_sponsors = s.id AND ats.fk_athletes = ? AND NOT ats.status = 2 ORDER BY ats.status ASC', 
    [idAthlete]);
}



// getOffersWaiting

const getOffersWaiting = (idAthlete) => {
    return executeQuery('SELECT ats.participations, ats.status, s.company, s.logo, ats.fk_athletes FROM patronus.athletes_sponsors ats, patronus.sponsors s WHERE ats.fk_sponsors = s.id AND ats.fk_athletes = ? AND ats.status = 0', 
    [idAthlete]);
}



// getOffersRejecteds 

const getOffersRejecteds = (idAthlete) => {
        return executeQuery('SELECT ats.participations, ats.status, s.company, s.logo, ats.fk_athletes FROM patronus.athletes_sponsors ats, patronus.sponsors s WHERE ats.fk_sponsors = s.id AND ats.fk_athletes = ? AND ats.status = 2', [idAthlete]
    );
}







// editProfile

const editDatesAthlete = (idAthlete, { name, surname, age, photo, sport, country, limitdate }) => {
        return executeQuery('UPDATE patronus.athletes SET name = ?, surname = ?, age = ?, photo = ?, sport = ?, country = ?, limitdate = ? WHERE id = ?', [name, surname, age, photo, sport, country, limitdate, idAthlete]
    );

}


const editDatesUser = (idAthlete, email) => {
        return executeQuery('UPDATE patronus.users SET email = ? WHERE fk_athlete = ?',
        [email, idAthlete]
    )
};


const acceptOffer = (idOffer) => {
        return executeQuery('UPDATE patronus.athletes_sponsors SET status = ? WHERE id = ?',
        [1, idOffer]
    )
};


const rejectOffer = (idOffer) => {
        return executeQuery('UPDATE patronus.athletes_sponsors SET status = ? WHERE id = ?',
        [2, idOffer]
    )
};



// sumar participaciones 

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



const getAthleteExists = (fk_sponsor, { email }) => {
    return executeQuery('SELECT * FROM patronus.users WHERE email = ? AND fk_sponsor = ?',
    [email, fk_sponsor]
)
};

// darse de baja

const deleteAccount = (idAthlete) => {
    return executeQuery('UPDATE patronus.athletes SET status = 0 WHERE id = ?', 
    [idAthlete]);
}



module.exports = {
    getAllOffers, getOffersWaiting, getOffersRejecteds, editDatesAthlete, getById, totalParticipations, deleteAccount, editDatesUser, updateParticipations, acceptOffer, updatePercentage, rejectOffer, createNew, getAthleteExists, getEmail
}
