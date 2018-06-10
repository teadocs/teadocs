module.exports = function minifyJs (jsCode) {
    var literalStrings;  //temp var.
    function crunch(jsCode) {
        var input, output;
        var i;
        // get code at input
        input = jsCode
        output = input;
        output = replaceLiteralStrings(output);
        output = removeComments(output);
        output = compressWhiteSpace(output);
        output = combineLiteralStrings(output);
        output = restoreLiteralStrings(output);
        //done
        return output;
    }

    function replaceLiteralStrings(s) {
        var i, c, t, lines, escaped, quoteChar, inQuote, literal;
        literalStrings = new Array();
        t = "";
        // Split script into individual lines.
        lines = s.split("\n");
        for (i = 0; i < lines.length; i++) {
            j = 0;
            inQuote = false;
            while (j <= lines[i].length) {
                c = lines[i].charAt(j);
                // If not already in a string, look for the start of one.
                if (!inQuote) {
                    if (c == '"' || c == "'") {
                        inQuote = true;
                        escaped = false;
                        quoteChar = c;
                        literal = c;
                    } else {
                        t += c;
                    }
                // Already in a string, look for end and copy characters.
                } else {
                    if (c == quoteChar && !escaped) {
                        inQuote = false;
                        literal += quoteChar;
                        t += "__" + literalStrings.length + "__";
                        literalStrings[literalStrings.length] = literal;
                    } else if (c == "\\" && !escaped) {
                        escaped = true;
                    } else {
                        escaped = false;
                    }
                    literal += c;
                }
                j++;
            }
            t += "\n";
        }

        return t;
    }

    function removeComments(s) {
        var lines, i, t; 
        // Remove '//' comments from each line.
        lines = s.split("\n");
        t = "";
        for (i = 0; i < lines.length; i++)
            t += lines[i].replace(/([^\x2f]*)\x2f\x2f.*$/, "$1");

        // Replace newline characters with spaces.
        t = t.replace(/(.*)\n(.*)/g, "$1 $2");

        // Remove '/* ... */' comments.
        lines = t.split("*/");
        t = "";
        for (i = 0; i < lines.length; i++)
            t += lines[i].replace(/(.*)\x2f\x2a(.*)$/g, "$1 ");

        return t;
    }

    function compressWhiteSpace(s) {

        // Condense white space.
        s = s.replace(/\s+/g, " ");
        s = s.replace(/^\s(.*)/, "$1");
        s = s.replace(/(.*)\s$/, "$1");

        // Remove uneccessary white space around operators, braces and parentices.
        //[\x21\x25\x26\x28\x29\x2a\x2b\x2c\x2d\x2f\x3a\x3b\x3c\x3d\x3e\x3f\x5b\x5d\x5c\x7b\x7c\x7d\x7e]
        //[!%&()*+,-/:;<=>?[]\{|}~]
        s = s.replace(/\s([\x21\x25\x26\x28\x29\x2a\x2b\x2c\x2d\x2f\x3a\x3b\x3c\x3d\x3e\x3f\x5b\x5d\x5c\x7b\x7c\x7d\x7e])/g, "$1");
        s = s.replace(/([\x21\x25\x26\x28\x29\x2a\x2b\x2c\x2d\x2f\x3a\x3b\x3c\x3d\x3e\x3f\x5b\x5d\x5c\x7b\x7c\x7d\x7e])\s/g, "$1");
        return s;
    }

    function combineLiteralStrings(s) {
        var i;
        s = s.replace(/"\+"/g, "");
        s = s.replace(/'\+'/g, "");
        return s;
    }

    function restoreLiteralStrings(s) {
        var i;
        for (i = 0; i < literalStrings.length; i++)
            s = s.replace(new RegExp("__" + i + "__"), literalStrings[i]);

        return s;
    }

    return crunch(jsCode);
}