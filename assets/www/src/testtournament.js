Hlm = {}
require('tournament')

exports.resultTest = function(test) {
    var team0 = "team0";
    var team1 = "team1";
    var team2 = "team2";
    var team3 = "team3";
    var team4 = "team4";
    var team5 = "team5";
    var team6 = "team6";
    var team7 = "team7";

    t = Hlm.Tournament([
        team0, team1, team2, team3,
        team4, team5, team6, team7
    ]);
    matches = t.getMatches();

    t.submitResult(0, 0);
    test.equal(matches[4].teams[0], team0);
    test.equal(matches[6].teams[0], team4);
    t.submitResult(1, 0);
    test.equal(matches[4].teams[1], team1);
    test.equal(matches[6].teams[1], team5);
    t.submitResult(2, 0);
    test.equal(matches[5].teams[0], team2);
    test.equal(matches[7].teams[0], team6);
    t.submitResult(3, 0);
    test.equal(matches[5].teams[1], team3);
    test.equal(matches[7].teams[1], team7);
    t.submitResult(4, 0);
    test.equal(matches[10].teams[0], team0);
    test.equal(matches[8].teams[0], team1);
    t.submitResult(5, 0);
    test.equal(matches[10].teams[1], team2);
    test.equal(matches[9].teams[0], team3);
    t.submitResult(6, 0);
    test.equal(matches[8].teams[1], team4);
    t.submitResult(7, 0);
    test.equal(matches[9].teams[1], team6);
    t.submitResult(8, 0);
    test.equal(matches[11].teams[0], team1);
    t.submitResult(9, 0);
    test.equal(matches[11].teams[1], team3);
    t.submitResult(10, 0);
    test.equal(matches[12].teams[0], team2);
    test.equal(matches[13].teams[0], team0);
    t.submitResult(11, 0);
    test.equal(matches[12].teams[1], team1);
    t.submitResult(12, 0);
    test.equal(matches[13].teams[1], team2);
    test.done();
};

exports.availableTest = function(test) {
    var team0 = "team0";
    var team1 = "team1";
    var team2 = "team2";
    var team3 = "team3";
    var team4 = "team4";
    var team5 = "team5";
    var team6 = "team6";
    var team7 = "team7";

    t = Hlm.Tournament([
        team0, team1, team2, team3,
        team4, team5, team6, team7
    ]);
    matches = t.getMatches();

    test.deepEqual(t.nextAvailable(), [0,1,2,3]);
    t.submitResult(0, 0);
    test.deepEqual(t.nextAvailable(), [1,2,3]);
    t.submitResult(1, 0);
    test.deepEqual(t.nextAvailable(), [4,6,2,3]);
    t.submitResult(2, 0);
    test.deepEqual(t.nextAvailable(), [4,6,3]);
    t.submitResult(3, 0);
    test.deepEqual(t.nextAvailable(), [4,6,5,7]);
    t.submitResult(4, 0);
    test.deepEqual(t.nextAvailable(), [6,5,7]);
    t.submitResult(5, 0);
    test.deepEqual(t.nextAvailable(), [10,6,7]);
    t.submitResult(6, 0);
    test.deepEqual(t.nextAvailable(), [10,8,7]);
    t.submitResult(7, 0);
    test.deepEqual(t.nextAvailable(), [10,8,9]);
    t.submitResult(8, 0);
    test.deepEqual(t.nextAvailable(), [10,9]);
    t.submitResult(9, 0);
    test.deepEqual(t.nextAvailable(), [10,11]);
    t.submitResult(10, 0);
    test.deepEqual(t.nextAvailable(), [11]);
    t.submitResult(11, 0);
    test.deepEqual(t.nextAvailable(), [12]);
    t.submitResult(12, 0);
    test.deepEqual(t.nextAvailable(), [13]);
    test.done();
};