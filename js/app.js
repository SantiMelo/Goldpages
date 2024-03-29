const urlBase = 'http://goldpagescop.com';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let error = "";

function login() 
{
    userId = 0;
	firstName = "";
	lastName = "";
	error = "";

    const login = document.getElementById("loginName").value;
    const password = document.getElementById("loginPassword").value;
	const hash = md5(password);

    document.getElementById("loginResult").innerHTML = "";

    
	const tmp = {login:login,password:hash};
	const jsonPayload = JSON.stringify( tmp );
    
    const url = urlBase + '/LAMPAPI/Login.' + extension;
	const xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200)
			{
				const jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
				error = jsonObject.error;
				
			if( error !== "" )
			{
				document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
				return;
			}
		
			firstName = jsonObject.firstName;
			lastName = jsonObject.lastName;

			saveCookie();
	
			window.location.href = "contacts.html";
		}

	};
	xhr.send(jsonPayload);
}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function register() 
{
	error = "";

    const first = document.getElementById("firstName").value;
    const last = document.getElementById("lastName").value;
	const login = document.getElementById("signupUsername").value;
	const password = document.getElementById("regPassword").value;
	const confirmPassword = document.getElementById("conPassword").value;
	const hash = md5(password);
    
    document.getElementById("registerResult").innerHTML = "";

	if (password !== confirmPassword)
		{
			document.getElementById("registerResult").innerHTML = "Passwords do not match";
			return;
		}

	if (password === "" || password === null)
		{
			document.getElementById("registerResult").innerHTML = "Invalid password";
			return;
		}

	if (login === "" || login === null)
		{
			document.getElementById("registerResult").innerHTML = "Invalid username";
			return;
		}
	
	const tmp = {firstName:first, lastName:last, login:login, password:hash};
	const jsonPayload = JSON.stringify( tmp );
	
    const url = urlBase + '/LAMPAPI/Register.' + extension;
	const xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function ()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				const jsonResponse = JSON.parse(xhr.responseText);
				error = jsonResponse.error;
				document.getElementById("registerResult").innerHTML = "Signed in.";

			if( error !== "" )
			{
				document.getElementById("registerResult").innerHTML = "Sign Up Failed";
				return;
			}
	
				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);	
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}

}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}