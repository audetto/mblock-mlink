COMMAND="js-beautify -r -n"
XCMD="xargs -n 1 ${COMMAND}"

find . -maxdepth 1 -name '*.js' | ${XCMD}
find platforms -name '*.js' | ${XCMD}
find mnode -name '*.js' | ${XCMD}
