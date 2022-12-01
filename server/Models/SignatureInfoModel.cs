namespace server.Models;

public class SignatureInfo
{
    public Guid Id { get; set; }
    public Guid IssuerPublicId { get; set; }
    public Guid DocumentId { get; set; }
    public string DocumentHash { get; set; }
    public string Signature { get; set; }
    public string IssuerPubKeyPem { get; set; }
    public DateTime IssuedAt { get; set; }
}