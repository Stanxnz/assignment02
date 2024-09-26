// Importing ANSI codes from ansi.mjs
import { ANSI } from './ansi.mjs';

const ART = `
${ANSI.COLOR.GREEN}  ______    ____     __      ______    ____      __      ______    ___      ___  ${ANSI.RESET}
${ANSI.COLOR.YELLOW} |      |  |    |   /  ]    |      |  /    |    /  ]    |      |  /   \\    /  _] ${ANSI.RESET}
${ANSI.COLOR.BLUE} |      |   |  |   /  /     |      | |  o  |   /  /     |      | |     |  /  [_  ${ANSI.RESET}
${ANSI.COLOR.RED} |_|  |_|   |  |  /  /      |_|  |_| |     |  /  /      |_|  |_| |  O  | |    _] ${ANSI.RESET}
${ANSI.COLOR.GREEN}   |  |     |  | /   \\_       |  |   |  _  | /   \\_       |  |   |     | |   [_  ${ANSI.RESET}
${ANSI.COLOR.YELLOW}   |  |     |  | \\     |      |  |   |  |  | \\     |      |  |   |     | |     | ${ANSI.RESET}
${ANSI.COLOR.BLUE}   |__|    |____| \\____|      |__|   |__|__|  \\____|      |__|    \\___/  |_____| ${ANSI.RESET}
`;

function showSplashScreen() {
    console.log(ART);
}

export default showSplashScreen;
