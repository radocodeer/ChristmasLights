const people = [
    { name: "alena", age: 25 },
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 },
    { name: "Chris", age: 20 },
  ];
  

for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {                   
        if (people[i].age > people[j].age) {
            let temp = people[i];
            people[i] = people[j];
            people[j] = temp;
        } else if (people[i].age === people[j].age) {
            if (people[i].name.localeCompare(people[j].name) > 0) {
                let temp = people[i];
                people[i] = people[j];
                people[j] = temp;
            }
        }
    }
}

//people.sort((a, b) => a.name.localeCompare(b.name));

console.log(people);

//last thing this comment!

