import app from './app';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});