Ext.regModel('Team', {
    fields: ['id'],
    hasMany: {model: 'Contact', name: 'members'}
});

Hlm.TeamList = Ext.extend(Ext.List, {
    constructor: function(config) {
        this.sourceStore = config.pickedStore
        var teamData = [];
        this.teamStore = new Ext.data.Store({
            model: 'Team',
            data: teamData,
        });
        this.redrawTeams();
        config = Ext.applyIf({
            itemTpl: '<div class="contact2"><tpl for="members">{firstName}<tpl if="xindex != xcount"> / </tpl></tpl></div>',
            store: this.teamStore,
            model: 'Team'
        });
        Hlm.TeamList.superclass.constructor.call(this, config);
    },
    redrawTeams: function() {
        var teamData = this.sourceStore.getRange();
        Hlm.shuffle(teamData); //no shuffle for testing!
        if(teamData.length % 2 == 1) {
            teamData.push(teamData[0]);
        }
        this.teamStore.loadData([], false);
        for(var i=0; i < teamData.length; i += 2) {
            var team = Ext.ModelMgr.create({id: Hlm.generateId()}, 'Team');
            var members = team.members();
            members.add(teamData[i]);
            members.add(teamData[i+1]);
            this.teamStore.add(team);
        }
    },
    onShow: function() {
        this.redrawTeams();
        Hlm.TeamList.superclass.onShow.apply(this, arguments);
    }
});
