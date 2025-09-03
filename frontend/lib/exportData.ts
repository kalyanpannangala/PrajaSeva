import { Pool } from 'pg';
import { jwtDecode } from 'jwt-decode';

// --- Database Configuration ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface JwtPayload {
    user_id?: string;
    uid?: string;
    sub?: string;
    // Add an index signature to allow for any other properties in the token
    [key: string]: any;
}

// This function can now be used by both the data API and the PDF API
export async function getExportData(token: string, services: string[]) {
    if (!token) {
        throw new Error('Authentication token not provided.');
    }
    const decoded = jwtDecode<JwtPayload>(token);
    
    // --- FIX: Using the correct key 'userId' found from the server logs ---
    const userId = decoded.user_id || decoded.uid || decoded.sub || decoded.userId;
    
    if (!userId) {
        // This error should no longer occur with the correct key.
        throw new Error('Could not identify user from the authentication token. Check server logs for token details.');
    }

    if (!services || !Array.isArray(services) || services.length === 0) {
        throw new Error('Please select at least one service to export.');
    }

    const client = await pool.connect();
    try {
        const dataPromises: { [key: string]: Promise<any> } = {
            // This query will now use the correctly identified user ID.
            personalInfo: client.query(
                `SELECT 
                    p.full_name, p.email, si.age, si.gender, si.state 
                 FROM 
                    profiles p 
                 LEFT JOIN 
                    schemes_input si ON p.user_id = si.user_id 
                 WHERE 
                    p.user_id = $1`, [userId]
            ),
        };

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

        // --- Structure the Final JSON Response ---
        const exportData: any = {};
        const personalInfoData = results.personalInfo[0] || {};
        exportData.personalInfo = {
            name: personalInfoData.full_name || 'N/A',
            email: personalInfoData.email || 'N/A',
            age: personalInfoData.age || 'N/A',
            gender: personalInfoData.gender || 'N/A',
            state: personalInfoData.state || 'N/A',
        };

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

        exportData.details = {};
        if (services.includes('schemes')) {
            exportData.details.schemes = results.schemes || [];
        }
        if (services.includes('tax')) {
            exportData.details.tax = results.tax ? results.tax[0] : {};
        }
        if (services.includes('wealth')) {
            exportData.details.wealth = results.wealth ? results.wealth[0] : {};
        }

        return exportData;
    } finally {
        client.release();
    }
}

