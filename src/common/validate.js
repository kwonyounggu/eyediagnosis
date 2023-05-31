// 1< First name or last name <50
// Must be only alphabet characters 
// Trim in each type
export function nameValidation (name, field)
{
	let validName=/^[A-Za-z]+$/;
	if (name.length == 0) 
		return {message: field + ' is required.', valid: false};
	else if (!name.match(validName))
		return {message: field + ' must have alphabet characters only.', valid: false};
	return {message: '', valid: true};
}

export function validateEmail(email, field)
{
   let validEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
   if (email.length == 0)
   		return {message: field + ' is required.', valid: false};
   else if (!email.match(validEmail))
   		return {message: field + ' is not valid.', valid: false};
   return {message: '', valid: true};
}

function validatePassword(password)
{
	let validPassword = /^[A-Za-z]\w{7,14}$/;
	
	if (password.match(validPassword)) return true;
	return false;
}

export function validate2Passwords(password1, password2)
{
	if (validatePassword(password1) && validatePassword(password2) && password1 == password2) 
		return {message: '', valid: true}
	return {message: 'Password(s) is not valid.', valid: false};
} 

export function validateURL(url)
{
	return true;
}