INSERT INTO department(name)
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
       ("Kia","Brady",2,1),
       ("Louise","Mccray",3,2),
       ("Ayoub","Bass",4,NULL),
       ("Frances","Robbins",5,3),
       ("Eshan","Burgess",6,4),
       ("Vanesa","Zamora",7,3),
       ("Aida","Bugg",1,5),
       ("Teri","Dactyl",3,NULL),
       ("Allie","Grater",5,6);