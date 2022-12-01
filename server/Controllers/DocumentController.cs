using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Context;
using System.Security.Cryptography;

using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;

namespace server.Controllers;

[ApiController]
[Route("[controller]")]
public class DocumentController : ControllerBase
{
     public DataContext _context;
    private BlobContainerClient BlobContainerClient;
    public DocumentController(DataContext context)
    {
        _context = context;
        BlobContainerClient = new BlobContainerClient("");
    }

    [HttpPost]
    [Route("/UploadDocument")]
    public ActionResult UploadDocument([FromForm] FileModel FormFile)
    {
        var _user = from u in _context.Users where u.Id == FormFile.IssuerId select u;
        if(_user.FirstOrDefault() is null) return BadRequest("Wrong user Id");
        
        var stream = FormFile.FormFile.OpenReadStream();
        var Hash = BitConverter.ToString(SHA256.Create().ComputeHash(stream)).Replace("-", "").ToLowerInvariant();
        
        
        var newDocument = new DocumentInfo
        {
            Id = Guid.NewGuid(),
            Filename = FormFile.FileName,
            Hash = Hash,
            IssuerPublicId = _user.FirstOrDefault().PublicId
        };

        stream.Position=0;
        var blobClient = BlobContainerClient.GetBlobClient(newDocument.Id.ToString());
        blobClient.Upload(stream, true);

        _context.DocumentInfos.Add(newDocument);
        _context.SaveChanges();
        return Ok(newDocument);
    }

    [HttpPost]
    [Route("/GetUserFiles")]
    public IActionResult GetUserFiles([FromBody] ClientSendIdModel Id)
    {
        var _user = _context.Users.Where(p => p.Id == Id.Id).Select(p => p).FirstOrDefault();
        if(_user is null) return BadRequest("Invalid user Id");

        var _documents = _context.DocumentInfos
                        .Where(p => p.IssuerPublicId == _user.PublicId)
                        .Select(p => new FileInfoDTO
                        {
                            Id = p.Id,
                            Filename = p.Filename
                        })
                        .ToList();
        return Ok(_documents);
    }

    [HttpGet]
    [Route("/GetDocument/{id}")]
    public IActionResult GetDocument(Guid id)
    {
        var documentInfo = from d in _context.DocumentInfos where d.Id == id select d;
        if(documentInfo.FirstOrDefault() is null) return NotFound();

        var blob = BlobContainerClient.GetBlockBlobClient(documentInfo.FirstOrDefault().Id.ToString());
        Stream blobStream = blob.OpenRead();

        return File(blobStream, blob.GetProperties().Value.ContentType, documentInfo.FirstOrDefault().Filename);
    }

    [HttpGet]
    [Route("/GetDocumentInfo/{id}")]
    public ActionResult<DocumentInfo> GetDocumentInfo(Guid id)
    {
        var _doc = _context.DocumentInfos.Where(p => p.Id == id).Select(p => p).FirstOrDefault();
        if(_doc is null) return NotFound("Invalid Document Id");
        return _doc;
    }
}

public class ClientSendIdModel
{
    public string Id { get; set; }
}

public class FileInfoDTO
{
    public Guid Id { get; set; }
    public string Filename { get; set; }
}

public class FileModel
{
    public string IssuerId { get; set; }
    public string FileName { get; set; }
    public IFormFile FormFile { get; set; }
}