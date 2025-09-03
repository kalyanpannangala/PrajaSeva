import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg'; // Or your specific database client
import { jwtDecode } from 'jwt-decode';

// --- Database Configuration ---
// Replace with your actual database connection details
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface JwtPayload {
    user_id: string;
    // other properties from your token
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // --- 1. Authentication and User ID Extraction ---
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authentication token not provided.' });
        }
        const decoded = jwtDecode<JwtPayload>(token);
        const userId = decoded.user_id;

        // --- 2. Get Selected Services from Request Body ---
        const { services } = req.body; // e.g., ['schemes', 'tax', 'wealth']
        if (!services || !Array.isArray(services) || services.length === 0) {
            return res.status(400).json({ error: 'Please select at least one service to export.' });
        }

        const client = await pool.connect();

        // --- 3. Fetch All Necessary Data Concurrently ---
        const dataPromises: { [key: string]: Promise<any> } = {
            // Always fetch personal info from 'profiles' and 'schemes_input' tables
            personalInfo: client.query(
                `SELECT 
                    p.full_name, p.email, si.age, si.gender, si.state 
                 FROM 
                    profiles p 
                 JOIN 
                    schemes_input si ON p.user_id = si.user_id 
                 WHERE 
                    p.user_id = $1`, [userId]
            ),
        };

        // Conditionally fetch results for selected services
        if (services.includes('schemes')) {
            dataPromises.schemes = client.query('SELECT scheme_id, scheme_name FROM schemes WHERE user_id = $1', [userId]);
        }
        if (services.includes('tax')) {
            dataPromises.tax = client.query('SELECT tax_saving, recommended_regime FROM tax WHERE user_id = $1', [userId]);
        }
        if (services.includes('wealth')) {
            dataPromises.wealth = client.query('SELECT projected_corpus, inflation_adjusted_corpus, projection_data FROM wealth WHERE user_id = $1', [userId]);
        }

        const fetchedResults = await Promise.all(Object.values(dataPromises));
        const fetchedKeys = Object.keys(dataPromises);
        
        const results: { [key: string]: any } = {};
        fetchedKeys.forEach((key, index) => {
            results[key] = fetchedResults[index].rows;
        });

        client.release();

        // --- 4. Structure the Final JSON Response ---
        const exportData: any = {};

        // Personal Information
        const personalInfoData = results.personalInfo[0] || {};
        exportData.personalInfo = {
            name: personalInfoData.full_name || 'N/A',
            email: personalInfoData.email || 'N/A',
            age: personalInfoData.age || 'N/A',
            gender: personalInfoData.gender || 'N/A',
            state: personalInfoData.state || 'N/A',
        };

        // Overview Section (dynamic based on selection)
        exportData.overview = {};
        if (services.includes('schemes') && results.schemes) {
            const schemesList = results.schemes;
            exportData.overview.schemes = {
                total: schemesList.length,
                central: schemesList.filter((s: any) => s.scheme_id.startsWith('C')).length,
                state: schemesList.filter((s: any) => !s.scheme_id.startsWith('C')).length,
            };
        }
        if (services.includes('tax') && results.tax && results.tax[0]) {
            exportData.overview.tax = {
                taxSaved: results.tax[0].tax_saving || '0',
                bestRegime: results.tax[0].recommended_regime || 'N/A',
            };
        }
        if (services.includes('wealth') && results.wealth && results.wealth[0]) {
            exportData.overview.wealth = {
                projectedCorpus: results.wealth[0].projected_corpus || '0',
            };
        }

        // Detailed Data Section
        exportData.details = {};
        if (services.includes('schemes')) {
            exportData.details.schemes = results.schemes || [];
        }
        if (services.includes('tax')) {
            // You might want to fetch more detailed tax data here if needed
            exportData.details.tax = results.tax ? results.tax[0] : {};
        }
        if (services.includes('wealth')) {
            // The full projection data table
            exportData.details.wealth = results.wealth ? results.wealth[0] : {};
        }

        res.status(200).json(exportData);

    } catch (error) {
        console.error('Error fetching export data:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
}

