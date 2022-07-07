selecINSERT INTO department(name)
values ('Engineering'),
       ('Finance'),
       ('Marketing'),
       ('Sales'); 

INSERT INTO role(title,salary,department_id)
VALUES ("Software Engineer",115000,1),
       ("Project Manager",130000,1),
       ("Accountant",75000,2),
       ("Accounting Manager",95000,2),
       ("Marketing Manager",150000,3),
       ("Marketing Lead",115000,3),
       ("Sales rep",80000,4);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES ("Lyra", "Brennan",1,NULL),
       ("Kia","Brady",2,2),
       ("Louise","Mccray",3,1),
       ("Ayoub","Bass",4,1),
       ("Frances","Robbins",5,2),
       ("Eshan","Burgess",6,NULL),
       ("Vanesa","Zamora",7,4),
       ("Arfa","Lacey",4,2),
       ("Aronas","Bloggs",6,3);