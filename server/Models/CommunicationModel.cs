namespace server.Models;

public class CommunicationInfo
{
    public Guid Id { get; set; }
    public Guid FromPublicId { get; set; }
    public Guid ToPublicId { get; set; }
    public Guid DocumentId { get; set; }
    public bool IsSigned { get; set; }
    public Guid SignatureId { get; set; }
}