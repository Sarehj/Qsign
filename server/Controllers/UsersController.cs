using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Context;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using RestSharp;

namespace server.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    const string READ_SCOPE = "Authentication and read:messages needed, and you got it";
    public DataContext _context;

    public UserController(DataContext context)
    {
        _context = context;
    }

    [Route("/CreateAccount")]
    [HttpPost]
    public ActionResult CreateAccount(ClientCreateAccountModel newAccount)
    {
        var userNameExist = from u in _context.Users where u.Email == newAccount.Email select u;
        if (userNameExist.FirstOrDefault() is not null) return Conflict("Username already exist");

        RSACryptoServiceProvider RSAalg = new RSACryptoServiceProvider();
        string PubKeyPem = RSAalg.ExportRSAPublicKeyPem();
        string PrivKeyPem = RSAalg.ExportRSAPrivateKeyPem();

        var userToAdd = new User
        {
            Id = Guid.NewGuid().ToString(),
            PublicId = Guid.NewGuid(),
            Email = newAccount.Email,
            FirstName = newAccount.FirstName,
            LastName = newAccount.LastName,
            Password = newAccount.Password,
            PubKeyPem = PubKeyPem,
            PrivKeyPem = PrivKeyPem
        };

        _context.Users.Add(userToAdd);
        
        var _pendingInvites = _context.PendingCommunications.Where(p => p.ToEmail == userToAdd.Email).Select(p => p);
        if(_pendingInvites is not null)
        {
            foreach(var invite in _pendingInvites)
            {
                var com = new CommunicationInfo
                {
                    Id = Guid.NewGuid(),
                    FromPublicId = invite.FromPublicId,
                    ToPublicId = userToAdd.PublicId,
                    DocumentId = invite.DocumentId,
                    IsSigned = false,
                    SignatureId = Guid.Empty
                };
                _context.CommunicationInfos.Add(com);
                _context.PendingCommunications.Remove(invite);
            }
        }
        
        _context.SaveChanges();

        return CreatedAtAction(nameof(Login), userToAdd);
    }

    // public void SendEmail()
    // {
    //     var gmailClient = new System.Net.Mail.SmtpClient {
    //         Host = "smtp.gmail.com",
    //         Port = 587,
    //         EnableSsl = true,
    //         UseDefaultCredentials = false,
    //         Credentials = new System.Net.NetworkCredential("noreplyqsign@gmail.com", "SRCdnfs.2022")
    //     };
    // }

    [Route("/Login")]
    [HttpPost]
    public ActionResult<User> Login(ClientLoginModel user)
    {
        var _user = from u in _context.Users
            where u.Email == user.Email
            where u.Password == user.Password
            select u;
        if (_user.FirstOrDefault() is null) return BadRequest("Wrong username or password");
        var token = Createtoken().Value;
        
        
        return Accepted(_user);
    }

    [Route("/GetAllUsers")]
    [HttpGet]
    public ActionResult<List<User>> GetAll()
    {
        var users = from u in _context.Users select u;
        return users.ToList();
    }

    [HttpGet]
    [Route("/GetUserPublicInfo/{id}")]
    public ActionResult<UserPublicInfoViewModel> GetUserPublicInfo(Guid id)
    {
        var _user = from u in _context.Users where u.PublicId == id select new UserPublicInfoViewModel
        {
            PublicId = u.PublicId,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.Email,
            PubKeyPem = u.PubKeyPem
        };
        if(_user.FirstOrDefault() is null) return NotFound("Invalid user Id");
        return _user.FirstOrDefault();
    }

    [HttpGet("gettoken")]
    [Authorize("read:message")]
