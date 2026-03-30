const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID;

app.get('/api/avaliacoes', async (req, res) => {
    try {
        const url = `https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        const resultado = {
            nome: data.displayName?.text,
            nota: data.rating,
            total: data.userRatingCount,
            avaliacoes: data.reviews || []
        };

        res.json(resultado);

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});