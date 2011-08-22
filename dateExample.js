function testInit(variavel) {
	var dataBase = '28/02/2009';
	var dataTest = '02/01/2009';
	var timeStamp = '1234180454';
	var diaComZero = "01";
	var diaSemZero = "1";
	
	alert(diaComZero.noZero());
	alert(diaSemZero.yesZero());
	alert(WorkDate.isUndefined(variavel));
	alert(WorkDate.getDateTime());
	alert(WorkDate.getDateTime(timeStamp));
	alert(WorkDate.getDate());
	alert(WorkDate.getDate(timeStamp));
	alert(WorkDate.getTime());
	alert(WorkDate.getTime(timeStamp));
	alert(WorkDate.isDate(dataBase));
	alert(WorkDate.isTime("23:15:59"));
	alert(WorkDate.isDateTime("28/02/2008 23:15:59"));
	alert(WorkDate.toTimeStamp("28/02/2008 23:15:59"));
	alert(WorkDate.RFC2822toTimeStamp('Mon, 09 Feb 2009 11:53:27 GMT'));
	alert(WorkDate.getDateFormat('Y-m-d H:i:s'));
	alert(WorkDate.compareDate({baseDate: dataBase,testDate: dataTest,type: 'earlier'}));
	alert(WorkDate.findDate({baseDate: dataBase, type: 'future', qtyDay: 1, qtyMonth: 4, qtyYear: 2, qtyHours: 2, qtyMinutes: 3, qtySeconds: 110}));
	alert(WorkDate.dateDiff({baseDate: dataTest, testDate: dataBase}));
}