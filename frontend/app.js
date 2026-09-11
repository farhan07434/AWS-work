const params = new URLSearchParams(window.location.search);
const code = params.get("code");
if (code)
    {
        exchangeCodesforTokens(code);
    }
console.log("authorization code :",code);
const loginButton = document.getElementById("loginBtn");
loginButton.addEventListener("click",()=>
{
    const domain = cognitoConfig.domain;
    const clientId = cognitoConfig.clientId;
    const redirectUri = "http://localhost:5500/";
    const loginUrl = 
    `https://${domain}/login?client_id=${clientId}` +
    `&response_type=code` +
    `&scope=email+openid+profile` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;
    console.log(loginUrl);
    window.location.href = loginUrl;
});
async function exchangeCodesforTokens(code)
{
    const response = await fetch
    (
        `https://${cognitoConfig.domain}/oauth2/token`,
        {
            method: "POST",
            headers: 
            {
                "Content-Type":"application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(
                {
                    grant_type: "authorization_code",
                    client_id: cognitoConfig.clientId,
                    code: code,
                    redirect_uri: "http://localhost:5500/"
                })
        }
    )
    const tokens = await response.json();
console.log(tokens, 'laiba');
localStorage.setItem("accessToken", tokens.access_token);
localStorage.setItem("idToken",tokens.id_token);
const idToken = localStorage.getItem("idToken");
if(tokens.refresh_token)
{
    localStorage.setItem("refreshToken",tokens.refresh_token);
}
window.history.replaceState({}, document.title, "/");
testBackend();
};
const idToken = localStorage.getItem("idToken");
function parseJwt(token)
{
    const base64Uri = token.split(".")[1];
    const base64 = base64Uri.replace(/-/g,"+").replace(/_/g,"/");
    return JSON.parse(atob(base64));
}
if (idToken) 
    {
        const user = parseJwt(idToken);
        const welcomeMessage = document.getElementById("welcomemessage");
        const loginButton = document.getElementById("loginBtn");
        const logoutButton = document.getElementById("logoutBtn");
        welcomeMessage.textContent = `welcome,${user.email}`;
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";
    }
async function testBackend() 
{
    try
    {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken)
    {
      console.log("no access token found");
      return;
    }
    const response = await fetch("https://1u1502eaj0.execute-api.ap-south-1.amazonaws.com/test",
        {
            method: "GET",
            headers: {"authorization":`Bearer ${accessToken}`}
        }
    );
    console.log("Response received:", response);
    const data = await response.json();
    console.log("Backend response:", data);
    console.log(data);
    }
catch(error)
{
    console.error("backend error:", error);
}
}
