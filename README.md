# Práctica DevOps
**Dominio:** https://nodepop.futnoid.es/

# Nodepop API
Nodepop es una App de publicación de anuncios desarrollada con [**NodeJS**](https://nodejs.org), [**Express**](http://expressjs.com) y el motor de base de datos, [**MongoBD**](https://www.mongodb.com/).
En el presente documento, explicamos como usar la API de la App.

## Instalación de depencencias
Para instalar las dependencias del proyecto tenemos que ejecutar el sisguiente comando:
`npm install`

## Instalación de la base de datos
Para poder utilizar la API, es necesario tener [instalado](https://docs.mongodb.com/manual/installation/) el motor de base de datos __MongoDB__,lo podemos descargar [_aquí_](https://www.mongodb.com/download-center?jmp=nav#community), independientemente del sistema operativo(Windows, MacOs, Linux) que estemos usando.
 
Una vez instalado MongoDB, si no hemos indicado durante el proceso de instalación cual es la ruta donde se va a crear nuestra base de datos y por lo tanto, crear nuestros documentos, lo hacemos de la siguiente manera:
1. Creamos la cartpeta donde se va crear la base datos. Por ejemplo, _c:\data\db_
`mkdir c:\data\db`
2. Arrancamos MongoDB, indicandole donde debe arrancar(carpeta creada en el paso anterior)Podemos crearnos un script de arraque para facilitar la tarea.(1).
`mongod --dbpath C:\data\db --directoryperdb`
**NOTA: Es importante estar situado en la directorio donde se encuentra el archivo binaro encargado de ejecutar el comando(mongo) de arranque del servidor**
3. Instalar los datos de ejemplo. Esto lo hacemos, ejecutando el siguiente comando:
`npm run installDatabase`

Realizados estos pasos, ya podemos consultar los datos de ejemplo cargados en la base de datos.

(1)Ejemplo de script en Windows(.bat):
```bat
cd C:\Program Files\MongoDB\Server\3.6\bin
mongod --dbpath C:\data\db --directoryperdb
```

## Arrancar el servidor (NodeJS)
Podemos arrancar el servidor según el entorno en el que estemos trabajando. Existen tres modos:
* __Modo cluster:__ `npm run start-cluster`
* __Modo debug:__ `npm run start-debug`
* __Modo normal:__ `npm run start`

## Documentación del API
___
A continuación, se explica como consultar los usuarios, anuncios y tags almacenados. Además, de cómo realizar el inicio de sesión y registro de un usuario.

**NOTA: Para realizar las consultas, excepto el inicio de sesión y registro, es necesario proporcionar el token dado al realizar el login. El tiempo de duracón del token es de 2 días.**

## Usuarios
Este apartado explica como realizar las peticiones GET y POST para obtener información sobre el usuario, realizar el registro y el inicio de sesión.

### Métodos POST
#### Registro
Para registrarse en la App(crear un usuario), es necesario realizar una petición POST a la URL:

`http://localhost:3000/api/1.0/users/register`

Pasando en el body, los siguientes parámetros:
* **name:** Nombre de usuario.
* **email:** Email del usuario a registrar.
* **password:** Contraseña del usuario a registrar.

Ejemplo petición:
```POST
http://localhost:3000/api/1.0/users/register
name=NOMBRE_INGRESADO
email=EMAIL_INGRESADO
password=PASSWORD_INGRESADA
```
Ejemplo respuesta:
```JSON
{
    "success": true,
    "result": {
        "_id": "5b42458a153cbd128c0ef826",
        "name": "Fran",
        "email": "fran@prueba.com",
        "password": "92490182b2bb9722ec3c082b8f00547c",
        "cypheredOptions": {
            "key": {
                "type": "Buffer",
                "data": [
                    4, 190, 29, 125, 122, 38, 129, 174, 145, 123, 227, 146, 43, 82, 67, 74, 158, 80, 42, 84, 92, 203, 221, 201, 130, 181, 201, 236, 68, 245, 178, 230]
            },
            "iv": {
                "type": "Buffer",
                "data": [70, 32, 172, 194, 127, 130, 196, 3, 173, 121, 2, 93, 121, 70, 240, 94]
            }
        },
        "__v": 0
    }
}
```

#### Inciar sesión
Para iniciar sesión en la App, es necesario realizar una petición POST a la URL:

`http://localhost:3000/api/1.0/users/login`

Pasando en el body, los siguientes parámetros:
* **email:** Email del usuario.
* **password:** Contraseña del usuario.

Ejemplo petición:
```POST
http://localhost:3000/api/1.0/users/login
email=EMAIL_USUARIO
password=PASSWORD_USUARIO
```
Ejemplo respuesta:
```JSON
{
    "result": {
        "succes": true,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWI0MjQ5Njc4NzdiNzEyOGJjNzMzYTYyIiwiaWF0IjoxNTMxMDcyMjc3LCJleHAiOjE1MzEyNDUwNzd9.5IVX9uGL2XnA_eu4f04TrFcwmiIyKi55cFVaAIq1cFU"
    }
}
```

### Métodos GET

#### Lista de usuaios
Para obtener el listado de usuarios de la App, es necesario realizar una petición GET a la URL:

`http://localhost:3000/api/1.0/users?token=MI_TOKEN_DE_SESION`

Pasando en la URL los siguientes datos:
* **MI_TOKEN_DE_SESION:** Es el token proporcionado en el inicio de sesión.

Ejemplo petición:
```POST
http://localhost:3000/api/1.0/users?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWI0MGU3YTRjZDM2YTEwMjk0NmU3MWU5IiwiaWF0IjoxNTMxMDAzNjU1LCJleHAiOjE1MzExNzY0NTV9.w3y3BhG0EmXiCX8PdIZX-gfqnQse6duEdH7Oq-2RPKs
```
Ejemplo respuesta:
```JSON
{
    "success": true,
    "result": [
        {
            "_id": "5b423a17bb619258acddf90c",
            "name": "Juan",
            "firstSurname": "Narváez",
            "secondSurname": "Florencio",
            "birthday": "2018-07-01T23:28:56.782Z",
            "country": "España",
            "province": "Sevilla",
            "city": "Sevilla",
            "email": "test1@prueba.com",
            "modifiedAt": "2018-07-01T23:28:56.782Z",
            "createdAt": "2018-07-01T23:28:56.782Z",
            "__v": 0
        },
        {
            "_id": "5b423a17bb619258acddf90d",
            "name": "Roberto",
            "firstSurname": "Gil",
            "secondSurname": "Gracia",
            "birthday": "2018-07-01T23:28:56.782Z",
            "country": "España",
            "province": "Zaragoza",
            "city": "Zaragoza",
            "email": "test2@prueba.com",
            "modifiedAt": "2018-07-01T23:28:56.782Z",
            "createdAt": "2018-07-01T23:28:56.782Z",
            "__v": 0
        },
        {
            "_id": "5b424967877b7128bc733a62",
            "name": "Fran",
            "email": "fran@prueba.com",
            "__v": 0
        }
    ]
}
```

#### Información sobre un  usuaio
Para obtener la información de un usuario de la App, es necesario realizar una petición GET a la URL:

`http://localhost:3000/api/1.0/email/users?token=MI_TOKEN_DE_SESION`

Pasando en la URL los siguientes datos:
* **email:** Email sobre el que se quiere ver la información.
* **MI_TOKEN_DE_SESION:** Es el token proporcionado en el inicio de sesión.

Ejemplo petición:
```POST
http://localhost:3000/api/1.0/users/fran@prueba.com?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWI0MGU3YTRjZDM2YTEwMjk0NmU3MWU5IiwiaWF0IjoxNTMxMDAzNjU1LCJleHAiOjE1MzExNzY0NTV9.w3y3BhG0EmXiCX8PdIZX-gfqnQse6duEdH7Oq-2RPKs
```
Ejemplo respuesta:
```JSON
{
    "success": true,
    "result": [
        {
            "_id": "5b424967877b7128bc733a62",
            "name": "Fran",
            "email": "fran@prueba.com",
            "__v": 0
        }
    ]
}
```

## Anuncios
Este apartado explica como realizar las peticiones GET para obtener información sobre los anuncios.
___
### Métodos GET
### Filtros
Podemos concatenar filtros añadiendo el campo a filtrar, '=', y el valor del filtro seguido de '&'.

`http://localhost:3000/api/1.0/advertisements?filtro1=valorFlitro1&filtro2=valorFiltro2`
#### Listado de anuncios sin 
Para obtener el listado de anuncios de la App, es necesario realizar una petición GET a la URL:

`http://localhost:3000/api/1.0/advertisements?token=MI_TOKEN_DE_SESION`

Pasando en la URL los siguientes datos:
* **MI_TOKEN_DE_SESION:** Es el token proporcionado en el inicio de sesión.

Ejemplo petición:
```POST
http://localhost:3000/api/1.0/advertisements?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWI0MGU3YTRjZDM2YTEwMjk0NmU3MWU5IiwiaWF0IjoxNTMxMDAzNjU1LCJleHAiOjE1MzExNzY0NTV9.w3y3BhG0EmXiCX8PdIZX-gfqnQse6duEdH7Oq-2RPKs
```
Ejemplo respuesta:
```JSON
{
    "success": true,
    "result": [
        {
            "photo": [
                "images/anuncios/bici.jpg"
            ],
            "tags": [
                "lifestyle",
                "motor"
            ],
            "_id": "5b423a19bb619258acddf90e",
            "name": "Bicicleta",
            "price": 230.15,
            "sale": true,
            "user": "5b423a17bb619258acddf90c",
            "datePublished": "2018-07-01T23:28:56.782Z",
            "modifiedAt": "2018-07-01T23:28:56.782Z",
            "createdAt": "2018-07-01T23:28:56.782Z",
            "__v": 0
        },
        {
            "photo": [
                "images/anuncios/iphone.png"
            ],
            "tags": [
                "lifestyle",
                "mobile"
            ],
            "_id": "5b423a19bb619258acddf90f",
            "name": "iPhone 3GS",
            "price": 50,
            "sale": false,
            "user": "5b423a17bb619258acddf90d",
            "datePublished": "2018-07-01T23:28:56.782Z",
            "modifiedAt": "2018-07-01T23:28:56.782Z",
            "createdAt": "2018-07-01T23:28:56.782Z",
            "__v": 0
        }
    ]
}
```
#### Paginar anuncios
Para obtener el listado paginado de anuncios, es necesario realizar una petición GET a la URL:

`http://localhost:3000/api/1.0/advertisements?skip=NUMBER_SKIP&limit=NUMBER_LIMIT&token=MI_TOKEN_DE_SESION`

Pasando en la URL los siguientes datos:
* **NUMBER_SKIP:** Es el número de anucios a saltar.
* **NUMBER_LIMIT:** Número máximo de anuncios a mostrar.
* **MI_TOKEN_DE_SESION:** Es el token proporcionado en el inicio de sesión.

Ejemplo petición:
```POST
http://localhost:3000/api/1.0/advertisements?skip=0&limit=1&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWI0MGU3YTRjZDM2YTEwMjk0NmU3MWU5IiwiaWF0IjoxNTMxMDAzNjU1LCJleHAiOjE1MzExNzY0NTV9.w3y3BhG0EmXiCX8PdIZX-gfqnQse6duEdH7Oq-2RPKs
```
Ejemplo respuesta:
```JSON
{
    "success": true,
    "result": [
        {
            "photo": [
                "images/anuncios/bici.jpg"
            ],
            "tags": [
                "lifestyle",
                "motor"
            ],
            "_id": "5b423a19bb619258acddf90e",
            "name": "Bicicleta",
            "price": 230.15,
            "sale": true,
            "user": "5b423a17bb619258acddf90c",
            "datePublished": "2018-07-01T23:28:56.782Z",
            "modifiedAt": "2018-07-01T23:28:56.782Z",
            "createdAt": "2018-07-01T23:28:56.782Z",
            "__v": 0
        }
    ]
}
```
#### Buscar por nombre
Para un anuncio por su nombre o comience por una letra o palabra concreta, es necesario realizar una petición GET a la URL:

`http://localhost:3000/api/1.0/advertisements?name=NOMBRE_A_BUSCAR&token=MI_TOKEN_DE_SESION`

Pasando en la URL los siguientes datos:
* **NOMBRE_A_BUSCAR:** Nombre del anuncio que queremos buscar.
* **MI_TOKEN_DE_SESION:** Es el token proporcionado en el inicio de sesión.

Ejemplo petición:
```POST
http://localhost:3000/api/1.0/advertisements?name=Bi&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWI0MGU3YTRjZDM2YTEwMjk0NmU3MWU5IiwiaWF0IjoxNTMxMDAzNjU1LCJleHAiOjE1MzExNzY0NTV9.w3y3BhG0EmXiCX8PdIZX-gfqnQse6duEdH7Oq-2RPKs
```
Ejemplo respuesta:
```JSON
{
    "success": true,
    "result": [
        {
            "photo": [
                "images/anuncios/bici.jpg"
            ],
            "tags": [
                "lifestyle",
                "motor"
            ],
            "_id": "5b423a19bb619258acddf90e",
            "name": "Bicicleta",
            "price": 230.15,
            "sale": true,
            "user": "5b423a17bb619258acddf90c",
            "datePublished": "2018-07-01T23:28:56.782Z",
            "modifiedAt": "2018-07-01T23:28:56.782Z",
            "createdAt": "2018-07-01T23:28:56.782Z",
            "__v": 0
        }
    ]
}
```
#### Buscar por precio
Para obtener el listado los anuncios filtrado por su precio, es necesario realizar una petición GET a una de las siguientes URLs:

`http://localhost:3000/api/1.0/advertisements?price=PRICEtoken=MI_TOKEN_DE_SESION` 
`http://localhost:3000/api/1.0/advertisements?maxprice=PRICEtoken=MI_TOKEN_DE_SESION`
`http://localhost:3000/api/1.0/advertisements?minprice=PRICEtoken=MI_TOKEN_DE_SESION`

Pasando en la URL los datos:
* **PRICE:** Es el precio para buscar un artículo.
> price, Muestra los anuncios del precio igual price.
> maxprice, Muestra los anuncios cuyo precio sea menor a maxprice.
> minprice, Muestra los anuncios cuyo precio sea mayor a minprice.
* **MI_TOKEN_DE_SESION:** Es el token proporcionado en el inicio de sesión.

Ejemplo petición:
```POST
http://localhost:3000/api/1.0/advertisements?maxprice=50&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWI0MGU3YTRjZDM2YTEwMjk0NmU3MWU5IiwiaWF0IjoxNTMxMDAzNjU1LCJleHAiOjE1MzExNzY0NTV9.w3y3BhG0EmXiCX8PdIZX-gfqnQse6duEdH7Oq-2RPKs
```
Ejemplo respuesta:
```JSON
{
    "success": true,
    "result": [
        {
            "photo": [
                "images/anuncios/iphone.png"
            ],
            "tags": [
                "lifestyle",
                "mobile"
            ],
            "_id": "5b423a19bb619258acddf90f",
            "name": "iPhone 3GS",
            "price": 50,
            "sale": false,
            "user": "5b423a17bb619258acddf90d",
            "datePublished": "2018-07-01T23:28:56.782Z",
            "modifiedAt": "2018-07-01T23:28:56.782Z",
            "createdAt": "2018-07-01T23:28:56.782Z",
            "__v": 0
        }
    ]
}
```
#### Buscar por tag
Para obtener el listado de tags de los anuncios, es necesario realizar una petición GET a la URL:

`http://localhost:3000/api/1.0/advertisements/tags?token=MI_TOKEN_DE_SESION`

Pasando en la URL los siguientes datos:
* **MI_TOKEN_DE_SESION:** Es el token proporcionado en el inicio de sesión.

Ejemplo petición:
```POST
http://localhost:3000/api/1.0/advertisements/tags?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWI0MGU3YTRjZDM2YTEwMjk0NmU3MWU5IiwiaWF0IjoxNTMxMDAzNjU1LCJleHAiOjE1MzExNzY0NTV9.w3y3BhG0EmXiCX8PdIZX-gfqnQse6duEdH7Oq-2RPKs
```
Ejemplo respuesta:
```JSON
{
    "success": true,
    "result": [
        "lifestyle",
        "motor",
        "mobile"
    ]
}
```