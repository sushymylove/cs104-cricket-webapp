// Shared variables
let matchSettings = {
    team1: "Team A",
    team2: "Team B",
    tossWinner: "team1",
    tossDecision: "bat",
    totalOvers: 2
};

let matchState = null;

// Helper function to format overs
function getOvers(balls) {
    const overs = Math.floor(balls / 6);
    const ballsInOver = balls % 6;
    return ballsInOver === 0 ? overs + ".0" : overs + "." + ballsInOver;
}

// ===== SETUP PAGE LOGIC =====
if (window.location.pathname.includes("setup.html")) {
    document.addEventListener('DOMContentLoaded', function () {
        // Initialize dropdowns
        function updateDropdown() {
            const team1 = document.getElementById("team1_name").value || "Team A";
            const team2 = document.getElementById("team2_name").value || "Team B";
            document.getElementById("team1_option").textContent = team1;
            document.getElementById("team2_option").textContent = team2;
        }

        updateDropdown();

        // Event listeners
        document.getElementById("team1_name").addEventListener("input", updateDropdown);
        document.getElementById("team2_name").addEventListener("input", updateDropdown);

        document.getElementById("startMatch").addEventListener("click", function () {
            matchSettings.team1 = document.getElementById("team1_name").value || "Team A";
            matchSettings.team2 = document.getElementById("team2_name").value || "Team B";
            matchSettings.tossWinner = document.getElementById("toss_winner").value;
            matchSettings.tossDecision = document.getElementById("toss_decision").value;
            matchSettings.totalOvers = parseInt(document.getElementById("total_overs").value) || 2;

            if (!matchSettings.team1 || !matchSettings.team2) {
                alert("Please enter both team names!");
                return;
            }

            // Clear any previous match state
            localStorage.removeItem("matchState");
            localStorage.setItem("matchSettings", JSON.stringify(matchSettings));
            window.location.href = "live.html";
        });
    });
}

