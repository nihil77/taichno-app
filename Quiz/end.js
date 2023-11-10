const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

saveScoreBtn.addEventListener('click', saveHighScore);

finalScore.innerText = mostRecentScore;

// Enable the button if there is a mostRecentScore
saveScoreBtn.disabled = mostRecentScore ? false : true;

function saveHighScore(e) {
    e.preventDefault();

    const timestamp = new Date().toLocaleString();

    const score = {
        score: mostRecentScore,
        timestamp: timestamp,
    };

    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    // Check if there is an existing high score
    const existingIndex = highScores.findIndex((s) => s.score === mostRecentScore);

    if (existingIndex !== -1) {
        // If an existing high score is found, replace it
        highScores[existingIndex] = score;
    } else {
        // If not, add the new high score
        highScores.push(score);
        highScores.sort((a, b) => b.score - a.score);
        highScores.splice(5); // Keep only the top 5 high scores
    }

    localStorage.setItem('highScores', JSON.stringify(highScores));

    // Redirect to highscores.html or any other page you want
    window.location.href = './highscore.html';
}
