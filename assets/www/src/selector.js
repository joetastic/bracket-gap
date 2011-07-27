Hlm.selected = function() {
    var list = new Ext.List({
        itemTpl: '<div class="contact2"><strong>{firstName}</strong> {lastName}</div>',
        store: Hlm.pickedStore,
        onItemDisclosure: function(record) {
            Hlm.pickedStore.remove(record);
        }
    });
    list.addCls('x-list-delete');
    return list;
};

Hlm.picker = function() {
    var itemDisclosure = {
        handler: function(record, btn, index) {
            Hlm.pickedStore.add(record);
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

    return list;
};

Ext.regModel('Contact', {
    fields: ['firstName', 'lastName']
});

Ext.data.ProxyMgr.registerType("gapStorage",
    Ext.extend(Ext.data.Proxy, {
        create: function(operation, callback, scope) {
        },
        read: function(operation, callback, scope) {
            var thisProxy = this;
            console.log('navigator called');

            var phonegapfunc = function(deviceContacts) {
                    //loop over deviceContacts and create Contact model instances
                    console.log('navigator returned');
                    var contacts = [];
                    console.log('length was' + deviceContacts.length);
                    for (var i = 0; i < deviceContacts.length; i++) {
                        var deviceContact = deviceContacts[i];
                        console.log('this name is' + deviceContact.displayName);
                        var contact = new thisProxy.model({
                            firstName: deviceContact.displayName,
                            lastName: ''
                        });
                        contact.deviceContact = deviceContact;
                        contacts.push(contact);
                    }
                    //return model instances in a result set
                    operation.resultSet = new Ext.data.ResultSet({
                        records: contacts,
                        total  : contacts.length,
                        loaded : true
                    });
                    //announce success
                    operation.setSuccessful();
                    operation.setCompleted();
                    //finish with callback
                    try{
                        if (typeof callback == "function") {
                            callback.call(scope || thisProxy, operation);
                        }
                    } catch (e) {
                        console.log("Error in success callback: "+e);
                        printStackTrace();
                    }

                    console.log('navigator callback end');
                }
            if (navigator.service) {
                navigator.service.contacts.find(
                    ['displayName'],
                    phonegapfunc,
                    function(){}
                );
            } else {
                var contact = new thisProxy.model({
                    firstName: 'Joe C',
                    lastName: ''
                });
                operation.resultSet = new Ext.data.ResultSet({
                    records: [contact],
                    total  : 1,
                    loaded : true
                });
                operation.setSuccessful();
                operation.setCompleted();
                if (typeof callback == "function") {
                    callback.call(scope || thisProxy, operation);
                }
            }
        },
        update: function(operation, callback, scope) {
        },
        destroy: function(operation, callback, scope) {
        }
    })
);

Ext.regModel('GapContact', {
    fields: [
        {name: 'firstName', type: "string"},
        {name: 'lastName', type: "string"}
    ],
    proxy: {
        type: "gapStorage"
    }
});

Hlm.pickedStore = new Ext.data.Store({
    model: 'Contact',
    sorters: 'firstName',
    data: [
/////////////////TEST DATA////////////////////////////////////////
//        {firstName: '0', lastName: '0'},
//        {firstName: '1', lastName: '1'},
//        {firstName: '2', lastName: '2'},
//        {firstName: '3', lastName: '3'},
//        {firstName: '4', lastName: '4'},
//        {firstName: '5', lastName: '5'},
//        {firstName: '6', lastName: '6'},
//        {firstName: '7', lastName: '7'},
//        {firstName: '8', lastName: '8'},
//        {firstName: '9', lastName: '9'},
//        {firstName: 'a', lastName: 'a'},
//        {firstName: 'b', lastName: 'b'},
//        {firstName: 'c', lastName: 'c'},
//        {firstName: 'd', lastName: 'd'},
//        {firstName: 'e', lastName: 'e'},
//        {firstName: 'f', lastName: 'f'}
//////////////////////////////////////////////////////////////////
    ]
});

Hlm.contactStore = new Ext.data.Store({
    model: 'GapContact',
    getGroupString : function(record) {
        return record.get('firstName')[0];
    }
});
