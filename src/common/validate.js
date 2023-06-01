//const defaultImageURL = 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x';

// 1< First name or last name <50
// Must be only alphabet characters 
// Trim in each type
function validateName (name, field)
{
	let validName=/^[A-Za-z]+$/;
	if (name.length == 0) 
		return {message: field + ' is required.', valid: false};
	else if (!name.match(validName))
		return {message: field + ' must have alphabet characters only.', valid: false};
	return {message: '', valid: true};
}

function validateEmail(email)
{
   let validEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
   if (email.length == 0)
   		return {message: 'Email is required.', valid: false};
   else if (!email.match(validEmail))
   		return {message: 'Email is not valid.', valid: false};
   return {message: '', valid: true};
}

function validatePassword(password)
{
	let validPassword = /^[A-Za-z]\w{7,14}$/;
	
	if (password.match(validPassword)) return true;
	return false;
}

function validate2Passwords(password1, password2)
{
	if (validatePassword(password1) && validatePassword(password2) && password1 === password2) 
		return {message: '', valid: true}
	return {message: 'Password(s) is not valid.', valid: false};
} 

function validateURL(url)
{
	  if (url.length === 0) return {message: '', valid: true};
	
	  let valid = false;
	  try 
	  {
	    let resultURL = new URL(url);   
	    if (/https?/.test(resultURL.protocol)) valid = true;
	    
	  } 
	  catch (e) 
	  { 
		  console.log(e);
	  }
	  finally
	  {
		  if (valid) return {message: '', valid: true};
		  return {message: 'The profile picture URL is not valid.', valid: false};
		  
	  }
}

export function validateRegister(firstName, lastName, email, url, password1, password2)
{
	let temp = null;
	if ((temp=validateName(firstName, "First Name")).valid)
	   if ((temp=validateName(lastName, "Last Name")).valid)
	   	  if ((temp=validateEmail(email)).valid)
	   	  	 if ((temp=validateURL(url)).valid)
	   	  	 	if ((temp=validate2Passwords(password1, password2)).valid) return temp;
	return temp;
	    
}