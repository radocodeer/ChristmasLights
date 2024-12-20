const ModbusTCP = require('modbus-serial');

// Create Modbus client
const client = new ModbusTCP();

// Replace with your PLC's IP and port
const PLC_IP = "192.168.1.150";  // Your PLC IP address
const PLC_PORT = 502;            // Your PLC port (typically 502 for Modbus)

// Connect to the Modbus server (PLC)
client.connectTCP(PLC_IP, { port: PLC_PORT })
  .then(() => {
    console.log(`Connected to Modbus TCP server at ${PLC_IP}:${PLC_PORT}`);
    return readRegister();
  })
  .catch((error) => {
    console.error('Error connecting to Modbus server:', error);
  });

// Function to read the 6th register (at address 5, as Modbus starts at 0)
async function readRegister() {
  try {
    // Read 1 register (6th register, Modbus address 5)
    const response = await client.readHoldingRegisters(5, 1);
    
    // Log the value of the 6th register
    const registerValue = response.data[0];
    console.log(`Value of the 6th register: ${registerValue}`);

    // Convert the value (big-endian check can be done here based on how data is encoded)
    // You can perform byte-order adjustments if needed

    // Assuming we want to print its binary form (example)
    console.log('Binary value of the 6th register:', registerValue.toString(2));

    // Close the connection once done
    client.close();
  } catch (error) {
    console.error('Error reading Modbus registers:', error);
  }
}