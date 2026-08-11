const roles = [

"Cloud Engineer",

"DevSecOps Enthusiast",

"AWS Cloud Practitioner",

"Terraform Engineer",

"CI/CD Builder",

"Web Developer"

];

let roleIndex = 0;

let charIndex = 0;

let deleting = false;

const typing = document.querySelector(".typing");

function type(){

const current = roles[roleIndex];

if(!deleting){

typing.textContent = current.substring(0,charIndex++);

if(charIndex > current.length){

deleting = true;

setTimeout(type,1800);

return;

}

}else{

typing.textContent = current.substring(0,charIndex--);

if(charIndex < 0){

deleting = false;

roleIndex++;

if(roleIndex >= roles.length){

roleIndex = 0;

}

}

}

setTimeout(type,deleting?50:90);

}

type();