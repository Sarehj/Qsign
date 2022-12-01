using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Context;

public class DataContext : DbContext
{
    private string connectionString = "";

    public DbSet<User> Users { get; set; }
    public DbSet<DocumentInfo> DocumentInfos { get; set; }
    public DbSet<SignatureInfo> SignatureInfos { get; set; }
    public DbSet<CommunicationInfo> CommunicationInfos { get; set; } 
    public DbSet<PendingCommunication> PendingCommunications { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionBuilder)
    {
        optionBuilder.UseSqlServer(connectionString);
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<User>()
			.HasIndex(p => p.Email)
			.IsUnique(true);
    }
}