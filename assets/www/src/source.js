Hlm.selector =  function(config) {
    Ext.apply(config, {
        fullscreen: true,
        layout: 'card'
    });

    Hlm.selector.superclass.constructor.call(this, config);

    this.forwardButton = new Ext.Button({
        text: 'Forward',
        ui: 'forward',
        scope: this,
        handler: this.next
    });
    this.backButton = new Ext.Button({
        text: 'Back',
        ui: 'back',
        scope: this,
        handler: this.previous
    });
    this.doneButton = new Ext.Button({
        text: 'Done',
        ui: 'action',
        scope: this,
        handler: this.done
    });

    this.backButton.hide();
    this.doneButton.hide();

    this.addDocked(new Ext.Toolbar({
        ui: 'light',
        dock: 'top',
        items: [this.backButton, {xtype: 'spacer'}, this.forwardButton, this.doneButton]
    }));

    var pickedList = new Ext.List({
        itemTpl: '<div class="contact2"><strong>{firstName}</strong> {lastName}</div>',
        store: Hlm.pickedStore
    });

    var that=this;
    var itemDisclosure = {
        handler: function(record, btn, index) {
            console.log("disclosed");
            Hlm.pickedStore.add(record);
            that.next();
        }
    };
    var list = new Ext.List({
        itemTpl: '<div class="contact2"><strong>{firstName}</strong> {lastName}</div>',
        selModel: {
            mode: 'SINGLE',
            allowDeselect: true
        },
        grouped: true,
        indexBar: true,

        onItemDisclosure: itemDisclosure,
        store: Hlm.contactStore
    });
    this.add(list);
    this.add(pickedList);

    this.addEvent('done');
};

Ext.extend(Hlm.selector, Ext.Panel, {
    next: function() {
        this.backButton.show();
        this.forwardButton.hide();
        this.doneButton.show();
        this.getLayout().next({type: 'slide'});
    },
    previous: function() {
        this.backButton.hide();
        this.forwardButton.show();
        this.doneButton.hide();
        this.getLayout().prev({type: 'slide', direction: 'right'});
    },
    done: function() {
        this.backButton.hide();
        this.doneButton.show();
        this.getLayout().next({type: 'slide'});
        this.fireEvent('done');
    }
});


Ext.regModel('Contact', {
    fields: ['firstName', 'lastName']
});

Ext.regModel('Team', {
    fields: ['player1', 'player2']
});

Hlm.pickedStore = new Ext.data.Store({
    model: 'Contact',
    sorters: 'firstName',
    data: []
});

Hlm.contactStore = new Ext.data.Store({
    model: 'Contact',
    sorters: 'firstName',

    getGroupString : function(record) {
        return record.get('firstName')[0];
    },

    data: [
        {firstName: 'Tommy', lastName: 'Maintz'},
        {firstName: 'Ed', lastName: 'Spencer'},
        {firstName: 'Jamie', lastName: 'Avins'},
        {firstName: 'Aaron', lastName: 'Conran'},
        {firstName: 'Dave', lastName: 'Kaneda'},
        {firstName: 'Michael', lastName: 'Mullany'},
        {firstName: 'Abraham', lastName: 'Elias'},
        {firstName: 'Jay', lastName: 'Robinson'}
    ]
});