const { executeQuery, executeUniqueQuery } = require("../helpers");



// crear atleta tabla athlete

const createAthlete = ({ nombre, apellidos, edad }) => {
        return executeQuery('INSERT INTO patronus.athletes (name, surname, age, country, sport, userinstagram, usertiktok, results) VALUES (?, ?, ?, ?, ?, ?, ?, 0)', [nombre, apellidos, edad, '', '', '', '']
    );
}



// crear sponsor tabla sponsor

const createSponsor = ({ empresa }) => {
        return executeQuery('INSERT INTO sponsors (company, status) VALUES (?, ?)', 
        [empresa, 1]
    );
}



// registrar usuario 

const registerUser = ({ email, password }, fk_athlete, fk_sponsor, role) => {
        return executeQuery('INSERT INTO USERS (email, password, fk_athlete, fk_sponsor, role, status) VALUES (?, ?, ?, ?, ?, 1)',
        [email, password, fk_athlete, fk_sponsor, role]
    );
}



// registrar tokens 

const introduceTokens = (idDeportista, {tokens, limitdate}) => {
        return executeQuery('UPDATE patronus.athletes SET quantityinit = ?, quantitydemand = ?, percentage = 0, limitdate = ? WHERE id = ?', 
        [tokens, tokens, limitdate, idDeportista]
    );
}



// recuperar usuario por email 

const getByEmail = (email) => {
        return executeUniqueQuery('SELECT * FROM users WHERE email = ?', 
        [email]
    );
};


// recuperar todos los atletas 

const getAllAthletes = () => {
        return executeQuery('SELECT * FROM patronus.athletes', 
        []
    );
}



// recuperar usuario atleta por id

const getByIdAthlete = (idAthlete) => {
    return executeUniqueQuery('SELECT * FROM users WHERE fk_athlete = ?',
    [idAthlete])
};



// recuperar usuario sponsor por id

const getByIdSponsor = (idSponsor) => {
    return executeUniqueQuery('SELECT * FROM users WHERE fk_sponsor = ?',
    [idSponsor])
};




const changeStatus = ({fk_athletes, fk_sponsors, participations, status, id}) => {
    return executeQuery('UPDATE patronus.athletes_sponsors SET fk_athletes = ?, fk_sponsors = ?, participations = ?, status = ? WHERE id = ?',
    [fk_athletes, fk_sponsors, participations, status, id]
);
}



// actualizar seguidores Intagram y TikTok

const updateFollowers = (followersInstagram, followersTikTok, id) => {
        return executeQuery('UPDATE patronus.athletes SET followersinstagram = ?, followerstiktok = ? WHERE id = ?',
        [followersInstagram, followersTikTok, id]
    )
};




// recuperar todas las noticias

const getAthletesNews = () => {
        return executeQuery('SELECT * FROM patronus.athletes_news ORDER BY date DESC',
        []
    )
};




// // borrar cuenta atleta

// const deleteAccountAthlete = (idAthlete) => {
//         return executeQuery('UPDATE patronus.users SET status = 0 WHERE fk_athlete = ?',
//         [idAthlete]
//     );
// }



// // borrar cuenta sponsor

// const deleteAccountSponsor = (idSponsor) => {
//         return executeQuery('UPDATE patronus.users SET status = 0 WHERE fk_sponsor = ?',
//         [idSponsor]
//     );
// };





module.exports = {
    getByEmail, createAthlete, createSponsor, registerUser, getByIdAthlete, getByIdSponsor, getAthletesNews, updateFollowers, getAllAthletes, introduceTokens, changeStatus
}