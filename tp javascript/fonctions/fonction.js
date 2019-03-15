 var x = document.getElementById('annee');

 var annee =prompt('Entrez une année ');

if(Number(annee) % 4== 0 || Number(annee)%400== 0)
{
	 x.innerHTML += annee +" est une annee bissextile";
}
else
{
	 x.innerHTML += annee +" n'est pas une annne bissextile";
}