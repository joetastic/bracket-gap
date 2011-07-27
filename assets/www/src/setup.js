Hlm.SetupPanel = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        this.forwardButton = new Ext.Button({
            text: 'Forward',
            ui: 'forward',
        });
        this.addAll = new Ext.Button({
            text: 'Add All',
            ui: 'action',
        });

        this.backButton = new Ext.Button({
            text: 'Back',
            ui: 'back',
        });

        this.doneButton = new Ext.Button({
            text: 'Done',
            ui: 'action',
        });

        config = Ext.applyIf({
            fullscreen: true,
            layout: 'card',
            dockedItems: [{
                xtype: 'toolbar',
                ui: 'light',
                dock: 'top',
                items: [
                    this.backButton,
                    this.addAll,
                    {xtype: 'spacer'},
                    this.forwardButton,
                    this.doneButton
                ]
            }],
        }, config);

        Hlm.SetupPanel.superclass.constructor.call(this, config);

        this.forwardButton.on('tap', this.next, this);
        this.addAll.on('tap', function() { this.fireEvent('addAll'); }, this);
        this.backButton.on('tap', this.previous, this);
        this.doneButton.on('tap', function() { this.fireEvent('done'); }, this);

        this.backButton.hide();
        this.doneButton.hide();

        this.addEvents('addAll');
        this.addEvents('done');
    },

    testIndex: function() {
        var layout = this.getLayout();
        var items = layout.getLayoutItems();
        var index = items.indexOf(layout.activeItem);
        if (index == 0) {
            return -1;
        } else if (index == items.length - 1) {
            return 1;
        } else {
            return 0;
        }
    },

    next: function() {
        if (this.testIndex() == -1) {
            this.backButton.show();
        }
        this.getLayout().next({type: 'slide'});
        if (this.testIndex() == 1) {
            this.forwardButton.hide();
            this.doneButton.show();
        }
    },
    previous: function() {
        if (this.testIndex() == 1) {
            this.forwardButton.show();
            this.doneButton.hide();
        }
        this.getLayout().prev({type: 'slide', direction: 'right'});
        if (this.testIndex() == -1) {
            this.backButton.hide();
        }
    },
    onRender: function() {
        Hlm.SetupPanel.superclass.onRender.apply(this, arguments);
        this.getLayout().setActiveItem(0);
    }
});
