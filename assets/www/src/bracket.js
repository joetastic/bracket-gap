Hlm.Bracket = Ext.extend(Ext.BoxComponent, {
    title: 'Bracket',
    autoEl: {
        tag   : 'canvas'
    },
    constructor: function(config) {
        this.tournament = config.tournament;
        this.teams = config.teams;
        Hlm.Bracket.superclass.constructor.apply(this, arguments);
    },
    
    onRender : function() {
        this.el = Ext.get(document.createElement('canvas'));
        Hlm.Bracket.superclass.onRender.apply(this, arguments);
    },
    onShow: function() {
        Hlm.Bracket.superclass.onShow.apply(this, arguments);
        this.draw(this.getWidth(), this.getHeight());
    },
    draw: function(width, height) {
        this.el.dom.width = this.getWidth();
        this.el.dom.height = this.getHeight();

        var ctx = this.el.dom.getContext("2d");
        var bracketWidth = (this.tournament.xspan[1]-this.tournament.xspan[0]);
        var bracketHeight = (this.tournament.yspan[1]-this.tournament.yspan[0]);
        var xscale = this.getWidth()/bracketWidth;
        var yscale = this.getHeight()/bracketHeight;

        ctx.beginPath();
        ctx.strokeStyle="#000";
        ctx.lineWidth = 1;

        // put 0,0 in the middle
        ctx.setTransform(1,0,0,1,0,0);
        ctx.translate(-this.tournament.xspan[0]*xscale,
                      -this.tournament.yspan[0]*yscale);

        ctx.rect(this.tournament.xspan[0]*xscale, 
                 this.tournament.yspan[0]*yscale, 
                 bracketWidth*xscale, 
                 bracketHeight*yscale);
        ctx.stroke();
        

        var matches = this.tournament.getMatches();
        for(var i=0; i < matches.length; i ++) {
            console.log(matches[i].x, matches[i].y);
            var x = matches[i].x,
                y1 = matches[i].y1,
                y2 = matches[i].y2;
            if(matches[i].teams[0] != undefined) {
                var team1 = this.teams.getAt(matches[i].teams[0]).data;
                ctx.fillText(Hlm.renderTeam(team1), (x-.5)*xscale, y1*yscale-1);
            }

            ctx.moveTo((x-.5)*xscale, y1*yscale);
            ctx.lineTo((x+.5)*xscale, y1*yscale);

            if(matches[i].teams[1] != undefined)  {
                var team2 = this.teams.getAt(matches[i].teams[1]).data;
                ctx.fillText(Hlm.renderTeam(team2), (x-.5)*xscale, y2*yscale-1);
            }

            ctx.moveTo((x-.5)*xscale, y2*yscale);
            ctx.lineTo((x+.5)*xscale, y2*yscale);
            ctx.stroke();
        };
    }
});
