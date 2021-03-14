// 5.Średnia i łączna ilość środków na kartach kredytowych kobiet narodowości polskiej w podziale na waluty. 


//agregacje
print("agregacje")
db.people.aggregate([
	{ $match : {sex:"Female", nationality:"Poland"}},
	{ $unwind: "$credit" },
	{ $addFields: {balance: {$convert: { input: "$credit.balance", to: "decimal", onError: Error }}} },
    {
        $group: {
            _id: {
                currency: "$credit.currency"
            },
            totlebBalance: {
                $sum: "$balance" 
            },
			avgBalance: {$avg: "$balance"}, 
        }
    }
]).forEach(p => printjson(p))


//map reduce
print("map reduce")
let mapFunction5 = function() {
	if(this.sex == "Female" && this.nationality === "Poland"){
		this.credit.forEach(function(item){ 
		
			let key = item.currency;
	        let value = {
				count:1,
				balance: parseFloat(item.balance)
			}
			emit(key, value);
		});
	}
};

let reduceFunction5 = function(key, values){
	return {
		count: values.length,
		balance: Array.sum(values.map(c => c["balance"]))
		
	};
};

let finalizeFunction5 = function (key, value) {
	return  {"total_balance" : value.balance, 
	"average": (value.balance / value.count) };
};

let result = db.people.mapReduce( mapFunction5,
                     reduceFunction5,
                     {
		               query:{sex:"Female"},
                       out: { inline: 1 },
		               finalize: finalizeFunction5
                     }
                   )

printjson(result)

