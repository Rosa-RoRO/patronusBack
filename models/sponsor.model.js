const { executeUniqueQuery, executeQuery } = require("../helpers");


const getById = (idSponsor) => {
        return executeUniqueQuery('SELECT * FROM patronus.sponsors WHERE id = ?', 
        [idSponsor]
    );
}


// todos los atletas

const getAll = () => {
        return executeQuery('SELECT * FROM athletes', 
        []
    );
}


// todos los atletas caducados

const getTimeOutAthletes = () => {
        return executeQuery('SELECT * FROM athletes WHERE limitdate < now()',
        []
    )
};


// atleta por Id

const getAthleteById = (athleteId) => {
        return executeUniqueQuery('SELECT * FROM athletes where id = ?', 
        [athleteId]
    );
};


// get Sponsors By Athlete 

const getAthleteSponsors = (idAthlete) => {
    return executeQuery('SELECT ats.participations, ats.status, s.company, s.logo, ats.fk_athletes FROM patronus.athletes_sponsors ats, patronus.sponsors s WHERE ats.fk_sponsors = s.id AND ats.fk_athletes = ? AND ats.status = 1', [idAthlete]
);
}


// mis deportistas = ofertas aceptadas

const getMyAthletes = (idSponsor) => {
        return executeQuery('SELECT ats.participations, ats.status, s.company, at.name, at.surname, at.age, at.country, at.sport, s.logo, ats.fk_athletes FROM patronus.athletes_sponsors ats, patronus.sponsors s, patronus.athletes at WHERE ats.fk_sponsors = s.id AND ats.fk_athletes = at.id AND ats.fk_sponsors = ? AND ats.status = 1', 
        [idSponsor]
    );
}



// ofertas enviadas esperando a que respondan los atletas

const getMyAllOffers = (idSponsor) => {
        return executeQuery('SELECT ats.participations, ats.status, s.company, at.name, at.surname, at.age, at.country, at.sport, s.logo, at.limitdate, ats.fk_athletes FROM patronus.athletes_sponsors ats, patronus.sponsors s, patronus.athletes at WHERE ats.fk_sponsors = s.id AND ats.fk_athletes = at.id AND ats.fk_sponsors = ? ORDER BY limitdate ASC', 
        [idSponsor]
    );
}



// ofertas rechazadas

const getMyOffersRejecteds = (idSponsor) => {
        return executeQuery('SELECT ats.participations, ats.status, s.company, s.logo, ats.fk_athletes FROM patronus.athletes_sponsors ats, patronus.sponsors s WHERE ats.fk_sponsors = s.id AND ats.fk_sponsors = ? AND ats.status = 2',
        [idSponsor]
    );
}




// editar perfil 

const editSponsor = (idSponsor, {company, logo, country, address, city, postalcode, aboutme}) => {
        return executeQuery('UPDATE patronus.sponsors SET company = ?, logo = ?, country = ?, address = ?, city = ?, postalcode = ?, aboutme = ? WHERE id = ?',
        [company, logo, country, address, city, postalcode, aboutme, idSponsor],
    );
}

const editUser = (idSponsor, {email}) => {
        return executeQuery('UPDATE patronus.users SET email = ? WHERE fk_sponsor = ?',
        [email, idSponsor]
    );
}


// nueva oferta

const newOffer = (fk_sponsors, {fk_athletes, participations, createdate}) => {
        return executeQuery('INSERT INTO patronus.athletes_sponsors (fk_athletes, fk_sponsors, participations, createdate, status) VALUES (?, ?, ?, ?, ?)',
        [fk_athletes, fk_sponsors, participations, createdate, 0]
    );
}



// recuperar una única oferta por id

const offerById = (id) => {
        return executeUniqueQuery('SELECT * FROM patronus.athletes_sponsors WHERE id = ?', 
        [id]
    );
}



// darse de baja
const deleteAccount = (idSponsor) => {
    return executeQuery('UPDATE patronus.sponsors SET status = 0 WHERE id = ?', [idSponsor]);
}


// ordenar atletas por %invertido 


const orderByPercentage = () => {
        return executeQuery('SELECT name, surname, age, photo, sport, country, quantitydemand, percentage, limitdate, graphic, followers FROM patronus.athletes ORDER BY percentage DESC', []
    );
}

// ordenar atletas por fecha de expiración de la inversión


const orderByLimitdate = () => {
    return executeQuery('SELECT * FROM patronus.athletes WHERE limitdate > now() ORDER by limitdate ASC', []
);
}


// Recuperar athletes por country

const getAthletesByCountry = (nameCountry) => {
        return executeQuery('SELECT * FROM patronus.athletes WHERE country = ?',
        [nameCountry]
    )
};

// Recuperar athletes por sport

const getAthletesBySport = (nameSport) => {
        return executeQuery('SELECT * FROM patronus.athletes WHERE SPORT = ?',
        [nameSport]
    )
};

// recuperar athletes invertibles

const getInvertible = () => {
        return executeQuery('SELECT * FROM patronus.athletes WHERE limitdate > now()', 
        []
    )
};


// recuperar athletes no invertibles

const getNoInvertibles = () => {
        return executeQuery('SELECT * FROM patronus.athletes WHERE limitdate < now() AND quantitydemand > 0', 
        []
    )
};


