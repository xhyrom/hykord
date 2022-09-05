
const splitRegex = /[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/;
const escapedAtRegex = /^\\@/;

const parseNewMeta = (fileContent) => {
    const block = fileContent.split("/**", 2)[1].split("*/", 1)[0];
    const out = {};
    let field = "";
    let accum = "";
    for (const line of block.split(splitRegex)) {
        if (line.length === 0) continue;
        if (line.charAt(0) === "@" && line.charAt(1) !== " ") {
            out[field] = accum.trim();
            const l = line.indexOf(" ");
            field = line.substring(1, l);
            accum = line.substring(l + 1);
        }
        else {
            accum += " " + line.replace("\\n", "\n").replace(escapedAtRegex, "@");
        }
    }
    out[field] = accum.trim();
    delete out[""];
    out.format = "jsdoc";
    return out;
}


console.log(parseNewMeta(`
/**
 * @name         Black Hole
 * @description  Jump into space with this theme. It's just a bedazzled base Discord theme
 * @author       MonsterDev
 * @version      1.0
 * @donate       https://goo.gl/9S8VGb
 * @source       https://github.com/monstrousdev/themes/theme-files/Black-Hole.theme.css
 * @invite       TeRQEPb
 * @authorId     402272736665272320
 */

@import "https://monstrousdev.github.io/themes/black-hole/style.css";

/*
                                                                                                     

Registered: Black Box Theme

*/
`))