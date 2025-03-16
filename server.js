import express from 'express';
import { get } from 'axios';

const app = express();
const PORT = 4000;

// Base URL for the Quran API
const QURAN_API_BASE_URL = 'https://api.alquran.cloud/v1';

// Endpoint to fetch Surahs with pagination
app.get('/surah', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page

        // Fetch all Surahs from the Quran API
        const response = await get(`${QURAN_API_BASE_URL}/surah`);
        const allSurahs = response.data.data;

        // Calculate pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedSurahs = allSurahs.slice(startIndex, endIndex);

        // Construct the response with pagination metadata
        const totalItems = allSurahs.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        res.json({
            code: 200,
            status: 'OK',
            data: {
                surahs: paginatedSurahs,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    pageSize: pageSize,
                    totalItems: totalItems
                }
            }
        });
    } catch (error) {
        console.error('Error fetching Surahs:', error.message);
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