// ===== LIVE PAGE LOGIC =====
else if (window.location.pathname.includes("live.html")) {
    document.addEventListener('DOMContentLoaded', function () {
        // Load settings and state
        const savedSettings = localStorage.getItem("matchSettings");
        if (savedSettings) {
            matchSettings = JSON.parse(savedSettings);
        }

        const savedState = localStorage.getItem("matchState");
        if (savedState) {
            matchState = JSON.parse(savedState);
        }

        // Show the summary button
        if (matchState?.isFinished)
            document.getElementById("viewSummary").style.display = "block";

        // Always initialize a fresh match state if none exists
        if (!matchState) {
            initializeNewMatch();

        }
        // DOM Elements
        const elements = {
            matchHeader: document.getElementById("matchHeader"),
            batter1Name: document.getElementById("batter1Name"),
            batter1Runs: document.getElementById("batter1Runs"),
            batter1Balls: document.getElementById("batter1Balls"),
            batter1Fours: document.getElementById("batter1Fours"),
            batter1Sixes: document.getElementById("batter1Sixes"),
            batter1SR: document.getElementById("batter1SR"),
            batter2Name: document.getElementById("batter2Name"),
            batter2Runs: document.getElementById("batter2Runs"),
            batter2Balls: document.getElementById("batter2Balls"),
            batter2Fours: document.getElementById("batter2Fours"),
            batter2Sixes: document.getElementById("batter2Sixes"),
            batter2SR: document.getElementById("batter2SR"),
            bowlerName: document.getElementById("bowlerName"),
            bowlerOvers: document.getElementById("bowlerOvers"),
            bowlerMaidens: document.getElementById("bowlerMaidens"),
            bowlerRuns: document.getElementById("bowlerRuns"),
            bowlerWickets: document.getElementById("bowlerWickets"),
            bowlerEconomy: document.getElementById("bowlerEconomy"),
            extrasDisplay: document.getElementById("extrasDisplay"),
            extrasModal: document.getElementById("extrasModal"),
            extrasModalTitle: document.getElementById("extrasModalTitle"),
            extrasRuns: document.getElementById("extrasRuns"),
            runOutModal: document.getElementById("runOutModal"),
            runOutRuns: document.getElementById("runOutRuns"),
            runOutBatter: document.getElementById("runOutBatter"),
            newRunOutBatterName: document.getElementById("newRunOutBatterName"),
            wicketModal: document.getElementById("wicketModal"),
            newBatterName: document.getElementById("newBatterName"),
            newBowlerModal: document.getElementById("newBowlerModal"),
            newBowlerName: document.getElementById("newBowlerName"),
            matchSetupModal: document.getElementById("matchSetupModal"),
            scoringInterface: document.getElementById("scoringInterface"),
            strikeBatterName: document.getElementById("strikeBatterName"),
            nonStrikeBatterName: document.getElementById("nonStrikeBatterName"),
            firstBowlerName: document.getElementById("firstBowlerName"),
            rrrDisplay: document.getElementById("rrrDisplay"),
            inningTransitionModal: document.getElementById("inningTransitionModal"),
            firstInningScoreDisplay: document.getElementById("firstInningScoreDisplay"),
            targetScoreDisplay: document.getElementById("targetScoreDisplay"),
            secondInningStriker: document.getElementById("secondInningStriker"),
            secondInningNonStriker: document.getElementById("secondInningNonStriker"),
            secondInningBowler: document.getElementById("secondInningBowler"),
            run0: document.getElementById("run0"),
            run1: document.getElementById("run1"),
            run2: document.getElementById("run2"),
            run3: document.getElementById("run3"),
            run4: document.getElementById("run4"),
            run6: document.getElementById("run6"),
            wicketBtn: document.getElementById("wicketBtn"),
            runOutBtn: document.getElementById("runOutBtn"),
            wideBtn: document.getElementById("wideBtn"),
            noBallBtn: document.getElementById("noBallBtn"),
            byesBtn: document.getElementById("byesBtn"),
            legByesBtn: document.getElementById("legByesBtn"),
            submitWicket: document.getElementById("submitWicket"),
            cancelWicket: document.getElementById("cancelWicket")
        };

        // Show appropriate interface
        if (matchState.batter1 && matchState.batter1.name) {
            // Existing match - show scoring interface
            document.getElementById("matchSetupModal").style.display = "none";
            document.getElementById("scoringInterface").style.display = "block";
            updateUI();
        } else {
            // New match - show setup modal
            document.getElementById("matchSetupModal").style.display = "block";
            document.getElementById("scoringInterface").style.display = "none";
        }

        function initializeNewMatch() {
            // Remove the condition that prevents initialization
            matchState = {
                team1: matchSettings.team1,
                team2: matchSettings.team2,
                battingTeam: matchSettings.tossWinner === "team1" && matchSettings.tossDecision === "bat" ? matchSettings.team1 :
                    (matchSettings.tossWinner === "team2" && matchSettings.tossDecision === "bat" ? matchSettings.team2 :
                        (matchSettings.tossWinner === "team1" ? matchSettings.team2 : matchSettings.team1)),
                fieldingTeam: matchSettings.tossWinner === "team1" && matchSettings.tossDecision === "bowl" ? matchSettings.team1 :
                    (matchSettings.tossWinner === "team2" && matchSettings.tossDecision === "bowl" ? matchSettings.team2 :
                        (matchSettings.tossWinner === "team1" ? matchSettings.team2 : matchSettings.team1)),
                innings: 1,
                currentInning: 1,
                maxOvers: matchSettings.totalOvers,
                firstInningScore: 0,
                firstInningWickets: 0,
                targetScore: 0,
                balls: 0,
                totalRuns: 0,
                wickets: 0,
                batter1: { name: "", runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: true },
                batter2: { name: "", runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: false },
                bowlers: [],
                currentBowlerIndex: 0,
                extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 },
                currentExtraType: null,
                dismissedBatters: [],
                isFinished: false
            };
            localStorage.removeItem('matchEndAlertShown');
            localStorage.removeItem("matchCommentary");
        }


        // Helper Functions
        function showModal(modalElement) {
            modalElement.style.display = "block";
        }

        function getCurrentBowler() {
            return matchState.bowlers[matchState.currentBowlerIndex];
        }

        function updateBatterNames() {
            elements.batter1Name.textContent = matchState.batter1.name + (matchState.batter1.isStriker ? " *" : "");
            elements.batter2Name.textContent = matchState.batter2.name + (matchState.batter2.isStriker ? " *" : "");
        }

        function swapBatters() {
            matchState.batter1.isStriker = !matchState.batter1.isStriker;
            matchState.batter2.isStriker = !matchState.batter2.isStriker;
            updateBatterNames();
        }

        function rotateBowler() {
            if (!(getOvers(matchState.balls) >= matchState.maxOvers)) {
                elements.newBowlerModal.style.display = "block";
            }
        }

        function saveMatchState() {
            localStorage.setItem("matchState", JSON.stringify(matchState));
            localStorage.setItem("matchSettings", JSON.stringify({
                team1: matchState.team1,
                team2: matchState.team2,
                tossWinner: matchState.battingTeam === matchState.team1 ? "team1" : "team2",
                tossDecision: matchState.battingTeam === matchState.team1 ? "bat" : "bowl",
                totalOvers: matchState.maxOvers
            }));
        }

        // Game Functions
        function initializeMatch() {
            // Get input values
            const strikeName = document.getElementById("strikeBatterName").value.trim();
            const nonStrikeName = document.getElementById("nonStrikeBatterName").value.trim();
            const bowlerName = document.getElementById("firstBowlerName").value.trim();

            if (!strikeName || !nonStrikeName || !bowlerName) {
                alert("Please enter all player names!");
                return;
            }

            // Reset match state
            initializeNewMatch();

            // Set player names
            matchState.batter1.name = strikeName;
            matchState.batter2.name = nonStrikeName;

            // Initialize bowler
            matchState.bowlers = [{
                name: bowlerName,
                runs: 0,
                wickets: 0,
                ballsBowled: 0,
                maidens: 0,
                currentOverRuns: 0
            }];

            // Show scoring interface
            document.getElementById("matchSetupModal").style.display = "none";
            document.getElementById("scoringInterface").style.display = "block";

            // Save and update
            saveMatchState();
            updateUI();
        }

        function addRuns(runs) {
            const bowler = getCurrentBowler();
            const striker = matchState.batter1.isStriker ? matchState.batter1 : matchState.batter2;

            matchState.totalRuns += runs;
            striker.runs += runs;
            bowler.runs += runs;
            bowler.currentOverRuns += runs;
            striker.balls++;
            bowler.ballsBowled++;
            matchState.balls++;

            addCommentary(`${formatDeliveryInfo()} ${runs} run${runs !== 1 ? 's' : ''}`);

            if (runs === 4) striker.fours++;
            if (runs === 6) striker.sixes++;

            if (runs % 2 !== 0) swapBatters();

            if (bowler.ballsBowled % 6 === 0) {
                swapBatters();
                if (bowler.currentOverRuns === 0) bowler.maidens++;
                bowler.currentOverRuns = 0;
                rotateBowler();
            }

            saveMatchState();
            updateUI();
            checkInningTransition();
        }

        // Show extras modal
        function showExtrasModal(type) {
            matchState.currentExtraType = type;
            elements.extrasModalTitle.textContent =
                type === 'wide' ? 'Wide + Runs' :
                    type === 'noBall' ? 'No-Ball + Runs' :
                        type === 'byes' ? 'Byes + Runs' : 'Leg Byes + Runs';
            elements.extrasModal.style.display = 'block';
            elements.extrasRuns.value = "0"; // Reset runs input
        }

        // Add extra runs
        function addExtra(type, runs = 0) {
            const bowler = getCurrentBowler();
            const striker = matchState.batter1.isStriker ? matchState.batter1 : matchState.batter2;

            // Add commentary based on extra type
            let extraComment = "";
            switch (type) {
                case 'wide':
                    extraComment = `${formatDeliveryInfo()} wide${runs > 0 ? ` + ${runs} run${runs !== 1 ? 's' : ''}` : ''}`;
                    break;
                case 'noBall':
                    extraComment = `${formatDeliveryInfo()} no ball${runs > 0 ? ` + ${runs} run${runs !== 1 ? 's' : ''}` : ''}`;
                    break;
                case 'byes':
                    extraComment = `${formatDeliveryInfo()} ${runs} bye${runs !== 1 ? 's' : ''}`;
                    break;
                case 'legByes':
                    extraComment = `${formatDeliveryInfo()} ${runs} leg bye${runs !== 1 ? 's' : ''}`;
                    break;
            }
            addCommentary(extraComment);


            // Validate minimum runs for byes/leg byes
            if ((type === 'byes' || type === 'legByes') && runs < 1) {
                alert("Byes/Leg Byes must have at least 1 run!");
                return;
            }

            // WIDE: Team +2 (1 extra + 1 run), Batter +0, Extras +1
            if (type === 'wide') {
                matchState.totalRuns += 1 + runs; // Team total: +2 (if runs=1)
                bowler.runs += 1 + runs;
                bowler.currentOverRuns += 1 + runs;
                matchState.extras.wides += 1; // Extras count: +1

                // Rotate strike if odd runs (despite batter not getting runs)
                if (runs % 2 !== 0) swapBatters();
            }
            // NO-BALL: Team +7 (1 extra + 6 runs), Batter +6, Extras +1
            else if (type === 'noBall') {
                striker.runs += runs; // Batter gets runs (e.g., +6)
                matchState.totalRuns += 1 + runs; // Team total: +7
                bowler.runs += 1 + runs;
                bowler.currentOverRuns += 1 + runs;
                matchState.extras.noBalls += 1; // Extras count: +1
                striker.balls++;

                // Rotate strike if odd runs
                if (runs % 2 !== 0) swapBatters();
            }
            // BYES/LEG BYES: Team +runs, Batter +0, Extras +runs
            else if (type === 'byes' || type === 'legByes') {
                matchState.totalRuns += runs; // Team total: +runs
                bowler.runs += runs;
                bowler.currentOverRuns += runs;
                matchState.extras[type + 's'] += runs; // Extras count: +runs

                // Rotate strike if odd runs
                if (runs % 2 !== 0) swapBatters();
            }

            // Update balls bowled (except wides)
            if (type !== 'wide' && type !== 'noBall') {
                bowler.ballsBowled++;
                matchState.balls++;
                striker.balls++; // Batter faces a ball (for byes/leg byes)
            }

            // Check for over completion
            if (bowler.ballsBowled % 6 === 0 && type !== 'wide') {
                if (bowler.currentOverRuns === 0) bowler.maidens++;
                bowler.currentOverRuns = 0;
                rotateBowler();
            }

            updateUI();
        }

        function wicket() {
            showModal(elements.wicketModal);
        }

        function submitWicket() {
            const newBatterName = elements.newBatterName.value.trim();
            const dismissalType = document.getElementById("dismissalType").value;

            if (!newBatterName) {
                alert("Please enter a batter name!");
                return;
            }

            const bowler = getCurrentBowler();
            const isBatter1Striker = matchState.batter1.isStriker;

            // Add dismissed batter to history
            const dismissedBatter = isBatter1Striker ?
                { ...matchState.batter1, dismissal: dismissalType } :
                { ...matchState.batter2, dismissal: dismissalType };

            if (!matchState.dismissedBatters) {
                matchState.dismissedBatters = [];
            }
            dismissedBatter.balls++;  // Count this ball faced

            matchState.dismissedBatters.push(dismissedBatter);

            // Update match state
            matchState.wickets++;
            bowler.wickets++;
            bowler.ballsBowled++;
            matchState.balls++;

            const striker = dismissedBatter;

            // Add wicket commentary
            let wicketComment = `${formatDeliveryInfo()} OUT! ${striker.name} ${getDismissalText(dismissalType, bowler.name)}`;
            addCommentary(wicketComment);

            // Replace the dismissed batter
            if (isBatter1Striker) {
                matchState.batter1 = {
                    name: newBatterName,
                    runs: 0,
                    balls: 0,
                    fours: 0,
                    sixes: 0,
                    isStriker: true
                };
            } else {
                matchState.batter2 = {
                    name: newBatterName,
                    runs: 0,
                    balls: 0,
                    fours: 0,
                    sixes: 0,
                    isStriker: true  // New batter comes to strike
                };
            }

            // Close modal and update
            elements.wicketModal.style.display = "none";
            saveMatchState();
            updateUI();
        }

        function getDismissalText(type, bowlerName) {
            switch (type) {
                case 'bowled': return `b ${bowlerName}`;
                case 'caught': return `c [fielder] b ${bowlerName}`;
                case 'lbw': return `lbw b ${bowlerName}`;
                case 'stumped': return `st [keeper] b ${bowlerName}`;
                case 'run out': return 'run out';
                case 'hit wicket': return `hit wicket b ${bowlerName}`;
                default: return `b ${bowlerName}`;
            }
        }

        function runOut() {
            // Update UI to show current batters
            const strikerName = matchState.batter1.isStriker ? matchState.batter1.name : matchState.batter2.name;
            const nonStrikerName = matchState.batter1.isStriker ? matchState.batter2.name : matchState.batter1.name;

            document.getElementById("runOutBatter").innerHTML = `
                <option value="striker">Striker: ${strikerName}</option>
                <option value="nonStriker">Non-Striker: ${nonStrikerName}</option>
            `;

            document.getElementById("runOutPosition").innerHTML = `
                <option value="strike">Strike</option>
                <option value="nonStrike">Non-Strike</option>
            `;

            document.getElementById("runOutModal").style.display = "block";
        }

        function submitRunOut() {
            const runs = parseInt(document.getElementById("runOutRuns").value) || 0;
            const batterOut = document.getElementById("runOutBatter").value;
            const newBatterName = document.getElementById("newRunOutBatterName").value.trim();
            const newBatterPosition = document.getElementById("runOutPosition").value;

            if (!newBatterName) {
                alert("Please enter new batter name!");
                return;
            }

            const bowler = getCurrentBowler();
            const currentStriker = matchState.batter1.isStriker ? matchState.batter1 : matchState.batter2;
            const currentNonStriker = matchState.batter1.isStriker ? matchState.batter2 : matchState.batter1;

            // 1. Add runs scored before run out
            if (runs > 0) {
                matchState.totalRuns += runs;
                currentStriker.runs += runs;
                bowler.runs += runs;
                bowler.currentOverRuns += runs;

                // Rotate strike if odd runs scored
                if (runs % 2 !== 0) {
                    matchState.batter1.isStriker = !matchState.batter1.isStriker;
                    matchState.batter2.isStriker = !matchState.batter2.isStriker;
                }
            }

            // 2. Always count as a ball faced
            currentStriker.balls++;
            bowler.ballsBowled++;
            matchState.balls++;

            // 3. Process the wicket
            matchState.wickets++;

            // 4. Handle dismissal
            const isStrikerOut = batterOut === "striker";
            const dismissedBatter = {
                ...(isStrikerOut ? currentStriker : currentNonStriker),
                dismissal: "run out"
            };
            matchState.dismissedBatters.push(dismissedBatter);

            // 5. Create new batter with EXACTLY the position user selected
            const newBatter = {
                name: newBatterName,
                runs: 0,
                balls: 0,
                fours: 0,
                sixes: 0,
                isStriker: newBatterPosition === "strike" // Directly use user's choice
            };

            // 6. Replace the out batter and adjust positions
            if (isStrikerOut) {
                // Striker is out - replace striker
                if (matchState.batter1.isStriker) {
                    matchState.batter1 = newBatter;
                    // Ensure non-striker stays in their position
                    matchState.batter2.isStriker = !newBatter.isStriker;
                } else {
                    matchState.batter2 = newBatter;
                    // Ensure non-striker stays in their position
                    matchState.batter1.isStriker = !newBatter.isStriker;
                }
            } else {
                // Non-striker is out - replace non-striker
                if (matchState.batter1.isStriker) {
                    matchState.batter2 = newBatter;
                    // Ensure striker stays in their position
                    matchState.batter1.isStriker = !newBatter.isStriker;
                } else {
                    matchState.batter1 = newBatter;
                    // Ensure striker stays in their position
                    matchState.batter2.isStriker = !newBatter.isStriker;
                }
            }

            // 7. Check for over completion
            if (bowler.ballsBowled % 6 === 0) {
                if (bowler.currentOverRuns === 0) bowler.maidens++;
                bowler.currentOverRuns = 0;
                rotateBowler();
            }

            // Close modal and reset
            document.getElementById("runOutModal").style.display = "none";
            document.getElementById("runOutRuns").value = "0";
            document.getElementById("newRunOutBatterName").value = "";

            // Add run out commentary
            let commentary = `${formatDeliveryInfo()} ${runs > 0 ? `${runs} run${runs !== 1 ? 's' : ''}, ` : ''}OUT! ${dismissedBatter.name} run out`;
            addCommentary(commentary);

            saveMatchState();
            updateUI();
        }

        // Commentary functions
        function addCommentary(comment) {
            const commentaryFeed = document.getElementById("commentaryFeed");
            const entry = document.createElement("div");
            entry.className = "commentary-entry";
            entry.textContent = comment;
            commentaryFeed.prepend(entry);

            // Store commentary in localStorage
            const savedCommentary = JSON.parse(localStorage.getItem("matchCommentary")) || [];
            savedCommentary.unshift(comment); // Add newest at beginning
            localStorage.setItem("matchCommentary", JSON.stringify(savedCommentary.slice(0, 50))); // Keep last 50

            // Limit display to 50 entries
            if (commentaryFeed.children.length > 50) {
                commentaryFeed.removeChild(commentaryFeed.lastChild);
            }
        }

        const savedCommentary = JSON.parse(localStorage.getItem("matchCommentary") || "[]");
        const commentaryFeed = document.getElementById("commentaryFeed");

        // Load saved commentary (in reverse order to maintain chronology)
        savedCommentary.reverse().forEach(comment => {
            const entry = document.createElement("div");
            entry.className = "commentary-entry";
            entry.textContent = comment;
            commentaryFeed.appendChild(entry);
        });

        function formatDeliveryInfo() {
            const bowler = getCurrentBowler();
            const striker = matchState.batter1.isStriker ? matchState.batter1 : matchState.batter2;

            // Use the actual current ball count (balls are counted after the delivery)
            return `${getOvers(matchState.balls)} ${bowler.name} to ${striker.name},`;
        }

        function checkInningTransition() {
            // Convert balls to overs (e.g., 12 balls = 2.0 overs)
            const currentOvers = Math.floor(matchState.balls / 6) + (matchState.balls % 6) / 10;

            // First innings end conditions:
            if (matchState.currentInning === 1) {
                if (currentOvers >= matchState.maxOvers || matchState.wickets >= 10) {
                    // Store complete first innings data
                    matchState.firstInningDetails = {
                        battingTeam: matchState.battingTeam,
                        fieldingTeam: matchState.fieldingTeam,
                        totalRuns: matchState.totalRuns,
                        wickets: matchState.wickets,
                        balls: matchState.balls,
                        batters: [
                            JSON.parse(JSON.stringify(matchState.batter1)),
                            JSON.parse(JSON.stringify(matchState.batter2))
                        ],
                        bowlers: JSON.parse(JSON.stringify(matchState.bowlers)),
                        extras: JSON.parse(JSON.stringify(matchState.extras)),
                        dismissedBatters: matchState.dismissedBatters ?
                            JSON.parse(JSON.stringify(matchState.dismissedBatters)) : []
                    };
                    matchState.firstInningScore = matchState.totalRuns;
                    matchState.firstInningWickets = matchState.wickets;

                    // Set up second innings
                    matchState.currentInning = 2;
                    matchState.totalRuns = 0;
                    matchState.wickets = 0;
                    matchState.balls = 0;
                    matchState.targetScore = matchState.firstInningDetails.totalRuns + 1;

                    // Swap teams
                    const temp = matchState.battingTeam;
                    matchState.battingTeam = matchState.fieldingTeam;
                    matchState.fieldingTeam = temp;

                    // Reset players
                    matchState.batter1 = { name: "", runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: true };
                    matchState.batter2 = { name: "", runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: false };
                    matchState.bowlers = [];
                    matchState.extras = { wides: 0, noBalls: 0, byes: 0, legByes: 0 };
                    matchState.dismissedBatters = [];

                    showInningTransitionModal();
                    return true;
                }
            }

            // Second innings end conditions
            else if (matchState.currentInning === 2) {
                const ballsPerInning = matchState.maxOvers * 6;
                if (matchState.balls >= ballsPerInning ||
                    matchState.wickets >= 10 ||
                    matchState.totalRuns >= matchState.targetScore) {

                    // match has ended
                    matchState.isFinished = true;

                    // Show the summary button and match ended message
                    document.getElementById("viewSummary").style.display = "block";

                    // Only show alert if we haven't shown it before
                    if (!localStorage.getItem('matchEndAlertShown')) {
                        document.getElementById("matchEndedAlert").style.display = "flex";
                        localStorage.setItem('matchEndAlertShown', 'true');
                    }

                    return true;
                }
            }
            return false;
        }

        function showInningTransitionModal() {
            // Add innings transition commentary
            addCommentary(`Innings Break: ${matchState.firstInningDetails.battingTeam} ${matchState.firstInningDetails.totalRuns}/${matchState.firstInningDetails.wickets} in ${getOvers(matchState.firstInningDetails.balls)} overs`);
            addCommentary(`${matchState.battingTeam} need ${matchState.targetScore} runs to win`);

            // Reset second innings properly
            matchState.battingTeam = matchState.firstInningDetails.fieldingTeam;
            matchState.fieldingTeam = matchState.firstInningDetails.battingTeam;
            matchState.totalRuns = 0;
            matchState.wickets = 0;
            matchState.balls = 0;
            matchState.batter1 = { name: "", runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: true };
            matchState.batter2 = { name: "", runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: false };
            matchState.bowlers = [];
            matchState.extras = { wides: 0, noBalls: 0, byes: 0, legByes: 0 };
            matchState.dismissedBatters = [];

            elements.inningTransitionModal.style.display = "block";
            elements.firstInningScoreDisplay.textContent = `${matchState.firstInningScore}/${matchState.firstInningWickets}`;
            elements.targetScoreDisplay.textContent = `Target: ${matchState.targetScore}`;
            elements.secondInningStriker.value = "";
            elements.secondInningNonStriker.value = "";
            elements.secondInningBowler.value = "";
        }

        function updateUI() {
            if (matchState.currentInning === 1) {
                elements.matchHeader.textContent =
                    `${matchState.battingTeam} ${matchState.totalRuns}/${matchState.wickets} (${getOvers(matchState.balls)}) vs ${matchState.fieldingTeam}`;
                const crr = matchState.balls > 0 ?
                    (matchState.totalRuns / (matchState.balls / 6)).toFixed(2) : "0.00";
                elements.rrrDisplay.innerHTML = `Current Run Rate: ${crr}`;
            } else {
                const ballsRemaining = Math.max(0, matchState.maxOvers * 6 - matchState.balls);
                const runsNeeded = Math.max(0, matchState.targetScore - matchState.totalRuns);

                elements.matchHeader.textContent =
                    `${matchState.battingTeam} ${matchState.totalRuns}/${matchState.wickets} (${getOvers(matchState.balls)})` +
                    ` vs ${matchState.fieldingTeam} ${matchState.firstInningScore}/${matchState.firstInningWickets}`;

                if (ballsRemaining > 0 && runsNeeded > 0) {
                    const rrr = (runsNeeded / (ballsRemaining / 6)).toFixed(2);
                    elements.rrrDisplay.innerHTML =
                        `${matchState.battingTeam} need ${runsNeeded} runs in ${ballsRemaining} balls to win` +
                        ` | Required RR: ${rrr}`;
                } else {
                    elements.rrrDisplay.innerHTML = "";
                }
            }

            // Batter stats
            elements.batter1Runs.textContent = matchState.batter1.runs;
            elements.batter1Balls.textContent = matchState.batter1.balls;
            elements.batter1Fours.textContent = matchState.batter1.fours;
            elements.batter1Sixes.textContent = matchState.batter1.sixes;
            elements.batter1SR.textContent =
                (matchState.batter1.balls > 0 ?
                    (matchState.batter1.runs / matchState.batter1.balls * 100).toFixed(2) : "0.00");

            elements.batter2Runs.textContent = matchState.batter2.runs;
            elements.batter2Balls.textContent = matchState.batter2.balls;
            elements.batter2Fours.textContent = matchState.batter2.fours;
            elements.batter2Sixes.textContent = matchState.batter2.sixes;
            elements.batter2SR.textContent =
                (matchState.batter2.balls > 0 ?
                    (matchState.batter2.runs / matchState.batter2.balls * 100).toFixed(2) : "0.00");

            updateBatterNames();

            // Bowler stats
            const bowler = getCurrentBowler();
            if (bowler) {
                elements.bowlerName.textContent = bowler.name;
                elements.bowlerOvers.textContent = getOvers(bowler.ballsBowled);
                elements.bowlerMaidens.textContent = bowler.maidens;
                elements.bowlerRuns.textContent = bowler.runs;
                elements.bowlerWickets.textContent = bowler.wickets;
                elements.bowlerEconomy.textContent =
                    bowler.ballsBowled > 0 ? (bowler.runs / (bowler.ballsBowled / 6)).toFixed(2) : "0.00";
            }

            // Update extras display
            // In updateUI():
            const totalExtras =
                matchState.extras.wides +
                matchState.extras.noBalls +
                matchState.extras.byes +
                matchState.extras.legByes;

            elements.extrasDisplay.textContent =
                `Extras: ${totalExtras} ` +
                `(w ${matchState.extras.wides}, nb ${matchState.extras.noBalls}, ` +
                `b ${matchState.extras.byes}, lb ${matchState.extras.legByes})`;
        }

        // Event Listeners
        document.getElementById("startMatch").addEventListener("click", initializeMatch);

        // Scoring buttons
        elements.run0.addEventListener("click", () => addRuns(0));
        elements.run1.addEventListener("click", () => addRuns(1));
        elements.run2.addEventListener("click", () => addRuns(2));
        elements.run3.addEventListener("click", () => addRuns(3));
        elements.run4.addEventListener("click", () => addRuns(4));
        elements.run6.addEventListener("click", () => addRuns(6));

        // Wicket buttons
        elements.wicketBtn.addEventListener("click", wicket);
        elements.runOutBtn.addEventListener("click", runOut);

        // Extra buttons
        elements.wideBtn.addEventListener("click", () => showExtrasModal('wide'));
        elements.noBallBtn.addEventListener("click", () => showExtrasModal('noBall'));
        elements.byesBtn.addEventListener("click", () => showExtrasModal('byes'));
        elements.legByesBtn.addEventListener("click", () => showExtrasModal('legByes'));

        // Modal buttons
        elements.submitWicket.addEventListener("click", submitWicket);
        elements.cancelWicket.addEventListener("click", function () {
            elements.wicketModal.style.display = "none";
        });

        // Update the extras submission handler
        document.getElementById("submitExtras").addEventListener("click", function () {
            const runs = parseInt(document.getElementById("extrasRuns").value) || 0;

            // Validate runs for byes/leg byes (must be >= 1)
            if ((matchState.currentExtraType === 'byes' || matchState.currentExtraType === 'legByes') && runs < 1) {
                alert("Byes/Leg Byes must have at least 1 run!");
                return; // Prevent submission
            }

            addExtra(matchState.currentExtraType, runs);

            // Hide modal and reset input
            document.getElementById("extrasModal").style.display = "none";
            document.getElementById("extrasRuns").value = "0";
        });

        document.getElementById("cancelExtras").addEventListener("click", function () {
            elements.extrasModal.style.display = "none";
            elements.extrasRuns.value = "0";
        });

        document.getElementById("submitRunOut").addEventListener("click", submitRunOut);
        document.getElementById("cancelRunOut").addEventListener("click", function () {
            elements.runOutModal.style.display = "none";
        });

        document.getElementById("viewScorecard").addEventListener("click", function () {
            localStorage.setItem("matchState", JSON.stringify(matchState));
            setTimeout(() => window.location.href = "scorecard.html", 500);
        });

        document.getElementById("viewSummary")?.addEventListener("click", function () {
            localStorage.setItem("finalMatchState", JSON.stringify(matchState));
            window.location.href = "summary.html";
        });

        document.getElementById("submitNewBowler").addEventListener("click", function () {
            const newBowlerName = elements.newBowlerName.value.trim();
            if (!newBowlerName) {
                alert("Please enter a bowler name!");
                return;
            }

            // Add commentary about bowler change
            const prevBowler = getCurrentBowler();
            if (prevBowler && prevBowler.ballsBowled > 0) {
                const overs = getOvers(prevBowler.ballsBowled);
                addCommentary(`${overs} - End of ${prevBowler.name}'s spell`);
            }

            // Create new bowler
            const newBowler = {
                name: newBowlerName,
                runs: 0,
                wickets: 0,
                ballsBowled: 0,
                maidens: 0,
                currentOverRuns: 0
            };

            matchState.bowlers.push(newBowler);
            matchState.currentBowlerIndex = matchState.bowlers.length - 1;

            // Clear and hide modal
            elements.newBowlerName.value = "";
            elements.newBowlerModal.style.display = "none";

            // Add commentary about new bowler
            addCommentary(`${getOvers(matchState.balls)} - ${newBowlerName} comes into the attack`);

            saveMatchState();
            updateUI();
        });

        document.getElementById("startSecondInning").addEventListener("click", function () {
            const striker = elements.secondInningStriker.value.trim();
            const nonStriker = elements.secondInningNonStriker.value.trim();
            const bowler = elements.secondInningBowler.value.trim();

            if (!striker || !nonStriker || !bowler) {
                alert("Please enter all player names!");
                return;
            }

            matchState.batter1 = {
                name: striker,
                runs: 0,
                balls: 0,
                fours: 0,
                sixes: 0,
                isStriker: true
            };
            matchState.batter2 = {
                name: nonStriker,
                runs: 0,
                balls: 0,
                fours: 0,
                sixes: 0,
                isStriker: false
            };

            matchState.bowlers = [{
                name: bowler,
                runs: 0,
                wickets: 0,
                ballsBowled: 0,
                maidens: 0,
                currentOverRuns: 0
            }];
            matchState.currentBowlerIndex = 0;

            elements.inningTransitionModal.style.display = "none";

            saveMatchState();
            updateUI();
        });

        document.getElementById("dismissAlert")?.addEventListener("click", function () {
            document.getElementById("matchEndedAlert").style.display = "none";
        });

        elements.viewFinalScorecard?.addEventListener("click", function () {
            localStorage.setItem("finalMatchState", JSON.stringify(matchState));
            window.location.href = "scorecard.html";
        });
    });
}

