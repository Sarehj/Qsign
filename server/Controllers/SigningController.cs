using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Context;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;

namespace server.Controllers;

[ApiController]
[Route("[controller]")]
public class SigningController : ControllerBase
{
    public DataContext _context;

    public SigningController(DataContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Route("/Sign")]
    public ActionResult Sign(ClientSignModel signer)
    {
        var _user = _context.Users.Where(p => p.Id == signer.IssuerId).Select(p => p).FirstOrDefault();
        if (_user is null) return BadRequest("Invalid UserId");
        var _document = _context.DocumentInfos.Where(p => p.Id == signer.DocumentId).Select(p => p).FirstOrDefault();
        if (_document is null) return BadRequest("Invalid Document Id");

        var _sigAlreadyExist = _context.SignatureInfos
                                .Where(p => p.IssuerPublicId == _user.PublicId)
                                .Where(p => p.DocumentId == signer.DocumentId)
                                .Select(p => p).FirstOrDefault();
        if (_sigAlreadyExist is not null) return BadRequest("Document Already Signed");

        string hash = _document.Hash;
        byte[] binHash = StringToByteArray(hash);
        var PrivKeyPem = _user.PrivKeyPem;

        RSACryptoServiceProvider RSAalg = new RSACryptoServiceProvider();
        RSAalg.ImportFromPem(PrivKeyPem);

        byte[] binSig = RSAalg.SignData(binHash, SHA256.Create());
        string b64Sig = Convert.ToBase64String(binSig);

        var signatureModel = new SignatureInfo
        {
            Id = Guid.NewGuid(),
            IssuerPublicId = _user.PublicId,
            DocumentId = _document.Id,
            DocumentHash = hash,
            Signature = b64Sig,
            IssuerPubKeyPem = _user.PubKeyPem,
            IssuedAt = DateTime.Now
        };

        _context.SignatureInfos.Add(signatureModel);
        _context.SaveChanges();

        var _com = _context.CommunicationInfos
                    .Where(p => p.ToPublicId == _user.PublicId)
                    .Where(p => p.DocumentId == _document.Id)
                    .Select(p => p).FirstOrDefault();
        if (_com is not null)
        {
            _com.IsSigned = true;
            _com.SignatureId = signatureModel.Id;
            _context.SaveChanges();
        }
        return Ok();
    }

    [HttpGet]
    [Route("/GetSignature/{id}")]
    public ActionResult<SignatureInfo> GetSignature(Guid id)
    {
        var _sig = _context.SignatureInfos.Where(p => p.Id == id).Select(p => p).FirstOrDefault();
        if (_sig is null) return NotFound("Invalid Signature Id");
        return _sig;
    }

    [HttpGet]
    [Route("/GetDocumentSignatures/{id}")]
    public ActionResult<List<SignatureAndUserViewModel>> GetDocumentSignature(Guid id)
    {
        var sigModel = from s in _context.SignatureInfos
                       where s.DocumentId == id
                       join u in _context.Users on s.IssuerPublicId equals u.PublicId
                       select new SignatureAndUserViewModel
                       {
                           IssuerPublicId = s.IssuerPublicId,
                           DocumentId = s.DocumentId,
                           DocumentHash = s.DocumentHash,
                           Signature = s.Signature,
                           IssuerPubKeyPem = s.IssuerPubKeyPem,
                           IssuedAt = s.IssuedAt,
                           FirstName = u.FirstName,
                           LastName = u.LastName,
                           Email = u.Email
                       };

        if (sigModel is null) return NotFound("Document has no signatures");
        return sigModel.ToList();
    }

    public static byte[] StringToByteArray(string hex)
    {
        return Enumerable.Range(0, hex.Length)
                         .Where(x => x % 2 == 0)
                         .Select(x => Convert.ToByte(hex.Substring(x, 2), 16))
                         .ToArray();
    }
}

public class SignatureAndUserViewModel
{
    public Guid IssuerPublicId { get; set; }
    public Guid DocumentId { get; set; }
    public string DocumentHash { get; set; }
    public string Signature { get; set; }
    public string IssuerPubKeyPem { get; set; }
    public DateTime IssuedAt { get; set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
}

public class ClientSignModel
{
    public string IssuerId { get; set; }
    public Guid DocumentId { get; set; }
}