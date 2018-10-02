Array.prototype.pqpush = function(item) {
    let array = this;
    array.push(item);
    array.sort(function(a, b) {
        return a.f - b.f;
    });
}