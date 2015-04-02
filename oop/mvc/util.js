function isNumeric(s) {
    if (s == null) throw "null";
    return s != '' && /^[0-9]*$/.test(s);
}