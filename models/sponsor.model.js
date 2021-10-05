const { executeUniqueQuery, executeQuery } = require("../helpers");


const getById = (idSponsor) => {
        return executeUniqueQuery('SELECT * FROM patronus.sponsors WHERE id = ?', 
        [idSponsor]
    );
}


// todos los atletas

const getAll = () => {
        return executeQuery('SELECT * FROM athletes ORDER BY limitdate ASC', 
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


// mis deportistas

const getMyAthletes = (idSponsor) => {
        return executeQuery('SELECT ats.participations, ats.status, s.company, at.name, at.surname, at.age, at.country, at.sport, s.logo, ats.fk_athletes FROM patronus.athletes_sponsors ats, patronus.sponsors s, patronus.athletes at WHERE ats.fk_sponsors = s.id AND ats.fk_athletes = at.id AND ats.fk_sponsors = ? AND ats.status = 1', 
        [idSponsor]
    );
}



// ofertas enviadas 

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




// ordenar atletas por %invertido 


const orderByPercentage = () => {
    return executeQuery('SELECT name, surname, age, photo, sport, country, quantitydemand, percentage, limitdate, graphic FROM patronus.athletes ORDER BY percentage DESC', []
    );
}


// ordenar atletas por fecha de expiración de la inversión

const orderByLimitdate = () => {
    return executeQuery('SELECT * FROM patronus.athletes WHERE limitdate > now() ORDER by limitdate ASC', []
    );
}


// recuperar atletas por país

const getAthletesByCountry = (nameCountry) => {
    return executeQuery('SELECT * FROM patronus.athletes WHERE country = ?',
    [nameCountry]
    )
};


// recuperar atletas por deporte

const getAthletesBySport = (nameSport) => {
    return executeQuery('SELECT * FROM patronus.athletes WHERE sport = ?',
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
    return executeQuery('SELECT * FROM patronus.athletes WHERE limitdate < now()', 
    []
    )
};


// recuperar los países a los que pertecenen los athletes

const getCountries = () => {
    return executeQuery('SELECT DISTINCT country FROM patronus.athletes', 
    []
    );
}


// recuperar todos los deportes de los atletas

const getSports = () => {
    return executeQuery('SELECT DISTINCT sport FROM patronus.athletes',
    []
    );
}

// recuperar los deportes favoritos de los sponsors

const getSportsSponsors = () => {
    return executeQuery('SELECT item_id, item_text FROM patronus.sports', 
    []
    )
};


// recuperar los deportes favoritos de un sponsor

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

    
    // recuperar email por id
    
    const getEmailSponsor = (fk_sponsor) => {
        return executeQuery('SELECT email FROM patronus.users WHERE fk_sponsor = ?',
        [fk_sponsor]
        );
    };
    
    
    
    
    // comprobar si el atleta es favorito

    const athleteIsFavorite = (idAthlete, idSponsor) => {
        return executeQuery('SELECT * FROM patronus.favorites WHERE fk_athletes = ? AND fk_sponsors = ? AND favorite = 1',
        [idAthlete, idSponsor]
        )
    };
    
    
    
    // atletas en tendencia 
    
    const trendsAthletes = () => {
        return executeQuery('SELECT at.id, at.name, at.surname, at.age, at.country, at.sport, at.photo, at.limitdate, at.quantitydemand, at.percentage FROM patronus.athletes_sponsors ats, patronus.athletes at, patronus.sponsors s WHERE ats.fk_athletes = at.id AND ats.fk_sponsors = s.id AND at.limitdate > now() ORDER BY ats.createdate DESC',
        []
        )
    };
    
    
    // recomendaciones  ----------------------------------
    
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
    
    
    
    // darse de baja

    const deleteAccount = (idSponsor) => {
        return executeQuery('UPDATE patronus.sponsors SET status = 0 WHERE id = ?', [idSponsor]);
    }
    

    
    module.exports = {
        getMyAthletes, getMyAllOffers, getMyOffersRejecteds, editSponsor, getById, offerById, deleteAccount, editUser, getAll, getAthleteById, orderByPercentage, orderByLimitdate, newOffer, getAthletesByCountry, getAthletesBySport, getInvertible, getCountries, getSports, getNoInvertibles, addAthleteFavorite, getMyAthletesFavorites, getSportsSponsors, getFavoriteSportsSponsors, addSportFavorite, getEmailSponsor, AthletesByTokens, AthletesByResults, athleteIsFavorite, revertFavorite, getAthleteSponsors, AthletesByCountry, getTimeOutAthletes, resetPassword, trendsAthletes

}