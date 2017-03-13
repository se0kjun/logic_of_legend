$(function(){
	// set onClick listener for left, right button
	$("#right_button").click(function(){
		var node = $("#items").children()[0];
		$("#items").append(jQuery(node));
	});
	
	$("#left_button").click(function(){
		var node = $("#items").children()[$("#items").children().length-1];
		$("#items").prepend(jQuery(node));
	});

	// format : {color:, width: height: left: title, image }
//	$("#items").children().each(function(){
//		$(this).click(function(){
//			d = new Object();
//			d['color'] = '#FFFFFF';
//			d['width'] = 150;
//			d['height'] = 100;
//			d['left'] = 50;
//			d['top'] = 100;
//			d['title'] = "gate";
//			d['image'] = $(this).attr("src");
//			d['type'] = $(this).attr("id");
//
//			id = $(this).attr("id");
//
//			if ( id == "NOT" ) { 
//				// NOT gate 
//				d['input'] = undefined;
//			} else if ( id == "AND" ) {
//				// AND gate
//				d['input'] = [];
//			} else if ( id == "OR" ) {
//				// OR gate
//				d['input'] = [];
//			} else if ( id == "XOR" ) {
//				// XOR gate
//				d['input'] = [];
//			} else if ( id == "NAND" ) {
//				// NAND gate
//				d['input'] = [];
//			} else if ( id == "NOR" ) {
//				// NOR gate 
//				d['input'] = [];
//			} else if ( id == "ZERO" ) {
//				// ZERO ball
//			} else if ( id == "ONE" ) {
//				// ONE ball
//			}
//
//			d['output'] = 0;
//			d['dst'] = [];
//			click_elements.push(d);
//		});
//	});
});
