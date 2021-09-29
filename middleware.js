// Simples manejadores de rutas que nosotros intercalamos entre el código que tenemos creado 

// Los middleware SIEMPRE van a tener la misma forma --> req, res y next

const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const { getById } = require('./models/athlete.model');
const { getByIdAthlete, getByIdSponsor } = require('./models/user.model');


const checkToken = async (req, res, next) => {
    // 1 - Comprobamos si existe el token dentro de la cabecera de mi petición;
        // El req.headers me devuelve todos los valores de la cabecera que tenga asociada mi petición.     
    const token = req.headers['authorization'];
    if (!token) {
        return res.json({ error: 'Debes incluir la cabecera de autenticación' });
    }

    // 2 - Desencriptamos el token (puede que este sí que tenga valores pero que esté mal);
    let payload;
    try {
        payload = jwt.verify(token, process.env.SECRET_KEY);
        console.log(payload); 
    } catch (error) {
        return res.json({ error: 'El token es incorrecto' });
    }

    // 3 - Comprobar si el token está caducado;
    if(payload.expired_at < dayjs().unix()) {
        return res.json({ error: 'El token está caducado' });
    }

    // 4 - Recuperar el usuario logueado;
    let user;
    if(payload.user_role === 'A'){
        user = await getByIdAthlete(payload.user_id);
    } else if (payload.user_role === 'S') {
        user = await getByIdSponsor(payload.user_id);
    } 
    req.user = user;
    next();
}



const checkRol = (role) => {
    return (req, res, next) => {
        console.log('esto middle', req.user);
        if(req.user.role !== role) {
            return res.json({ error: "No dispones de permisos para acceder a este recurso" });
        }
        next();
    }
}




module.exports = { checkToken, checkRol };




// NOTA: 

    /*      

        TODOS los middlewares SIEMPRE tienen la misma estructura: 
            const x = (req, res, next) => {}
 
    */