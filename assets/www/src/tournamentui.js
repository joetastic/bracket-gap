Hlm.util.xrange = function(x) {
    var range = [];
    for(var i=0; i < x; i ++) {
        range.push(i);
    }
    return range;
};

Hlm.TournamentUi = Ext.extend(Ext.TabPanel, {
    constructor: function(config) {
        this.teamStore = config.teamStore;
        this.tournament = new Hlm.Tournament(Hlm.util.xrange(this.teamStore.getCount()));
        //BEGIN: TEST
        //for(var i=0; i < this.tournament.getMatches().length; i++) {
        //    this.tournament.submitResult(i, 0);
        //}
        //END: TEST
        var bracket = new Hlm.Bracket({tournament:this.tournament, teams:this.teamStore});
        config = Ext.applyIf({
            items: [
                new Hlm.UpcomingMatches({
                    tournamentUi: this,
                }),
                bracket
            ]
        }, config);

        Hlm.TournamentUi.superclass.constructor.call(this, config);
        this.addEvents('result');
        this.on('result', function() {
            bracket.render();
        });
    }
});

Hlm.renderTeam = function(team) {
    var str = "";
    var i = 0;
    for(; i < team.members.length - 1; i++) {
        str += team.members[i].firstName + " " + team.members[i].lastName + " / ";
    }
    str += team.members[i].firstName + " " + team.members[i].lastName;
    return str;
};



Hlm.UpcomingMatches = Ext.extend(Ext.List, {
    title: 'Upcoming',
    constructor: function(config) {
        this.tournament = config.tournamentUi.tournament;
        this.tournamentUi = config.tournamentUi;

        config = Ext.applyIf({
            itemTpl: [
                '<tpl for="team1.members"> {firstName} </tpl>',
                'vs',
                '<tpl for="team2.members"> {firstName} </tpl>'
            ],
            store: config.tournamentUi.teamStore
        }, config);
        
        Hlm.UpcomingMatches.superclass.constructor.call(this, config);

        this.on('itemtap', function(view, index, item, e) {
            var match = this.getRecord(item);
            var team1 = this.store.getAt(match.teams[0]).data;
            var team2 = this.store.getAt(match.teams[1]).data;
            
            var picker = new Ext.Picker({
                slots: [
                    {
                        name: 'name', 
                        data: [ Hlm.renderTeam(team1), Hlm.renderTeam(team2) ]
                    }
                ]
            });
            picker.show();
            picker.on('pick', function(picker, the, slot) {
                var matchIndex = this.tournament.nextAvailable()[this.index];
                this.tournament.submitResult(matchIndex, slot.selectedIndex);
                this.tournamentUi.fireEvent('result');
                picker.hide();
                this.list.refresh();
            }, {list: this,
                tournamentUi: this.tournamentUi,
                tournament: this.tournament,
                index:index});
        });
    },
    collectData : function(records, startIndex) {
        var results = [];
        var available = this.tournament.nextAvailable();
        for(var i=0; i < available.length; i++) {
            var match = this.tournament.getMatches()[available[i]];
            results.push({
                matchIndex: i,
                team1: this.store.getAt(match.teams[0]).data,
                team2: this.store.getAt(match.teams[1]).data
            });
        }
        return results;
    },
    getRecords: function(nodes) { // Ripped from DataView
        var available = this.tournament.nextAvailable();
        var matches = this.tournament.getMatches();
        var records = [],
            i = 0,
            len = nodes.length;

        for (; i < len; i++) {
            records[records.length] = matches[available[nodes[i].viewIndex]];
        }

        return r;
    },
    getRecord: function(node){ // Ripped from DataView
        var available = this.tournament.nextAvailable();
        var matches = this.tournament.getMatches();
        return matches[available[node.viewIndex]];
    },
});
