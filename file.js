var dropState = true; // Estado en que se puede agregar ficheros
var files = new Map(); // Datos de un fichero
/**
 * Gestión de ficheros
 */
function clean(element) {
    let elementId = element.id;
    if(elementId.startsWith("clean")) elementId = elementId.substring(5);

    if(elementId == "All") {
        files.clear();
        ficherosV1.forEach(function(val){
            let element = `file${val}Text`;
            document.getElementById(element).innerHTML= "Drag and drop here...<br><img src='img/doc.png' width='20' height='20' >";
        });
    }
    else {
        files.delete("file"+elementId);
        document.getElementById("file"+elementId+"Text").innerHTML= "Drag and drop here...<br><img src='img/doc.png' width='20' height='20' >";
    }
}

function fileHandler(file,elementId) {
	if(file.name.substr(file.name.length - 5) != ".json" ) {
        alert("La extensión debe ser .json");
        return false;
    }
    document.getElementById(elementId+"Text").innerHTML= "LOADING FILE...  <img src='img/rainbow.png' height='20' >";
    fileToJson(file,elementId+"");
    console.log('saving file.name['+file.name+'] on['+elementId+']');
}

//Drop invididual
function dropHandler(ev,element) {
	console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
	
	if(!dropState) { alert("Can't drop afer generate process");	removeDragData(ev); return false; }
	
    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for(var i = 0;i<ev.dataTransfer.items.length;i++){
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                fileHandler(file,element.id);
            }
        }
    // Use DataTransfer interface to access the file(s)
    } else if (ev.dataTransfer.files.length > 0) {
        for(var i = 0;i<ev.dataTransfer.files.length;i++){
            var file = ev.dataTransfer.files[i];
            fileHandler(file,element.id);
        }
    }
	
    // Pass event to removeDragData for cleanup
    removeDragData(ev);
}

// Drop de varios ficheros
function dropHandlerAll(ev) {
	console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
	
    if(!dropState) { alert("Can't drop files in this state, you have to refresh the page");	removeDragData(ev); return false; }

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                let elementId = dafaultElementId(file.name);
                if (elementId == "") continue;
				fileHandler(file,elementId);
            }
        }

    // Use DataTransfer interface to access the file(s)
    } else {
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            var file = ev.dataTransfer.files[i];
            let elementId = dafaultElementId(file.name);
            if (elementId == "") continue;
			fileHandler(file,elementId);
        }
    } 

    // Pass event to removeDragData for cleanup
    removeDragData(ev);
}

function dafaultElementId(fileName) {
    if(fileName.substring(fileName.length-5) == ".json") {
        let filen = fileName.substring(0,fileName.length-4);
        filen = filen.toUpperCase();
        if(ficherosV1.includes(filen)) return `file${filen}`;
    }
	return "";
}

// Cosas del gragAndDrop que hice copy/paste npi que hagan
function dragOverHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function removeDragData(ev) {
    console.log('Removing drag data')

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to remove the drag data
        ev.dataTransfer.items.clear();
    } else {
        // Use DataTransfer interface to remove the drag data
        ev.dataTransfer.clearData();
    }
}

// Aquí convertimos el fichero en texto e inicializamos las variables para trabajar los datos
function fileToJson(file,elementId) {
    console.log("Reading: "+elementId);
    var fr = new FileReader();
	fr.onload = function() {
		document.getElementById(elementId + "Text").innerHTML = "Pocessing... <img src='img/pocessing.png' width='20' height='20' >";
       	
		// el timeout es solo para que pinte los estados
		setTimeout(function () {
			
			var fileText = fr.result;
            console.log("Procesing: "+elementId);
            var arrAnt = files.get(elementId);
            arrAnt = (arrAnt || []);
            var arrprocesado = JSON.parse(fileText);
			files.set(elementId,arrprocesado);
			console.log("Done: "+elementId);
			document.getElementById(elementId + "Text").innerHTML = "Last file: "+file.name+"["+(arrprocesado.configuration?"configuration":"wtf")+"] <img src='img/check.png' width='20' height='20' >";
			
		}, 10);
    }
    fr.readAsText(file); //,"ISO-8859-1");
}