// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const gameDisplay = document.getElementById('gameDisplay');
const newRecommendationButton = document.getElementById('newRecommendation');

// Sample games database with high-quality images
const games = [
    {
        name: "Subway Surfers",
        description: "An endless runner mobile game where players run through subway tracks while dodging obstacles and collecting coins.",
        players: "1",
        playTime: "5-15",
        rating: "4.8",
        complexity: "easy",
        category: "mobile",
        image: "subway.jpg"
    },
    {
        name: "Among Us",
        description: "A multiplayer social deduction game where players work together to complete tasks while trying to identify the impostors.",
        players: "4-10",
        playTime: "10-15",
        rating: "4.7",
        complexity: "easy",
        category: "social",
        image: "AmongUs.jpg"
    },
    {
        name: "Minecraft",
        description: "A sandbox game where players can build, explore, and survive in a blocky, procedurally generated 3D world.",
        players: "1-8",
        playTime: "unlimited",
        rating: "4.9",
        complexity: "medium",
        category: "sandbox",
        image: "Mine craft.jpg"
    },
    {
        name: "Fortnite",
        description: "A battle royale game where players fight to be the last person standing while building structures and using various weapons.",
        players: "1-100",
        playTime: "20-30",
        rating: "4.5",
        complexity: "medium",
        category: "battle royale",
        image: "fronite.jpg"
    },
    {
        name: "Roblox",
        description: "A platform where players can create and play millions of user-generated 3D experiences.",
        players: "1-100",
        playTime: "unlimited",
        rating: "4.6",
        complexity: "easy",
        category: "platform",
        image: "roblox.jpg"
    }
];

// Chat state
let chatState = {
    waitingForPreferences: true,
    preferences: {
        genre: null,
        players: null,
        complexity: null
    }
};

// Event Listeners
sendButton.addEventListener('click', handleUserMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserMessage();
    }
});
newRecommendationButton.addEventListener('click', startNewRecommendation);

// Functions
function handleUserMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        userInput.value = '';
        processUserMessage(message);
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    if (chatState.waitingForPreferences) {
        handlePreferenceInput(message);
    } else {
        // Handle other conversation states
        if (lowerMessage.includes('yes') || lowerMessage.includes('another') || lowerMessage.includes('more')) {
            // Recommend another game without resetting preferences
            recommendGame();
        } else if (lowerMessage.includes('no') || lowerMessage.includes('stop')) {
            setTimeout(() => {
                addMessage("Would you like to start over with new preferences?", 'bot');
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("Would you like to try another recommendation? (yes/no)", 'bot');
            }, 1000);
        }
    }
}

function handlePreferenceInput(message) {
    const lowerMessage = message.toLowerCase();
    
    if (!chatState.preferences.genre) {
        // Check for genre preferences
        const genres = ['action', 'adventure', 'puzzle', 'strategy', 'sports', 'racing'];
        const matchedGenre = genres.find(genre => lowerMessage.includes(genre));
        
        if (matchedGenre) {
            chatState.preferences.genre = matchedGenre;
            setTimeout(() => {
                addMessage(`Great! You like ${matchedGenre} games. How many players do you usually play with?`, 'bot');
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("What type of games do you enjoy? (action, adventure, puzzle, strategy, sports, racing)", 'bot');
            }, 1000);
        }
    } else if (!chatState.preferences.players) {
        // Check for player count
        const playerCount = message.match(/\d+/);
        if (playerCount) {
            chatState.preferences.players = playerCount[0];
            setTimeout(() => {
                addMessage(`Got it! ${playerCount[0]} players. Do you prefer easy, medium, or complex games?`, 'bot');
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("Please tell me how many players you usually play with (e.g., 2, 4, etc.)", 'bot');
            }, 1000);
        }
    } else if (!chatState.preferences.complexity) {
        // Check for complexity preference
        const complexities = ['easy', 'medium', 'complex'];
        const matchedComplexity = complexities.find(complexity => lowerMessage.includes(complexity));
        
        if (matchedComplexity) {
            chatState.preferences.complexity = matchedComplexity;
            recommendGame();
        } else {
            setTimeout(() => {
                addMessage("Please choose between easy, medium, or complex games.", 'bot');
            }, 1000);
        }
    }
}

