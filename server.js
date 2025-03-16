import express from 'express';
import axios from 'axios';


const app = express();
const PORT = 4000;

// Base URL for the Quran API
const QURAN_API_BASE_URL = 'https://api.alquran.cloud/v1';

// Endpoint to fetch Surahs with pagination
app.get('/surah', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // Fetch all Surahs from the Quran API
        const response = await axios.get(`${QURAN_API_BASE_URL}/surah`);
        console.log("Fetched data:", response.data); // Log API response

        const allSurahs = response.data.data;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedSurahs = allSurahs.slice(startIndex, endIndex);

        res.json({
            code: 200,
            status: 'OK',
            data: {
                surahs: paginatedSurahs,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(allSurahs.length / pageSize),
                    pageSize: pageSize,
                    totalItems: allSurahs.length
                }
            }
        });
    } catch (error) {
        console.error('Error fetching Surahs:', error); // Log full error
        res.status(500).json({
            code: 500,
            status: 'Internal Server Error',
            message: 'Failed to fetch Surahs'
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});