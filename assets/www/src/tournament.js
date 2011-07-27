Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
}

Hlm.Match = function(team1, team2) {
    this.teams = [team1, team2];
    this.winner = undefined;
    return this;
};

//This is generally what the data structure looks like
//1111 22aaxx 3by F
//11111111 2222 aaaa xxxx 33 bb yy 4 c z F

//       0         1         2
// index 012345678901234567890123456789
//       111111112222aaaaxxxx33bbyy4czF

// 1111 22 aa xx 3byF
// 0123 45 67 89 0123

// 0123 02 46 13 0120
// 4567 13 57 46 2312

// 11111111 2222 aaaa xxxx 33 bb yy 4czF
// 01234567 0246 8ace 1357 04 15 26 0140
// 89abcdef 1357 9bdf 8ace 26 37 15 4514
var description = "111111112222aaaaxxxx33bbyy4czF";


// (loop for arg from 0 to (- 28 8) by 1 do (insert (number-to-string (floor (log (- 16 arg) 2)))))

Hlm.Tournament = function(teams) {
    var matches = [];
    var log = function(num) { return Math.log(num)/Math.log(2); };
    var bracketSize = Math.pow(2, Math.ceil(log(Math.ceil(teams.length/2))));
    var logBracketSize = log(bracketSize);

    //put a team in every match
    for(var i=0; i < bracketSize; i++) {
        match = new Hlm.Match(teams[i]);
        match.round=0;
        matches.push(match);
        match.x = 0;
        match.y1 = ((-bracketSize*2+1)/2+i*2);
        match.y2 = ((-bracketSize*2+1)/2+i*2+1);
        match.span = 1;
    }
    this.yspan = [-bracketSize-1, bracketSize+2];

    //then put as many opponents as we can (this should be balanced)
    for(var i=0; i < teams.length-bracketSize; i++) {
        matches[i].teams[1] = teams[bracketSize+i];
    }
    //Then we need to fill out the rest of the bracket with blanks
    for(var i=bracketSize/2,
        round=1,
        graphicalSep=2;

        i >= 1;

        i=i/2,
        round++,
        graphicalSep*=2
       ) {
        for(var brack=0; brack < 3; brack++) { // 0 winners, 1 losers, 2 second
            for(var j=0; j < i; j++) {
                match = new Hlm.Match();
                match.roundSize = i;
                match.round = round;
                match.brack = brack;
                match.offset = j;
                matches.push(match);
                match.span = graphicalSep;
                match.y1 = ((-i*2+1)/2+j*2)*graphicalSep;
                match.y2 = ((-i*2+1)/2+j*2+1)*graphicalSep;
                if(brack == 0) {
                    match.x = round;
                } else if(brack == 1) {
                    match.x = 1-(round*2);
                    match.y1 += graphicalSep/2 - 1;
                    match.y2 += graphicalSep/2 - 1;
                } else if(brack == 2) {
                    match.x = -(round*2);
                    match.y1 += graphicalSep - 1;
                    match.y2 += graphicalSep - 1;
                }
            }
        }
    }

    this.xspan = [1-(round*2), round];
    var finalMatch = new Hlm.Match();
    finalMatch.brack = 3; // brack==3 is finals
    matches.push(finalMatch); // final match

    this.submitResult = function(matchIndex, team) {
        matches[matchIndex].winner = team;
        var match = matches[matchIndex];
        var winnerIndex = this.winnerOffset(matchIndex);
        var loserIndex = this.loserOffset(matchIndex);

        if(match.round == 0) {
            matches[winnerIndex].teams[matchIndex%2] = match.teams[team];
            matches[loserIndex].teams[matchIndex%2] = match.teams[team^1];
        } else if(match.brack == 0) { //winners
            matches[winnerIndex].teams[match.offset%2] = match.teams[team];
            matches[loserIndex].teams[1] = match.teams[team^1];
        } else if(match.brack == 1) { //losers
            matches[winnerIndex].teams[0] = match.teams[team];
        } else if(match.brack == 2) { //second
            if(match.roundSize == 1) {
                matches[winnerIndex].teams[1] = match.teams[team];
            } else {
                matches[winnerIndex].teams[match.offset%2] = match.teams[team];
            }
        }
    };

    this.winnerOffset = function(matchIndex) {
        if(matchIndex < bracketSize) { //First round
            //winner
            return bracketSize + Math.floor(matchIndex/2);
        } else if(matchIndex == matches.length-2) {
            return matchIndex + 1;
        }
        match = matches[matchIndex];
        if(match.brack == 0) { //winners
            return matchIndex - match.offset + match.roundSize * 3 + Math.floor(match.offset/2);
        } else if(match.brack == 1) { //losers
            return matchIndex + match.roundSize;
        } else if(match.brack == 2) { //second
            return matchIndex - match.offset + match.roundSize * 1.5 + Math.floor(match.offset/2);
        }
    };
    
    this.loserOffset = function(matchIndex) {
        if(matchIndex < bracketSize) { //First round
            return bracketSize + Math.floor(bracketSize/2) + Math.floor(matchIndex/2);
        }
        match = matches[matchIndex];
        if(match.brack == 0) { //winners
            return matchIndex + match.roundSize * 2;
        }
        return undefined;
    };

    this.nextAvailable = function() {
        var available = [];
        var tournament = this;
        var walk = function(index) {
            if(index == undefined) {
            } else if(matches[index].winner == undefined) {
                if((matches[index].teams[0] != undefined) &&
                   (matches[index].teams[1] != undefined) &&
                   (!available.contains(index)))
                    available.push(index);
            } else {
                walk(tournament.winnerOffset(index));
                if(matches[index].brack == 0) {
                    walk(tournament.loserOffset(index));
                }
            }
        };
        for(var i=0; i < bracketSize; i++) {
            if(matches[i].winner == undefined) {
                available.push(i);
            } else {
                walk(this.winnerOffset(i), this);
                walk(this.loserOffset(i), this);
            }
        }
        return available;
    };

    this.getMatches = function() {
        return matches;
    };
    
    return this;
};