// ===== SCORECARD PAGE LOGIC =====
else if (window.location.pathname.includes("scorecard.html")) {
    document.addEventListener('DOMContentLoaded', function () {
        // 1. Load match data
        const matchState = JSON.parse(localStorage.getItem("matchState") ||
            localStorage.getItem("finalMatchState"));

        if (!matchState) {
            document.getElementById("matchTitle").textContent = "No Match Data Available";
            return;
        }

        // 2. Set up back button
        document.getElementById("backToLive").addEventListener("click", function () {
            // Clear the alert flag so it won't show again
            localStorage.removeItem('matchEndAlertShown');
            window.location.href = "live.html";
        });

        // 3. Match Summary Header and button
        const summaryElement = document.getElementById("matchSummary");

        if (matchState.currentInning === 1) {
            summaryText = `${matchState.battingTeam} ${matchState.totalRuns}/${matchState.wickets} (${getOvers(matchState.balls)}) vs ${matchState.fieldingTeam}`;
        }
        else if (matchState.firstInningDetails) {
            const firstInn = matchState.firstInningDetails;
            const secondInn = matchState;

            summaryText = `${firstInn.battingTeam} ${firstInn.totalRuns}/${firstInn.wickets} vs ` +
                `${secondInn.battingTeam} ${secondInn.totalRuns}/${secondInn.wickets} (${getOvers(secondInn.balls)})` +
                `<br>Target: ${secondInn.targetScore}`;
        }

        summaryElement.innerHTML = summaryText;

        // 4. Render Innings Function
        const renderInning = (inningPrefix, inningData) => {
            if (!inningData) return;

            // Batting Header
            document.getElementById(`${inningPrefix}BattingHeader`).textContent =
                `${inningData.battingTeam} Batting`;

            // Batting Table - include all batters (current and dismissed)
            const battingBody = document.getElementById(`${inningPrefix}BattingTableBody`);
            battingBody.innerHTML = "";

            // Combine current and dismissed batters
            const currentBatters = inningData.batters ||
                [inningData.batter1, inningData.batter2].filter(b => b?.name);
            const allBatters = [...currentBatters, ...(inningData.dismissedBatters || [])];

            allBatters.forEach((batter, index) => {
                if (!batter?.name) return;

                // Check if batter is not out (either current batter or not in dismissed list)
                const isNotOut = !inningData.dismissedBatters?.some(db => db.name === batter.name);

                battingBody.appendChild(createBatterRow(batter, isNotOut));
            });


            // Extras
            const extrasTotal = (inningData.extras?.wides || 0) +
                (inningData.extras?.noBalls || 0) +
                (inningData.extras?.byes || 0) +
                (inningData.extras?.legByes || 0);

            document.getElementById(`${inningPrefix}Extras`).innerHTML =
                `Extras: ${extrasTotal} (w ${inningData.extras?.wides || 0}, nb ${inningData.extras?.noBalls || 0}, ` +
                `b ${inningData.extras?.byes || 0}, lb ${inningData.extras?.legByes || 0})`;

            // Total
            document.getElementById(`${inningPrefix}Total`).textContent =
                `Total: ${inningData.totalRuns || 0}/${inningData.wickets || 0} (${getOvers(inningData.balls || 0)} overs)` +
                (inningPrefix === "secondInning" && inningData.targetScore ?
                    ` | Target: ${inningData.targetScore}` : "");

            // Bowling Header
            document.getElementById(`${inningPrefix}BowlingHeader`).textContent =
                `${inningData.fieldingTeam} Bowling`;

            // Bowling Table
            const bowlingBody = document.getElementById(`${inningPrefix}BowlingTableBody`);
            bowlingBody.innerHTML = "";

            (inningData.bowlers || []).forEach(bowler => {
                if (!bowler?.name) return;

                const row = document.createElement("tr");

                // Name
                const nameCell = document.createElement("td");
                nameCell.textContent = bowler.name;
                row.appendChild(nameCell);

                // Overs
                const oversCell = document.createElement("td");
                oversCell.textContent = getOvers(bowler.ballsBowled || 0);
                row.appendChild(oversCell);

                // Maidens
                const maidensCell = document.createElement("td");
                maidensCell.textContent = bowler.maidens || 0;
                row.appendChild(maidensCell);

                // Runs
                const runsCell = document.createElement("td");
                runsCell.textContent = bowler.runs || 0;
                row.appendChild(runsCell);

                // Wickets
                const wicketsCell = document.createElement("td");
                wicketsCell.textContent = bowler.wickets || 0;
                row.appendChild(wicketsCell);

                // Economy
                const economyCell = document.createElement("td");
                economyCell.textContent = (bowler.ballsBowled || 0) > 0 ?
                    ((bowler.runs || 0) / ((bowler.ballsBowled || 0) / 6)).toFixed(2) : "0.00";
                row.appendChild(economyCell);

                bowlingBody.appendChild(row);
            });
        };

        // 5. Create Batter Row Helper
        const createBatterRow = (batter, isNotOut) => {
            const row = document.createElement("tr");
            if (isNotOut) row.classList.add("highlight-batter");

            // Name with strike indicator
            const nameCell = document.createElement("td");
            const showStar = isNotOut && batter.isStriker;
            nameCell.textContent = batter.name + (showStar ? " *" : "");
            row.appendChild(nameCell);

            // Runs
            const runsCell = document.createElement("td");
            runsCell.textContent = batter.runs || 0;
            row.appendChild(runsCell);

            // Balls
            const ballsCell = document.createElement("td");
            ballsCell.textContent = batter.balls || 0;
            row.appendChild(ballsCell);

            // 4s
            const foursCell = document.createElement("td");
            foursCell.textContent = batter.fours || 0;
            row.appendChild(foursCell);

            // 6s
            const sixesCell = document.createElement("td");
            sixesCell.textContent = batter.sixes || 0;
            row.appendChild(sixesCell);

            // Strike Rate
            const srCell = document.createElement("td");
            srCell.textContent = (batter.balls || 0) > 0 ?
                (((batter.runs || 0) / (batter.balls || 0)) * 100).toFixed(2) : "0.00";
            row.appendChild(srCell);

            // Dismissal
            const dismissalCell = document.createElement("td");
            if (isNotOut) {
                dismissalCell.textContent = "not out";
            } else {
                // Format dismissal text based on type
                let dismissalText = batter.dismissal || "bowled";
                if (dismissalText === "caught") {
                    dismissalText = "c [fielder] b [bowler]";
                } else if (dismissalText === "lbw") {
                    dismissalText = "lbw b [bowler]";
                } else if (dismissalText === "stumped") {
                    dismissalText = "st [keeper] b [bowler]";
                } else if (dismissalText === "run out") {
                    dismissalText = "run out";
                } else if (dismissalText === "hit wicket") {
                    dismissalText = "hit wicket b [bowler]";
                } else {
                    dismissalText = "b [bowler]";
                }
                dismissalCell.textContent = dismissalText;
            }
            row.appendChild(dismissalCell);

            return row;
        };

        // 6. Render Both Innings
        const firstInningData = matchState.firstInningDetails ||
            (matchState.currentInning === 1 ? matchState : null);
        renderInning("firstInning", firstInningData);

        if (matchState.currentInning === 2) {
            document.getElementById("secondInningSection").style.display = "block";
            renderInning("secondInning", matchState);
        } else {
            document.getElementById("secondInningSection").style.display = "none";
        }
    });
}

