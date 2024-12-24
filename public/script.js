// JavaScript to create snowflakes
function createSnowflakes() {
    const snowContainer = document.querySelector('.snow-container');
    
    setInterval(function() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`; // Random duration between 5s and 10s
        snowflake.style.animationDelay = `${Math.random() * 10}s`; // Random delay

        snowContainer.appendChild(snowflake);

        // Remove snowflake once it's out of view
        setTimeout(() => {
            snowflake.remove();
        }, 15000); // Snowflake lasts for 15 seconds
    }, 100); // Create a new snowflake every 100ms
}

// Start the snow effect
createSnowflakes();

// JavaScript
const bgMusic = new Audio('/music.mp3');
bgMusic.loop = true; // Loop the music

function updateDateTime() { 
    const dateTimeElement = document.getElementById('current-datetime'); 

    if (dateTimeElement) {
        const now = new Date(); // Format the date and time 
        const formattedDate = now.toLocaleDateString(); // E.g., "12/20/2024" 
        const formattedTime = now.toLocaleTimeString(); // E.g., "10:30:45 AM" 
        // Update the span with formatted date and time 
        dateTimeElement.textContent = `${formattedDate}, ${formattedTime}`; 
    } 
} 

// Call the function to set the initial date and time 
updateDateTime(); 

// Optionally, update the time every second to keep it current 
setInterval(updateDateTime, 1000);  


// Function to toggle the register state and send a request to the server
function toggleRegister(index) {    

    bgMusic.play(); // Start playing    
    const currentState = document.getElementById(`btn-${index}`).dataset.state;
    const newState = currentState === '1' ? 0 : 1; // Toggle the state

    // Send the updated state to the server
    fetch(`/update-register/${index}/${newState}`, {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update the button color based on the new state
                const button = document.getElementById(`btn-${index}`);
                button.dataset.state = newState.toString();
            } else {
                console.error('Error updating register:', data.error);
            }
        })
        .catch(error => console.error('Error toggling register:', error));
}




// Periodically check button states
function updateButtonStates() {
    fetch('/registers')
        .then(response => response.json())
        .then(data => {
            data.forEach((state, index) => {
                const button = document.getElementById(`btn-${index}`); // Corrected line here
                if (button) {
                    button.dataset.state = state.toString(); // Update the button's data-state attribute
                    //console.log(button.dataset.state);
                }
            });
        })
        .catch(error => console.error('Error fetching register states:', error));
}

function updateCircleColors(registerValue) {
    for (let i = 8; i < 16; i++) {
        const circle = document.getElementById(`circle-${i}`);
        //console.log("regVal " + registerValue);
        if (circle) {
            //console.log("circle " + circle);
            // Determine the state of the circle based on the register value
            if (registerValue & (1 << i)) {
                circle.classList.add('active');
                circle.classList.remove('inactive');
            } else {
                circle.classList.add('inactive');
                circle.classList.remove('active');
            }

        }
    }
}


// Periodically fetch the value of the 6th register and update circle colors
function fetchAndUpdateRegister() {
    fetch('/registers')
        .then(response => response.json())
        .then(data => {
            // The 6th register value is located at the 5th index in the array
            const registerValue = data[5]; // Assuming register 6 corresponds to the 6th entry in the array (index 5)
            console.log("data is:" + registerValue);  // Log the value to console for debugging
            updateCircleColors(registerValue);
        })
        .catch(error => console.error('Error fetching register states:', error));
}


if (true) {
    // Refresh button states every 1 second
    setInterval(updateButtonStates, 1000);
    // Call the function to start fetching and updating periodically (every 1 second)
    setInterval(fetchAndUpdateRegister, 1000);
}