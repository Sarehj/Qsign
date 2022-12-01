
namespace server.Models;

public class DocumentInfo
{
    public Guid Id { get; set; }
    public string Filename {get; set; }
    public string Hash { get; set; }
    public Guid IssuerPublicId { get; set; }
}