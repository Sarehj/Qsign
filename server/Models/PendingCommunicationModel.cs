namespace server.Models;

public class PendingCommunication
{
    public Guid Id { get; set; }
    public Guid FromPublicId { get; set; }
    public string ToEmail { get; set; }
    public Guid DocumentId { get; set; }
}