// 3.Listę unikalnych zawodów; 

print("runCommand")
printjson(db.runCommand({"distinct":"people", "key":"job"}))

//agregacje
print("agregacje 1")
db.people.aggregate([
	{ $group: { _id: "$job" } }
]).forEach(p => printjson(p))

print("agregacje 2")
printjson(db.people.distinct("job"))

//map reduce
print("map reduce")
let mapFunction3 = function() {
	emit(this.job, "")
}

let reduceFunction3 = function(key, values){
	return "";
};

let result = db.people.mapReduce(
					mapFunction3,
					reduceFunction3,
                    { out: { inline: 1 } })
					 
printjson(result)

