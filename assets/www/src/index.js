Ext.ns("Hlm");
Ext.ns("Hlm.util");

Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,

    onReady : function() {
        var selected = Hlm.selected();
        var picker = Hlm.picker();

        var teamlist = new Hlm.TeamList({
            pickedStore: Hlm.pickedStore
        });

        var teamPanel = new Ext.Panel({
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    xtype: 'button',
                    text: 'Redraw',
                    handler: function() {
                        teamlist.redrawTeams();
                    }
                }]
            }],
            items: [teamlist]
        });

        var setupPanel = new Hlm.SetupPanel({
            items: [
                picker, selected, teamPanel
            ]
        });
        var panel = new Ext.Panel({
            fullscreen: true,
            layout: 'card',
            items: [setupPanel]
        });
        picker.on('disclose', setupPanel.next, setupPanel);
        var done = function() {
          panel.add(new Hlm.TournamentUi({
              teamStore: teamlist.teamStore
          }));
          panel.getLayout().next({type: 'slide'})
        };
        setupPanel.on('done', done);
        setupPanel.on('addAll', function() {
            var pickRange = Hlm.contactStore.getRange();
            for(var i=0; i < pickRange.length; i++) {
                Hlm.pickedStore.add(pickRange[i]);
            }
        });

        Hlm.contactStore.load();
        panel.show();

        ////TEST////
        //setupPanel.getLayout().next();
        //setupPanel.getLayout().next();
        //done();
    }
});
