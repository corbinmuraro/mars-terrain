var duration = 600,
    stepsPerGlyph = 3,
    codeGlyphs = "ABCDEFGHIJKLMNOPQRSTUWVXYZ1234567890";

// get a random string from the given set,
// or from the 33 - 125 ASCII range
function randomString(set, length) {
    var string = "", i, glyph;
    for(i = 0 ; i < length ; i++) {
        glyph = Math.random() * set.length;
        string += set[glyph | 0];
    }
    return string;
}

// this function starts the animation. Basically a closure
// over the relevant vars. It creates a new separate span
// for the code text, and a stepper function that performs
// the animation itself
function decode(element, _class) {
    console.log(_class);
    var text = element.text(),
        span = $("<span/>").addClass(_class).insertAfter(element),
        interval = duration / (text.length * stepsPerGlyph),
        step = 0,
        length = 0,
        stepper = function () {
            if(++step % stepsPerGlyph === 0) {
                length++;
                element.text(text.slice(0, length));
            }
            if(length <= text.length) {
                span.text(randomString(codeGlyphs, text.length - length));
                setTimeout(stepper, interval);
            } else {
                span.remove();
            }
        };
    element.text("");
    stepper();
}