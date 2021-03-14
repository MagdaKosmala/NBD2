// 1.Średnią wagę i wzrost osób w bazie z podziałem na płeć (tzn. osobno mężczyzn, osobno kobiet);

//agregate
db.people.aggregate([
{
  $addFields: {
	 height_to_decimal: {$convert: { input: "$height", to: "decimal", onError: Error }},
	 weight_to_decimal: {$convert: { input: "$weight", to: "decimal", onError: Error }}
  }
},
{ $group: { 
	_id: "$sex", 
	avgHeight: {$avg:"$height_to_decimal"}, 
	avgWeight:{$avg:"$weight_to_decimal"}
}}]).forEach(p => printjson(p))


//map reduce
let mapFunction1 = function() {
	let key = this.sex;
	let value = {
		count:1,
		height:parseFloat(this.height),
		weight:parseFloat(this.weight)
	}
	emit(key, value);
};

let reduceFunction1 = function(key, values){
	let reducedVal = { count:0, height: 0, weight:0};
	for (let idx = 0; idx < values.length; idx++) {
		reducedVal.count += values[idx].count;
		if(!isNaN(values[idx].height)) reducedVal.height += values[idx].height;
		if(!isNaN(values[idx].weight)) reducedVal.weight += values[idx].weight;
	}
	return reducedVal;
};

let finalizeFunction1 = function (key, reducedVal) {
	reducedVal.avgHeight = reducedVal.height/reducedVal.count;
	reducedVal.avgWeight = reducedVal.weight/reducedVal.count;
	return reducedVal;
};

let result = db.people.mapReduce( mapFunction1,
                     reduceFunction1,
                     {
                        out: { inline: 1 },
                       finalize: finalizeFunction1
                     }
                   )

printjson(result)

