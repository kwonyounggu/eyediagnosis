import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const Register = () => 
{
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => 
    {
        // Registered
        const user = userCredential.user;
        updateProfile
        (
			user, 
			{
            	displayName: name,
            	photoURL: avatar ? avatar : 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x'
        	}
        )
        .then
        (
			() => 
			{
            	alert('Registered, please login.');
        	}
        )
        .catch
        (
			(error) => 
			{
            	alert(error.message);
        	}
        )
    })
    .catch
    (
		(error) => 
		{
        	const errorCode = error.code;
        	const errorMessage = error.message;
        	alert(errorMessage);
    	}
    );
}