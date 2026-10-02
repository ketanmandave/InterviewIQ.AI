## Authentication

1. How did you combine manual login and Google login?
Answer:
“I use different identity-verification methods but create the same application session afterward. Manual login verifies the password using bcrypt. Google login verifies a signed Firebase ID token. After verification, both methods find the user in MongoDB and issue the same JWT access-token cookie.”

2. Why use one User model for both login methods?
Answer:
“It prevents duplicate account systems. A manual user has a password, a Google user has a googleUid, and a linked account can have both. Email is used to identify and link users.”

3. Why is the password optional in the schema?
Answer:
“Google users do not create a password. Therefore, password cannot be required for every user. Manual registration still validates that a password is present before creating the user.”

7. How does bcrypt verify a password without decrypting it?
Answer:
“Bcrypt hashes the submitted password using the salt information stored inside the existing hash. It then compares the result. Password hashes are one-way and are not decrypted.”

## Google authentication questions

8. Why shouldn’t the server trust the email sent by the frontend?
Answer:
“Frontend data can be modified by the user. An attacker could send someone else’s email directly to the API. Therefore, the frontend sends a signed Firebase ID token, and the backend obtains the trusted email only after verifying that token.”

9. What is a Firebase ID token?
Answer:
“It is a short-lived JWT issued by Firebase after successful authentication. It contains claims such as the user ID, email, expiration time, issuer, and audience.”

10. What does the backend verify in the Firebase token?
Answer:
“The backend verifies:
- The cryptographic signature using Google’s public keys.
- The expiration time.
- The signing algorithm.
- The issuer.
- The audience, which must match my Firebase project.
- The token subject or Firebase user ID.”

11. Why verify email_verified?
Answer:
“Account linking is based on email. I should link accounts only when the identity provider confirms that the user owns that email address.”

12. What is the difference between a Firebase token and your application JWT?
Answer:
“The Firebase token proves the user’s Google identity. 
My application JWT represents the authenticated InterviewIQ session. 
Firebase is used during Google login, while my JWT is used for protected InterviewIQ APIs.”

## JWT and cookie questions

13. What information do you store in your JWT?
Answer:
“I currently store only the MongoDB user ID.”
jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
);
“Keeping the payload small also avoids exposing unnecessary user information.”

14. Why store the JWT in an HTTP-only cookie?
Answer:
“An HTTP-only cookie cannot be accessed through browser JavaScript. This reduces the risk of token theft through an XSS attack.”

15. What do secure and sameSite mean?
Answer:
- httpOnly: JavaScript cannot read the cookie.
- secure: the cookie is sent only over HTTPS.
- sameSite: controls whether the cookie is sent with cross-site requests.
“In development I use lax without HTTPS. In production I use secure: true and sameSite: "none" when frontend and backend are on different origins.”

16. Why is withCredentials: true required in Axios?
Answer:
“It tells the browser to send and receive cookies during cross-origin API requests.”
axios.post(url, data, {
    withCredentials: true
});
The backend must also allow credentials:
cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
});

17. How does your authentication middleware work?
Answer:
“The middleware gets the access token from the cookie or Authorization header, verifies its signature and expiration, finds the user using the decoded userId, attaches that user to req.user, and then calls next().”

18. Why support the Authorization header as well as cookies?
Answer:
“Web browsers can use cookies, while mobile clients or external API clients may prefer a Bearer token in the Authorization header.”

20. Why is logout a POST request?
Answer:
“Logout changes session state by clearing the authentication cookie. GET should be used for read-only operations, so POST is more appropriate.”

## Database and account-linking questions

21. What happens if someone registers with an existing email?
Answer:
“The controller checks for an existing user and returns HTTP 409 Conflict.”

22. What happens if a manual user later signs in with Google?
Answer:
“If Google verifies the same email, I attach the Google UID to the existing user. The account can then support both login methods.”

23. What happens if a Google-only user attempts manual login?
Answer:
“The user has no stored password, so comparePassword() returns false and login fails with a generic invalid-credentials response.”

24. Why use a sparse unique index for googleUid?
Answer:
“Google UIDs must be unique, but manual users may not have one. sparse: true applies the unique constraint only to documents where googleUid exists.”
googleUid: {
    type: String,
    unique: true,
    sparse: true
}


26. What does asyncHandler do?
Answer:
“It catches rejected promises from async controllers and passes the error to Express using next(error). This avoids writing a try/catch block in every controller.”

27. Why create a custom ApiError class?
Answer:
“It lets me attach an HTTP status code and structured error information. The centralized error middleware can then return a consistent JSON response.”

28. What is the purpose of ApiResponse?
Answer:
“It provides a consistent response structure containing statusCode, message, data, and success.”

29. Why should login errors be generic?
Answer:
“Returning ‘user not found’ and ‘wrong password’ separately helps attackers discover registered emails. A generic response such as ‘Invalid email or password’ reveals less information.”