// recuperar los países a los que pertecenen los athletes

const getCountries = () => {
        return executeQuery('SELECT DISTINCT country FROM patronus.athletes', 
        []
    );
}


const getSports = () => {
        return executeQuery('SELECT DISTINCT sport FROM patronus.athletes',
        []
    );
}

const getSportsSponsors = () => {
        return executeQuery('SELECT item_id, item_text FROM patronus.sports', 
        []
    )
};

const getFavoriteSportsSponsors = (fk_sponsors) => {
        return executeQuery('SELECT s.item_id, s.item_text FROM patronus.sports s, patronus.sponsors_sports ss WHERE ss.fk_sponsors = ? AND s.item_id = ss.fk_sport', 
        [fk_sponsors]
    )
};



// añadir deporte favorito 

const addSportFavorite = (fk_sponsors, fk_sport) => {
    return executeQuery('INSERT INTO patronus.sponsors_sports (fk_sponsors, fk_sport) VALUES (?, ?)', 
    [fk_sponsors, fk_sport]
)
};



// añadir atleta favorito 

const addAthleteFavorite = (fk_athletes,  fk_sponsors) => {
        return executeQuery('INSERT INTO patronus.favorites (fk_athletes, fk_sponsors, favorite) VALUES (?, ?, 1)',
        [fk_athletes, fk_sponsors]
    );
}


// quitar atleta favorito 

const revertFavorite = (fk_athletes, fk_sponsors) => {
        return executeQuery('UPDATE patronus.favorites SET favorite = 0 WHERE fk_athletes = ? AND fk_sponsors = ?',
        [fk_athletes, fk_sponsors]
    )
}



// recuperar mis atletas favoritos

const getMyAthletesFavorites = (fk_sponsors) => {
        return executeQuery('SELECT at.id, at.age, at.name, at.surname, at.sport, at.country, at.percentage, at.quantitydemand FROM patronus.athletes at, patronus.favorites f WHERE fk_sponsors = ? AND f.fk_athletes = at.id AND favorite = 1',
        [fk_sponsors]
    )
}


// const getSponsorExists = (fk_sponsor, { email }) => {
//         return executeQuery('SELECT * FROM patronus.users WHERE email = ? AND fk_sponsor = ?',
//         [email, fk_sponsor]
//     )
// };



const getEmailSponsor = (fk_athlete) => {
        return executeQuery('SELECT email FROM patronus.users WHERE fk_sponsor = ?',
        [fk_athlete]
    );
};




// Comprobar si es favorito

const athleteIsFavorite = (idAthlete, idSponsor) => {
        return executeQuery('SELECT * FROM patronus.favorites WHERE fk_athletes = ? AND fk_sponsors = ? AND favorite = 1',
        [idAthlete, idSponsor]
    )
};



// Atletas en tendencia 

const trendsAthletes = () => {
        return executeQuery('SELECT at.id, at.name, at.surname, at.age, at.country, at.sport, at.photo, at.limitdate, at.quantitydemand, at.percentage FROM patronus.athletes_sponsors ats, patronus.athletes at, patronus.sponsors s WHERE ats.fk_athletes = at.id AND ats.fk_sponsors = s.id AND at.limitdate > now() ORDER BY ats.createdate DESC',
        []
    )
};


// Recomendaciones  ----------------------------------

const AthletesByTokens = (rangoIniTokens, rangoFinTokens, idAthlete) => {
        return executeQuery('SELECT * FROM patronus.athletes WHERE quantitydemand BETWEEN ? AND ? AND NOT id = ? AND limitdate > now()', 
        [rangoIniTokens, rangoFinTokens, idAthlete]
    )
};

const AthletesByCountry = (idAthlete, country) => {
        return executeQuery('SELECT * FROM patronus.athletes WHERE country = ? AND NOT id = ? AND limitdate > now()', 
        [country, idAthlete]
    )
};


const AthletesByResults = (idAthlete, rangoIniRendimiento, rangoFinRendimiento) => {
        return executeQuery('SELECT * FROM patronus.athletes WHERE results BETWEEN ? AND ? AND NOT id = ? AND limitdate > now()', 
        [rangoIniRendimiento, rangoFinRendimiento, idAthlete]
    )
};


// reset password 

const resetPassword = ({password}, fk_sponsor) => {
    return executeQuery('UPDATE patronus.users SET password = ? WHERE fk_sponsor = ?',
    [password, fk_sponsor]
    )
};



module.exports = {
    getMyAthletes, getMyAllOffers, getMyOffersRejecteds, editSponsor, getById, offerById, deleteAccount, editUser, getAll, getAthleteById, orderByPercentage, orderByLimitdate, newOffer, getAthletesByCountry, getAthletesBySport, getInvertible, getCountries, getSports, getNoInvertibles, addAthleteFavorite, getMyAthletesFavorites, getSportsSponsors, getFavoriteSportsSponsors, addSportFavorite, getEmailSponsor, AthletesByTokens, AthletesByResults, athleteIsFavorite, revertFavorite, getAthleteSponsors, AthletesByCountry, getTimeOutAthletes, resetPassword, trendsAthletes

}