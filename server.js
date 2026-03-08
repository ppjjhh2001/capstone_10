import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: '10.60.1.74', 
    user: 'root',       
    password: '1234',  
    database: 'tourism_site'   
});

app.get('/api/regional', (req, res) => {
    const sql = "SELECT * FROM tourist_spots";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        const formatted = results.map(item => ({
            id: String(item.id),
            name: item.name,
            category: item.category,
            address: item.address,
            phone: item.phone,
            hours: item.hours,
            closed: item.closed,
            parking: item.parking,
            imageUrl: item.image_url,
            lat: item.lat,
            lng: item.lng,
            regionKey: item.region_key,
            cityKey: item.city_key
        }));
        res.json(formatted);
    });
});
