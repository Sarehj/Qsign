
namespace server.Models;

public class User
{
    public string Id { get; set; }
    public Guid PublicId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Email { get; set; }
    public string? Password { get; set; }
    public string PubKeyPem { get; set; }
    public string PrivKeyPem { get; set; }
}