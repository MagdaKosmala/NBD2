// 2.Łączną ilość środków pozostałych na kartach kredytowych osób w bazie, w podziale na waluty; 

//agregate
db.people.aggregate([
    { $unwind: "$credit" },
	{ $addFields: {balance: {$convert: { input: "$credit.balance", to: "decimal", onError: Error }}} },
    {
        $group: {
            _id: "$credit.currency",
            sumCur: {
                $sum: { $toDouble: "$balance" }
            }
        }
    }
]).forEach(p => printjson(p))


//map reduce
let mapFunction2 = function() {
	if(this.credit){
		this.credit.forEach(function(item){ emit(item.currency, parseFloat(item.balance)); });
	}
}

let reduceFunction2 = function(key, values){
	return Array.sum( values );
};

let result = db.people.mapReduce( mapFunction2,
                     reduceFunction2,
                     { out: { inline: 1 } })
					 
printjson(result)

