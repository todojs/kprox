require('../kcolors.js');

describe('kcolor test', function() {

	it('muestra de colores', function() {
	
		console.log('');
		console.log('\t\ttexto en color por defecto');
		console.log('.bold\t\t' + 'texto en color por defecto brillante'.bold);
		
		console.log('.white\t\t' + 'texto en blanco'.white );
		console.log('.whitelight\t' + 'texto en blanco brillante'.whitelight );
		console.log('.white.bold\t' + 'texto en blanco brillante'.white.bold );
		
		console.log('.grey:\t\t' + 'texto en gris'.grey );
//		console.log('.greyligh\t' + 'texto en gris brillante'.greylight );
//		console.log('.grey.bold:\t' + 'texto en gris brillante'.grey.bold );
		
		console.log('.black\t\t' + 'texto en negro'.black );
//		console.log('.blacklight\t' + 'texto en negro brillante'.blacklight );
//		console.log('.black.bold\t' + 'texto en negro brillante'.black.bold );
		
		console.log('.blue\t\t' + 'texto en azul'.blue );
		console.log('.bluelight\t' + 'texto en azul brillante'.bluelight );
		console.log('.blue.bold\t' + 'texto en azul brillante'.blue.bold );
		
		console.log('.cyan\t\t' + 'texto en cian'.cyan );
		console.log('.cyanlight\t' + 'texto en cian brillante'.cyanlight );
		console.log('.cyan.bold\t' + 'texto en cian brillante'.cyan.bold );
		
		console.log('.green\t\t' + 'texto en verde'.green );
		console.log('.greenlight\t' + 'texto en verde brillante'.greenlight );
		console.log('.green.bold\t' + 'texto en verde brillante,'.greenlight );
		
		console.log('.magenta\t' + 'texto en magenta'.magenta );
		console.log('.magentalight\t' + 'texto en magenta brillante'.magentalight );
		console.log('.magenta.bold\t' + 'texto en magenta brillante'.magenta.bold );
		
		console.log('.red\t\t' + 'texto en rojo'.red );
		console.log('.redlight\t' + 'texto en rojo brillante'.redlight );
		console.log('.red.bold\t' + 'texto en rojo brillante'.red.bold );
		
		console.log('.yellow\t\t' + 'texto en amarillo'.yellow );
		console.log('.yellowlight\t' + 'texto en amarillo brillante'.yellowlight );
		console.log('.yellow.bold\t' + 'texto en amarillo brillante'.yellow.bold );
		
		var myObject = {'a': 100, 'b': 200, 'c': 300};
		var myNumber = 400;
		var myText = 'is a test';
		console.log('myObject=' + '%j'.bluelight + ' myMumber=' + '%d'.yellowlight + ' myText=' + '%s'.greenlight, myObject, myNumber, myText );
				
	});
});