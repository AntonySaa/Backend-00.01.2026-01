const http = require('http');
const axios = require('axios');
let url = require('url');
require('dotenv').config();

const PORT = process.env.PORT;

let config = {};

let server = http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    let path = q.pathname;
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = requestUrl.searchParams;

    switch(path) {
        case '/api/github':
            let user = searchParams.get('user');

            if (!user) {
                res.writeHead(400, {"Content-Type": "application/json"});
                return res.end(JSON.stringify({
                    error: "Falta parámetro 'user'"
                }));
            }

            config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://api.github.com/users/${user}`,
            };

            axios.request(config)
                .then((response) => {
                    res.writeHead(200, {'Content-Type': 'application/json'});

                    res.end(JSON.stringify({
                        success: true,
                        data: response.data
                    }));
                })
                .catch((error) => {
                    if(error.response && error.response.status === 404) {
                        res.writeHead(404, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "GitHub user not found"
                        }));
                    } else {
                        res.writeHead(500, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "Internal server error"
                        }));
                    }
                });

            break;
        case '/api/clima':
            let ciudad = searchParams.get('ciudad');
            config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://weather-api99.p.rapidapi.com/weather?city=${ciudad}`,
                headers: {
                    'x-rapidapi-host': 'weather-api99.p.rapidapi.com',
                    'x-rapidapi-key': process.env.RAPIDKEY
                }
            };
            
            axios.request(config)
                .then((response) => {
                   res.writeHead(200, {'Content-Type': 'application/json'});

                   res.end(JSON.stringify({
                    success: true,
                    data: response.data
                   }));
                })
                .catch((error) => {
                    console.log(error);
                });
            
            break;
        case '/api/tipo_cambio':
            config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://open.er-api.com/v6/latest/USD`,
            };

            axios.request(config)
                .then((response) => {
                    res.writeHead(200, {'Content-Type': 'application/json'});

                    res.end(JSON.stringify({
                        success: true,
                        data: response.data.rates.PEN
                    }));
                })
                .catch((error) => {
                    if(error.response && error.response.status === 404) {
                        res.writeHead(404, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "API not found"
                        }));
                    } else {
                        res.writeHead(500, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "Internal server error"
                        }));
                    }
                });

            break;
        case '/api/pokemon':
            let offset = searchParams.get('offset');
            let limit = searchParams.get('limit');

            if (!offset) {
                offset = 0;
            }

            if (!limit) {
                limit = 20;
            }

            config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
            };

            axios.request(config)
                .then((response) => {
                    res.writeHead(200, {'Content-Type': 'application/json'});

                    res.end(JSON.stringify({
                        success: true,
                        data: response.data
                    }));
                })
                .catch((error) => {
                    if(error.response && error.response.status === 404) {
                        res.writeHead(404, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "API not found"
                        }));
                    } else {
                        res.writeHead(500, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "Internal server error"
                        }));
                    }
                });

            break;
        case '/api/pokemon_powers':
            let pokemonName = searchParams.get('pokemon_name');

            config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
            };

            axios.request(config)
                .then((response) => {
                    res.writeHead(200, {'Content-Type': 'application/json'});

                    res.end(JSON.stringify({
                        success: true,
                        data: response.data.moves
                    }));
                })
                .catch((error) => {
                    if(error.response && error.response.status === 404) {
                        res.writeHead(404, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "Pokemon not found"
                        }));
                    } else {
                        res.writeHead(500, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "Internal server error"
                        }));
                    }
                });

            break;
        case '/api/rick_morty':
            let page = searchParams.get('page');

            if (!page) {
                page = 1;
            }

            config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://rickandmortyapi.com/api/character?page=${page}`,
            };

            axios.request(config)
                .then((response) => {
                    res.writeHead(200, {'Content-Type': 'application/json'});

                    res.end(JSON.stringify({
                        success: true,
                        data: response.data
                    }));
                })
                .catch((error) => {
                    if(error.response && error.response.status === 404) {
                        res.writeHead(404, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "API not found"
                        }));
                    } else {
                        res.writeHead(500, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "Internal server error"
                        }));
                    }
                });

            break;
        case '/api/rick_morty_details':
            let characterId = searchParams.get('id');

            if (!characterId) {
                res.writeHead(400, {"Content-Type": "application/json"});
                return res.end(JSON.stringify({
                    error: "Falta parámetro 'id'"
                }));
            }

            config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://rickandmortyapi.com/api/character/${characterId}`,
            };

            axios.request(config)
                .then((response) => {
                    res.writeHead(200, {'Content-Type': 'application/json'});

                    res.end(JSON.stringify({
                        success: true,
                        data: response.data
                    }));
                })
                .catch((error) => {
                    if(error.response && error.response.status === 404) {
                        res.writeHead(404, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "Character not found"
                        }));
                    } else {
                        res.writeHead(500, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "Internal server error"
                        }));
                    }
                });

            break;
        case '/api/top_cocktails':
            config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic`,
            };

            axios.request(config)
                .then((response) => {
                    res.writeHead(200, {'Content-Type': 'application/json'});

                    res.end(JSON.stringify({
                        success: true,
                        data: response.data
                    }));
                })
                .catch((error) => {
                    if(error.response && error.response.status === 404) {
                        res.writeHead(404, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "API not found"
                        }));
                    } else {
                        res.writeHead(500, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "Internal server error"
                        }));
                    }
                });

            break;
        case '/api/store_products':
             config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://fakestoreapi.com/products`,
            };

            axios.request(config)
                .then((response) => {
                    res.writeHead(200, {'Content-Type': 'application/json'});

                    res.end(JSON.stringify({
                        success: true,
                        data: response.data
                    }));
                })
                .catch((error) => {
                    if(error.response && error.response.status === 404) {
                        res.writeHead(404, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "API not found"
                        }));
                    } else {
                        res.writeHead(500, {'Content-Type': 'application/json'});

                        res.end(JSON.stringify({
                            error: "Internal server error"
                        }));
                    }
                });

            break;
        case '/api/pictures':
            let topic = searchParams.get('topic') || 'nature';
            let size = searchParams.get('size') || 400;

            config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://api.unsplash.com/search/photos?query=${topic}&per_page=5`,
                headers: {
                    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
                }
            };

            axios.request(config)
                .then((response) => {
                    const images = response.data.results.map(photo => ({
                        id: photo.id,
                        image: `${photo.urls.raw}&w=${size}&h=${size}&fit=crop`
                    }));

                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        success: true,
                        total: images.length,
                        data: images
                    }));
                })
                .catch((error) => {
                    if(error.response && error.response.status === 404) {
                        res.writeHead(404, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({
                            error: "API not found"
                        }));
                    } else {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({
                            error: "Internal server error"
                        }));
                    }
                });

            break;
        case '/api/citas':
            config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://zenquotes.io/api/random`,
            };

            axios.request(config)
                .then((response) => {
                    const quote = response.data[0];
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        success: true,
                        data: {
                            quote: quote.q,
                            author: quote.a
                        }
                    }));
                })
                .catch((error) => {
                    if(error.response && error.response.status === 404) {
                        res.writeHead(404, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({
                            error: "API not found"
                        }));
                    } else {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({
                            error: "Internal server error"
                        }));
                    }
                });

            break;
        case '/api/usuario_ficticio':
            config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://randomuser.me/api/`,
            };

            axios.request(config)
                .then((response) => {
                    const user = response.data.results[0];

                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        success: true,
                        data: {
                            name: `${user.name.first} ${user.name.last}`,
                            email: user.email,
                            country: user.location.country,
                            city: user.location.city,
                            picture: user.picture.large
                        }
                    }));
                })
                .catch((error) => {
                    if(error.response && error.response.status === 404) {
                        res.writeHead(404, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({
                            error: "API not found"
                        }));
                    } else {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({
                            error: "Internal server error"
                        }));
                    }
                });

            break;
        case '/api/peliculas_estreno':
            config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`,
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_TOKEN}`
                }
            };

            axios.request(config)
                .then((response) => {
                    const movies = response.data.results.map(movie => ({
                        id: movie.id,
                        title: movie.title,
                        release_date: movie.release_date,
                        rating: movie.vote_average,
                        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    }));

                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        success: true,
                        total: movies.length,
                        data: movies
                    }));

                })
                .catch((error) => {
                    if(error.response && error.response.status === 404) {
                        res.writeHead(404, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({
                            error: "API not found"
                        }));
                    } else {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({
                            error: "Internal server error"
                        }));
                    }
                });

            break;
        case '/api/detalle_pelicula':
            let movieId = searchParams.get('id');

            config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_TOKEN}`
                }
            };

            axios.request(config)
                .then((response) => {
                    const movie = response.data;
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        success: true,
                        data: {
                            title: movie.title,
                            overview: movie.overview,
                            release_date: movie.release_date,
                            rating: movie.vote_average,
                            runtime: movie.runtime,
                            genres: movie.genres.map(g => g.name),
                            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                            backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                        }
                    }));
                })
                .catch((error) => {
                    if(error.response && error.response.status === 404) {
                        res.writeHead(404, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({
                            error: "Movie not found"
                        }));
                    } else {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({
                            error: "Internal server error"
                        }));
                    }
                });

            break;
        case '/api/marte':
            config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://api.nasa.gov/insight_weather/?api_key=${process.env.NASA_KEY || "DEMO_KEY"}&feedtype=json&ver=1.0`,
            };

            axios.request(config)
                .then((response) => {
                    const sols = response.data.sol_keys;

                    const weather = sols.map(sol => ({
                        sol: sol,
                        avg_temp: response.data[sol].AT?.av,
                        min_temp: response.data[sol].AT?.mn,
                        max_temp: response.data[sol].AT?.mx,
                        wind_speed: response.data[sol].HWS?.av,
                        pressure: response.data[sol].PRE?.av
                    }));

                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({
                        success: true,
                        total_days: weather.length,
                        data: weather
                    }));
                })
                .catch((error) => {
                    if(error.response && error.response.status === 404) {
                        res.writeHead(404, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({
                            error: "API not found"
                        }));
                    } else {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({
                            error: "Internal server error"
                        }));
                    }
                });

            break;
        default:
            res.writeHead(404, {'Content-Type': 'application/json'});

            res.end(JSON.stringify({
                error: "Endpoint not found"
            }));

            break;
    }
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando el puerto ${PORT}`);
});