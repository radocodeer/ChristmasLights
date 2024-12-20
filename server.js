const express = require('express');
const bodyParser = require('body-parser');
const ModbusTCP = require('modbus-serial');

const app = express();
const port = 800;

let rado = 9;

// Create Modbus client
const modbusClient = new ModbusTCP();
modbusClient.connectTCP("192.168.1.150", { port: 502 }); // Replace with your PLC IP
modbusClient.setID(1);

let registers = [0, 0, 0, 0, 0, 0]; // Initial state of 5 holding registers

app.use(bodyParser.json());
app.use(express.static('public'));

// Function to read registers from Modbus
async function readRegisters() {
    try {
        // Read 5 registers starting from address 0
        const data = await modbusClient.readHoldingRegisters(0, 6);
        registers = data.data; // Store the register values in the registers array
        //console.log("Register values read from PLC:", registers); // Debug log
        readRegister();
    } catch (error) {
        console.error('Error reading Modbus registers:', error);
    }
}

// Read registers every 1 second
setInterval(readRegisters, 1000);

// Endpoint to fetch all register states
app.get('/registers', (req, res) => {
    //console.log("Register states sent to client:", registers); // Debug log
    res.json(registers);
});

// Endpoint to write to a specific register with the enforced rules
app.post('/update-register/:index/:value', async (req, res) => {
    const index = parseInt(req.params.index, 10); // Register index (0-4)
    const value = parseInt(req.params.value, 10); // New value to write to the register

    if (index < 0 || index > 4) {
        return res.status(400).json({ error: 'Invalid register index' });
    }

    if (value === 1 && index === 0) {
        // Register 1 (index 0) can toggle independently
        registers[0] = 1; // Set to 1
    } else if (value === 0 && index === 0) {
        // Register 1 (index 0) can toggle independently
        registers[0] = 0; // Set to 0
    } else if (value === 1 && index >= 1 && index <= 4) {
        // If register is from 2 to 5 (index 1-4), enforce mutual exclusion
        registers = [registers[0], 0, 0, 0, 0]; // Reset registers 2-5 to 0
        registers[index] = 1; // Set selected register to 1
    } else if (value === 0 && index >= 1 && index <= 4) {
        // If the value is 0 for registers 2-5, just update that register
        registers[index] = 0;
    }

    try {
        // Write the updated registers to the Modbus PLC
        await modbusClient.writeRegisters(0, registers); // Update all registers
        console.log(`Register values updated:`, registers);
        res.json({ success: true });
    } catch (error) {
        console.error('Error writing Modbus registers:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Function to read the 6th register (at address 5, as Modbus starts at 0)
async function readRegister() {
    try {
      // Read 1 register (6th register, Modbus address 5)
      const response = await modbusClient.readHoldingRegisters(5, 1);
      
      // Log the value of the 6th register
      const registerValue = response.data[0];
      //console.log(`Value of the 6th register: ${registerValue}`);
  
      // Convert the value (big-endian check can be done here based on how data is encoded)
      // You can perform byte-order adjustments if needed
  
      // Assuming we want to print its binary form (example)
      //console.log('Binary :', registerValue.toString(2));
        
    } catch (error) {
      console.error('Error reading Modbus registers:', error);
    }
  }


// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});