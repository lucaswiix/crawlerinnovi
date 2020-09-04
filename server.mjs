import express from 'express';
import { crawlerByUrl } from './index.mjs';
export function initApp({ 
    port = process.env.PORT || 3000
} = {}) {
return new Promise(async (resolve) => {

    const app = express();
    app.get('/', (req, res) => res.status(200).send('ok'));

    app.get('/crawler', async (req, res) => {
        const { url } = req.query;
        if(!url || url.length < 10 || typeof url != 'string'){
            return res.status(400).json({
                error: 'invalid url'
            })
        }
        const data = await crawlerByUrl(url); 
        res.status(200).json(data);
    })
    app.listen(port, '0.0.0.0', () => {
        console.log(`running on port ${port}`);
        resolve(app); 
    });
})}

initApp();