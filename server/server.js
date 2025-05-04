import express from 'express';
import {getAllTeams} from "./controllers/teamController.js";
import cors from 'cors'
import {getPlayers} from "./controllers/playersController.js";

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
}));
const PORT = 3030;

// Middleware to parse JSON request bodies
app.use(express.json());

// A basic GET route
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.get('/teams', getAllTeams);

app.get('/players', getPlayers)
// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
