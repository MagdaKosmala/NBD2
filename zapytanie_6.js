//7.Dodaj siebie do bazy, zgodnie z formatem danych użytych dla innych osób (dane dotyczące karty kredytowej, adresu zamieszkania i wagi mogą być fikcyjne); 

let person = db.people.insert({sex:"Female", first_name:"Magdalena", last_name:"Kosmala", job:"Software Developer", email:"sxxx@pjwstk.edu.pl", location:{city:"Abc", address:{streetname:"Abc", streetnumber:"1"}},description:"lorem ipsum dolor sit amet consectetuer adipiscing elit proin interdum mauris", height:"160", weight:"50", birth_date:new Date(1981,7,11), nationality:"Poland",credit:[{type:"switch", number:"4459888939100098699", currency:"PLN", balance:"5517.06"}]})

printjson(person)
