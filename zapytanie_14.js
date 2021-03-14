// 4.Średnie, minimalne i maksymalne BMI (waga/wzrost^2) dla osób w bazie, w podziale na narodowości; 


//agregacje
print("agregacje")
db.people.aggregate([
  { 
        $addFields: {
            weight_to_decimal: {$convert: { input: "$weight", to: "decimal", onError: Error }},
            height_to_decimal: {$convert: { input: "$height", to: "decimal", onError: Error }} 

        }   
    },
    { 
        $addFields: {
            bmi: {"$divide": ["$weight_to_decimal",{ "$pow": [ { $divide: ["$height_to_decimal", 100]}, 2 ]}] },
        }
    },
    {
        $group: {
            _id: "$nationality",
			avgBMI:  {
				$avg: "$bmi"
			},
			minBMI:  {
				$min: "$bmi"
			},
			maxBMI:  {
				$max: "$bmi"
			}
        }
    }
]).forEach(p => printjson(p))

//map reduce
print("map reduce")
let mapFunction4 = function() {
	let key = this.nationality;
	
	let tmpWeight = parseFloat(this.weight);
	let tmpHeight =  parseFloat(this.height)*0.01;
	
	let tmpBmi = (tmpWeight/(tmpHeight * tmpHeight));
	let value = {
		min: tmpBmi,
		max:tmpBmi,
		count:1, 
		bmi:tmpBmi
	}
	emit(key, value);
};

let reduceFunction4 = function(key, values){
	return values.reduce(function reduce(previous, current, index, array) {
		return {
			min: Math.min(previous.min, current.min),
			max: Math.max(previous.max, current.max),
			count: previous.count + current.count,
			bmi: previous.bmi + current.bmi,
		};
	})
};

let finalizeFunction4 = function(key, value) { 
	value.average = value.bmi / value.count;
	return value;
}

let result = db.people.mapReduce( mapFunction4,
                     reduceFunction4,
                     {
                       out: { inline: 1 },
                       finalize: finalizeFunction4
                     }
                   )

printjson(result)

