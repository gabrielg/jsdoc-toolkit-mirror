function publish(files, context) {
	var template = new JsPlate(context.t+"file.tmpl");
	
	for (var i = 0; i < files.length; i++) {
		var output = template.process(files[i]);
	
		if (context.d) {
			IO.saveFile(context.d, "_"+(i+1)+".xml", output);
		}
	}
}