// ===== SUMMARY PAGE LOGIC =====
else if (window.location.pathname.includes("summary.html")) {
    document.addEventListener('DOMContentLoaded', function () {
        const matchState = JSON.parse(localStorage.getItem("finalMatchState"));
        if (!matchState) {
            window.location.href = "setup.html";
            return;
        }

        // Determine result
        let resultText = "";
        const firstInn = matchState.firstInningDetails;
        const secondInn = matchState.currentInning === 2 ? matchState : null;

        if (secondInn) {
            if (secondInn.totalRuns >= secondInn.targetScore) {
                // Team B won chasing
                const wicketsLeft = 10 - secondInn.wickets;
                const ballsLeft = matchState.maxOvers * 6 - secondInn.balls;
                resultText = `<span class="winner">${secondInn.battingTeam} wins by ${wicketsLeft} wicket${wicketsLeft !== 1 ? 's' : ''}</span> (${ballsLeft} balls remaining)`;
            } else {
                // Team A won defending
                const margin = firstInn.totalRuns - secondInn.totalRuns;
                resultText = `<span class="winner">${firstInn.battingTeam} wins by ${margin} run${margin !== 1 ? 's' : ''}</span>`;
            }
        }

        // Display result
        document.getElementById("matchResult").innerHTML = resultText;

        // Display score details
        document.getElementById("scoreDetails").innerHTML = `
            <h3>Match Details</h3>
            <p><strong>${firstInn.battingTeam}:</strong> ${firstInn.totalRuns}/${firstInn.wickets} (${getOvers(firstInn.balls)} overs)</p>
            ${secondInn ? `
            <p><strong>${secondInn.battingTeam}:</strong> ${secondInn.totalRuns}/${secondInn.wickets} (${getOvers(secondInn.balls)} overs)</p>
            <p><strong>Target:</strong> ${secondInn.targetScore} from ${matchState.maxOvers} overs</p>
            ` : ''}
        `;

        // Reset match
        document.getElementById("resetMatch").addEventListener("click", function () {
            localStorage.removeItem("finalMatchState");
            localStorage.removeItem("matchState");
            localStorage.removeItem("matchSettings");
            window.location.href = "setup.html";
        });
    });
}