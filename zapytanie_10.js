//Usuń u wszystkich osób o zawodzie „Editor” własność „email”. 
printjson(db.people.update({job:"Editor"},{$unset:{email:""}}, false,true))