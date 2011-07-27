Hlm.IdGenerator = function() {
    this.idCounter = 0;
    this.getId = function() {
        this.idCounter += 1;
        return this.idCounter; //ids start at 1
    };
    return this;
}();

Hlm.generateId = function() { return Hlm.IdGenerator.getId(); }
