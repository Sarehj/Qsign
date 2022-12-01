using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Context;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;

namespace server.Controllers;

[ApiController]
[Route("[controller]")]
public class CommunicationController : ControllerBase
{
    public DataContext _context;

    public CommunicationController(DataContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Route("/SendDocumentInvite")]
    public ActionResult SendDocumentInvite(ClientSendDocumentInvite invite)
    {
        var _fromUser = _context.Users.Where(p => p.Id == invite.Id).Select(p => p).FirstOrDefault();
        if(_fromUser is null) return BadRequest("Invalid sender user id");
        var _toUser = _context.Users.Where(p => p.PublicId == invite.ToPublicId).Select(p => p).FirstOrDefault();
        if(_toUser is null) return BadRequest("Invalid reciever user id");
        var _doc = _context.DocumentInfos.Where(p => p.Id == invite.DocumentId).Select(p => p).FirstOrDefault();
        if(_doc is null) return BadRequest("Invalid document id");
        if(_doc.IssuerPublicId != _fromUser.PublicId) return BadRequest("Not your document");

        var com = new CommunicationInfo
        {
            Id = Guid.NewGuid(),
            FromPublicId = _fromUser.PublicId,
            ToPublicId = _toUser.PublicId,
            DocumentId = _doc.Id,
            IsSigned = false,
            SignatureId = Guid.Empty
        };
        _context.Add(com);
        _context.SaveChanges();
        return Ok();
    }

    [HttpPost]
    [Route("/GetUserInvites")]
    public ActionResult<List<GetInvitesViewModel>> GetUserInvites(ClientGetUserInvites clientId)
    {
        var _user = _context.Users.Where(p => p.Id == clientId.Id).Select(p => p).FirstOrDefault();
        if(_user is null) return BadRequest("Invalid User Id");
        var _invites = _context.CommunicationInfos.Where(p => p.ToPublicId == _user.PublicId).Select(p => p).FirstOrDefault();
        if(_invites is null) return NotFound("No document invites");

        var _viewModel = from c in _context.CommunicationInfos where c.ToPublicId == _user.PublicId
                            join u in _context.Users on c.FromPublicId equals u.PublicId
                            join d in _context.DocumentInfos on c.DocumentId equals d.Id
                            select new GetInvitesViewModel
                            {
                                DocumentId = c.DocumentId,
                                IsSigned = c.IsSigned,
                                SignatureId = c.SignatureId,
                                FirstName = u.FirstName,
                                LastName = u.LastName,
                                Email = u.Email,
                                Filename = d.Filename
                            };
        return _viewModel.ToList();
    }

    [HttpPost]
    [Route("/SendDocumentInvite2")]
    public ActionResult SendDocumentInvite2(ClientSendDocumentInvite2 invite)
    {
        var _user = _context.Users.Where(p => p.Id == invite.Id).Select(p => p).FirstOrDefault();
        if(_user is null) return BadRequest("Invalid user id");
        var _doc = _context.DocumentInfos.Where(p => p.Id == invite.DocumentId).Select(p => p).FirstOrDefault();
        if(_doc is null) return BadRequest("Invalid document id");

        foreach(var email in invite.Emails)
        {
            var _toUser = _context.Users.Where(p => p.Email == email).Select(p => p).FirstOrDefault();
            if(_toUser is null) // SEND SMTP EMAIL TO UNREGISTERED USERS
            {
                var pendingCom = new PendingCommunication 
                {
                    Id = Guid.NewGuid(),
                    FromPublicId = _user.PublicId,
                    ToEmail = email,
                    DocumentId = _doc.Id
                };
                _context.PendingCommunications.Add(pendingCom);
                continue;
            }
            var com = new CommunicationInfo
            {
                Id = Guid.NewGuid(),
                FromPublicId = _user.PublicId,
                ToPublicId = _toUser.PublicId,
                DocumentId = _doc.Id,
                IsSigned = false,
                SignatureId = Guid.Empty
            };
            _context.Add(com);
        }
        _context.SaveChanges();
        return Ok();
    }
}

public class ClientSendDocumentInvite
{
    public string Id { get; set; }
    public Guid ToPublicId { get; set; }
    public Guid DocumentId { get; set; }
}

public class ClientSendDocumentInvite2
{
    public string Id { get; set; }
    public List<string> Emails { get; set; }
    public Guid DocumentId { get; set; }
}

public class ClientGetUserInvites
{
    public string Id { get; set; }
}

public class GetInvitesViewModel
{
    // public Guid FromPublicId { get; set; }
    // public Guid ToPublicId { get; set; }
    public Guid DocumentId { get; set; }
    public bool IsSigned { get; set; }
    public Guid SignatureId { get; set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }

    public string Filename {get; set; }
}