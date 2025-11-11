document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const getDirectionsBtn = document.getElementById('getDirectionsBtn');
    const agentResponseDiv = document.getElementById('agentResponse');
    const statusMessageDiv = document.getElementById('statusMessage');

    // --- 1. MAP INITIALIZATION ---
    // VFSTR Coordinates (Approximate Center: 16.233° N, 80.551° E)
    const VIGNAN_CENTER = [16.233, 80.551];
    const initialZoom = 15; // Zoom level suitable for campus view

    // Initialize the Leaflet map
    const map = L.map('mapContainer').setView(VIGNAN_CENTER, initialZoom);

    // Add OpenStreetMap tiles to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker for the main campus entrance (A-Block area)
    L.marker(VIGNAN_CENTER).addTo(map)
        .bindPopup("<b>Vignan University Campus Center</b>")
        .openPopup();
        
    let currentRouteLayer = null; // To store the drawn route layer for clearing

    // --- 2. EVENT LISTENER FOR AGENT CALL ---
    getDirectionsBtn.addEventListener('click', async () => {
        const goal = userInput.value.trim();

        if (goal === "") {
            alert("Please enter your navigation goal!");
            return;
        }

        // 2.1. Show Loading State
        agentResponseDiv.innerHTML = '';
        statusMessageDiv.textContent = 'Agent is planning your multi-step route and checking real-time data...';
        statusMessageDiv.style.visibility = 'visible';
        getDirectionsBtn.disabled = true;

        // Clear previous route
        if (currentRouteLayer) {
            map.removeLayer(currentRouteLayer);
        }

        try {
            // 2.2. Simulate API Call and Agent Planning
            await new Promise(resolve => setTimeout(resolve, 2000)); 

            // SIMULATED VIGNAN AGENT RESPONSE DATA
            const agentPlan = [
                { step: 1, action: "Goal Decomposition", detail: "Broken down into: 1) Go to Vignan NTR Library, 2) Find Dean-Student Affairs Office." },
                { step: 2, action: "Information Retrieval (RAG)", detail: "Confirmed Dean-Student Affairs Office is in the **Administrative Block (A-Block)**, 2nd Floor." },
                { step: 3, action: "Navigation Tool Use", detail: "Calculated walking route from your location to **Library** (8 mins). **Path 1/2**." },
                { step: 4, action: "Navigation Tool Use", detail: "Calculated efficient transition from Library to **A-Block Stairwell** (4 mins). **Path 2/2**." },
                { step: 5, action: "Final Output", detail: "Total estimated time: 14 minutes. Route is highlighted in **Red** on the map." }
            ];

            // SIMULATED ROUTE DATA (Dummy GPS coordinates for demonstration)
            // Replace these with actual coordinates of your simulated route points on campus
            const simulatedRoute = [
                [16.2335, 80.5520], // Start Point (near a Hostel)
                [16.2325, 80.5515], // Mid-point (near Library)
                [16.2330, 80.5505]  // End Point (near A-Block)
            ];

            // 2.3. Display the Plan and Route
            displayAgentPlan(agentPlan);
            displayRouteOnMap(simulatedRoute);
            
            statusMessageDiv.textContent = 'V-AGA Directions Ready!';
            statusMessageDiv.style.backgroundColor = '#d4edda'; 
            statusMessageDiv.style.color = '#155724';
            
        } catch (error) {
            // ... Error handling remains the same
            console.error("Agent communication failed:", error);
            statusMessageDiv.textContent = 'Error: Could not connect to Agent backend.';
            statusMessageDiv.style.backgroundColor = '#f8d7da'; 
            statusMessageDiv.style.color = '#721c24';
        } finally {
            getDirectionsBtn.disabled = false;
        }
    });

    // --- 3. HELPER FUNCTIONS ---

    // Function to format and display the plan in the HTML
    function displayAgentPlan(plan) {
        let htmlContent = '<h3>✅ V-AGA Plan Executed:</h3>';
        htmlContent += '<ol>';
        plan.forEach(item => {
            htmlContent += `<li><strong>${item.action}:</strong> ${item.detail}</li>`;
        });
        htmlContent += '</ol>';
        htmlContent += '<p>Follow the **Red Highlighted Route** on the map, Vignanite!</p>';
        agentResponseDiv.innerHTML = htmlContent;
    }

    // Function to draw the simulated route on the Leaflet map
    function displayRouteOnMap(coordinates) {
        // Create a polyline (the route line)
        currentRouteLayer = L.polyline(coordinates, {
            color: 'red',
            weight: 5,
            opacity: 0.7
        }).addTo(map);

        // Add markers for the start and end points
        L.marker(coordinates[0], { icon: L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], tooltipAnchor: [16, -28], shadowSize: [41, 41] }) }).addTo(map).bindPopup("Start Location");
        L.marker(coordinates[coordinates.length - 1], { icon: L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], tooltipAnchor: [16, -28], shadowSize: [41, 41] }) }).addTo(map).bindPopup("Final Destination");

        // Fit the map view to the bounds of the route
        map.fitBounds(currentRouteLayer.getBounds());
    }

});