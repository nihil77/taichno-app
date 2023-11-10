const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const highScoresTable = document.getElementById("highScoresTable");

// Create table header
const headerRow = highScoresTable.createTHead().insertRow();
const timestampHeader = headerRow.insertCell(0);
timestampHeader.textContent = "Timestamp";
const scoreHeader = headerRow.insertCell(1);
scoreHeader.textContent = "Score";

// Populate table body with all scores
const tbody = highScoresTable.createTBody();

highScores.forEach(score => {
    const row = tbody.insertRow();
    const timestampCell = row.insertCell(0);
    const scoreCell = row.insertCell(1);

    timestampCell.textContent = score.timestamp;
    scoreCell.textContent = score.score;
});

// Add event listener for the Delete All Scores button
const deleteScoresBtn = document.getElementById("deleteScoresBtn");
deleteScoresBtn.addEventListener("click", deleteAllScores);

function deleteAllScores() {
    // Clear the localStorage
    localStorage.removeItem("highScores");

    // Clear the table body
    tbody.innerHTML = "";

    // Clear the header
    highScoresTable.deleteTHead();
}
