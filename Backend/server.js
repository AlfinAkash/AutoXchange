const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const salesRoutes = require('./routes/salesRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const filterRoutes = require('./routes/filterRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const brokerRoutes = require('./routes/brokerRoutes');
const exportRoutes = require('./routes/exportRoutes');


dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: [
    'https://autoxchange.netlify.app'
    
  ],
  credentials: true
}));

app.use('/api/v2/auth', authRoutes);
app.use('/api/v2/purchase', purchaseRoutes);
app.use('/api/v2/sales', salesRoutes);
app.use('/api/v2/maintenance', maintenanceRoutes);
app.use('/api/v2/upload', uploadRoutes);
app.use('/api/v2/filters', filterRoutes);
app.use('/api/v2/summary', summaryRoutes);
app.use('/api/v2/broker', brokerRoutes);
app.use('/api/v2/export', exportRoutes);

app.get('/', (req, res) => {
  res.send('AutoXchange backend server is Running');
});

// app.use((req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AutoXchange Server running on port ${PORT}`));