//[Authorize]
    public ActionResult<string> GetToken()
    {    
        return  Ok(new { Message = READ_SCOPE });
    }
    
    [Route("/CreateToken")]
    [HttpGet]
    public ActionResult <string> Createtoken()
    {// Det här ska skickas tillbaka till den inloggade användaren
        var client = new RestClient("https://dev-7ekffe016ic0nj4q.us.auth0.com/oauth/token");
        var request = new RestRequest("", Method.Post);
        request.AddHeader("content-type", "application/json");
        request.AddParameter("application/json", "{\"client_id\":\"aCwOKD4Lqjn1NiqHgJ9p2qSLUxVuU5Zx\",\"client_secret\":\"WHrzXjMvyGGVSKcfIUwXqZowlHPlmOD1vR2FGlb3Jt2mZx4i0qqLFBsY7f0w7xFV\",\"audience\":\"https://qsignv2/\",\"grant_type\":\"client_credentials\"}", ParameterType.RequestBody);
        var response = client.Execute(request);
        return Ok(response.Content);
    }
    
    [Route("/GetTokenRepsonse")]
    [HttpGet]
    public ActionResult<string> GetTokenResponse()
    {
        var client = new RestClient("http://localhost:5089/User/gettoken");
        var token = Createtoken();
        var request = new RestRequest( "",Method.Get);
        request.AddHeader("authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im41aGVYY29ZbGdjNTJWUXNYOG9tbiJ9.eyJpc3MiOiJodHRwczovL2Rldi03ZWtmZmUwMTZpYzBuajRxLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhQ3dPS0Q0THFqbjFOaXFIZ0o5cDJxU0xVeFZ1VTVaeEBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9xc2lnbnYyLyIsImlhdCI6MTY2OTEyNDM0NiwiZXhwIjoxNjY5MjEwNzQ2LCJhenAiOiJhQ3dPS0Q0THFqbjFOaXFIZ0o5cDJxU0xVeFZ1VTVaeCIsInNjb3BlIjoicmVhZDptZXNzYWdlIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.Y80n5cfGjIWQOiIqnmF9Nk2Yj3O_n7OAPbLzi9ssD2ml_WYRw8rXTBLtXg_dLIegxc9H55lHiYdibyY8jkGt3teTVPKOrCnTyyeJaW0CxdGCrsaiZnqqH0wQOt0nJsyRs3HteZPATvLrpjZZq_rZBUXaGe1h8NyGOVL1kRG8WFe4UulvHBjtta5xUvhJigfuF6fYNCMAruiU4TWPAfXB0znlsacXTMs57iiqh06EkaXJejLaKeEyxNKQgQlLHJAtolxlaH9E7c_SWFnUBbvmHi2ZMVBbbuB69STv9GquZkyVRA9kPL0sNMkdnViDYkrUV28wBqHejE1QqTEfvUepTQ");
        var response = client.Execute(request);
        
        return Ok(response);
    }

    // [Route("/AuthLogin")]
    // [HttpPost]
    // [authårize red:docum]
    // public ActionResult AuthLogin(ClientAuthLoginModel loginUser)
    // {
    //      verify that token is the owner of ID. [authårize]
    //      Search database for ID
    //      if ID exist in database return user data
    //      if ID don't exist create account in database with info and create keys
    // }
    [Route("/AuthLogin")]
    [HttpPost]
    public ActionResult<User> AuthLogin(ClientAuthLoginModel loginModel)
    {
        var _user = _context.Users.Where(p => p.Id == loginModel.Id).Select(p => p).FirstOrDefault();
        if(_user is not null) return _user;

        RSACryptoServiceProvider RSAalg = new RSACryptoServiceProvider();
        string PubKeyPem = RSAalg.ExportRSAPublicKeyPem();
        string PrivKeyPem = RSAalg.ExportRSAPrivateKeyPem();

        var userToAdd = new User
        {
            Id = loginModel.Id,
            PublicId = Guid.NewGuid(),
            Email = loginModel.Email,
            FirstName = loginModel.FirstName,
            LastName = loginModel.LastName,
            PubKeyPem = PubKeyPem,
            PrivKeyPem = PrivKeyPem
        };

        _context.Users.Add(userToAdd);
        
        var _pendingInvites = _context.PendingCommunications.Where(p => p.ToEmail == userToAdd.Email).Select(p => p);
        if(_pendingInvites is not null)
        {
            foreach(var invite in _pendingInvites)
            {
                var com = new CommunicationInfo
                {
                    Id = Guid.NewGuid(),
                    FromPublicId = invite.FromPublicId,
                    ToPublicId = userToAdd.PublicId,
                    DocumentId = invite.DocumentId,
                    IsSigned = false,
                    SignatureId = Guid.Empty
                };
                _context.CommunicationInfos.Add(com);
                _context.PendingCommunications.Remove(invite);
            }
        }
        
        _context.SaveChanges();

        return userToAdd;
    }
}

public class ClientAuthLoginModel
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    //  google ID
    //  Some auth token
    //  name and other info
}

public class ClientLoginModel
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class ClientCreateAccountModel 
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}

public class UserPublicInfoViewModel
{
    public Guid PublicId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PubKeyPem { get; set; }
}