function recommendGame() {
    // Filter games based on preferences
    let recommendedGames = games.filter(game => {
        return (
            (!chatState.preferences.genre || game.category.includes(chatState.preferences.genre)) &&
            (!chatState.preferences.players || game.players.includes(chatState.preferences.players)) &&
            (!chatState.preferences.complexity || game.complexity === chatState.preferences.complexity)
        );
    });

    // If no exact match, show all games
    if (recommendedGames.length === 0) {
        recommendedGames = games;
    }

    // Randomly select a game
    const recommendedGame = recommendedGames[Math.floor(Math.random() * recommendedGames.length)];

    // Show the recommendation
    showGameRecommendation(recommendedGame);
    
    // Add the recommendation message to the existing chat
    setTimeout(() => {
        addMessage(`Based on your preferences, I recommend ${recommendedGame.name}! Would you like to try another recommendation? (yes/no)`, 'bot');
    }, 1000);
}

function showGameRecommendation(game) {
    gameDisplay.innerHTML = `
        <div class="game-card">
            <img src="${game.image}" alt="${game.name}" style="width: 100%; height: 200px; object-fit: cover;">
            <h2>${game.name}</h2>
            <p>${game.description}</p>
            <div class="game-details">
                <span><i class="fas fa-users"></i> ${game.players} players</span>
                <span><i class="fas fa-clock"></i> ${game.playTime} minutes</span>
                <span><i class="fas fa-star"></i> ${game.rating}/5</span>
            </div>
            <div class="game-category">
                <span class="category-tag">${game.category}</span>
                <span class="complexity-tag">${game.complexity}</span>
            </div>
        </div>
    `;
    gameDisplay.classList.add('active');
}

function startNewRecommendation() {
    // Reset chat state
    chatState = {
        waitingForPreferences: true,
        preferences: {
            genre: null,
            players: null,
            complexity: null
        }
    };

    // Hide game display
    gameDisplay.classList.remove('active');

    // Add a new message to the existing chat instead of clearing it
    addMessage("Let's start a new recommendation! What type of games do you enjoy playing?", 'bot');
}
// ... existing code ...

function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    if (chatState.waitingForPreferences) {
        handlePreferenceInput(message);
    } else {
        // Handle other conversation states
        if (lowerMessage.includes('yes') || lowerMessage.includes('another') || lowerMessage.includes('more')) {
            // Recommend another game without resetting preferences
            recommendGame();
        } else if (lowerMessage.includes('no') || lowerMessage.includes('stop')) {
            setTimeout(() => {
                addMessage("Would you like to start over with new preferences?", 'bot');
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("Would you like to try another recommendation? (yes/no)", 'bot');
            }, 1000);
        }
    }
}

function recommendGame() {
    // Filter games based on preferences
    let recommendedGames = games.filter(game => {
        return (
            (!chatState.preferences.genre || game.category.includes(chatState.preferences.genre)) &&
            (!chatState.preferences.players || game.players.includes(chatState.preferences.players)) &&
            (!chatState.preferences.complexity || game.complexity === chatState.preferences.complexity)
        );
    });

    // If no exact match, show all games
    if (recommendedGames.length === 0) {
        recommendedGames = games;
    }

    // Randomly select a game
    const recommendedGame = recommendedGames[Math.floor(Math.random() * recommendedGames.length)];

    // Show the recommendation
    showGameRecommendation(recommendedGame);
    
    // Add the recommendation message to the existing chat
    setTimeout(() => {
        addMessage(`Based on your preferences, I recommend ${recommendedGame.name}! Would you like to try another recommendation? (yes/no)`, 'bot');
    }, 1000);
}

// ... existing code ...