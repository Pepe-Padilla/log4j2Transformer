var restult = [];
var appenders = [];
var loggers = [];
var roots = [];
function calculate(){
    var l4j = files.get("fileL4j");
    if(!l4j) {
        console.log(l4j);
        console.error("empty fileL4j");
        return;
    }

    appenders = [];
    for(let append of l4j.configuration.appender) {
        console.log(append);
        var aName = append._name;
        var aFileMod = "";
        var aFile = "";
        if(append.rollingPolicy) {
            aFileMod = append.rollingPolicy.param._value;
            aFile = aFileMod.split(".log.")[0] + ".log";
        } else if(append.param && Array.isArray(append.param)) {
            var datePattern = "yyyy-MM-dd"; //default
            for(var i=0;i<append.param.length;i++) {
                var paramI = append.param[i];
                switch(paramI._name) {
                    case "File":
                        aFile = paramI._value;
                        break;
                    case "DatePattern":
                        datePattern = paramI._value;
                        break;
                }
            }
            aFileMod = aFile + ".%d{"+datePattern+"}"; 
        } else {
            console.error("appender format not know");
            return;
        }
        var aLayout = append.layout.param._value;

        appenders.push(`    <!-- Appender: ${aName} -->`);
        appenders.push(`    <RollingFile name="${aName}" fileName="${aFile}" filePattern="${aFileMod}">`);
        appenders.push(`      <PatternLayout pattern="${aLayout}" />`);
        appenders.push(`      <Policies>`);
        appenders.push(`        <TimeBasedTriggeringPolicy  interval="1" modulate="true" />`);
        appenders.push(`      </Policies>`);
        appenders.push(`    </RollingFile>`);
        appenders.push("");
    }

    loggers = [];
    for(let log of l4j.configuration.logger) {
        console.log(log);
        var lLevel = log.level._value;
        var lName = log._name;
        var lAppender = log["appender-ref"]._ref;
        var lAdditivity = log._additivity;
        loggers.push(`    <!-- Logger: ${lName} -->`);
        loggers.push(`    <Logger name="${lName}" level="${lLevel}" additivity="${lAdditivity}">`);
        loggers.push(`      <AppenderRef ref="${lAppender}" />`);
        loggers.push(`    </Logger>`);
        loggers.push("");
    }

    roots=[];
    if(Array.isArray(l4j.configuration.root)) {
        for(let r of l4j.configuration.root) {
            console.log(r);
            var rLevel = r.level._value;
            var rRef = r["appender-ref"]._ref;
            roots.push(`      <AppenderRef ref="${rRef}" level="${rLevel}"/>`);
        }
    } else {
        var r = l4j.configuration.root;
        console.log(r);
        var rLevel = r.level._value;
        var rRef = r["appender-ref"]._ref;
        roots.push(`      <AppenderRef ref="${rRef}" level="${rLevel}"/>`);
    }

    //resultado final
    restult=[];
    restult.push('<?xml version="1.0" encoding="UTF-8"?>');
    restult.push('<Configuration status="WARN">');
    if(appenders.length > 0){
        restult.push('  <Appenders>');
        restult = restult.concat(appenders);
        restult.push('  </Appenders>');    
    }
    if(loggers.length > 0) {
        restult.push('  <Loggers>');
        restult =restult.concat(loggers);
        if(roots.length > 0) {
            restult.push('    <Root>');
            restult =restult.concat(roots);
            restult.push('    </Root>');
        }
        restult.push('  </Loggers>');
    }
    restult.push('</Configuration>');

    var text = restult.join("\n");
    const filename = "log4j2.xml";
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    document.body.removeChild(element);
}