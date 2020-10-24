using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class RefIdInMessages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_AspNetUsers_AuthorId1",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Message_AuthorId1",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "AuthorId1",
                table: "Message");

            migrationBuilder.AlterColumn<string>(
                name: "AuthorId",
                table: "Message",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.CreateIndex(
                name: "IX_Message_AuthorId",
                table: "Message",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_AspNetUsers_AuthorId",
                table: "Message",
                column: "AuthorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_AspNetUsers_AuthorId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Message_AuthorId",
                table: "Message");

            migrationBuilder.AlterColumn<Guid>(
                name: "AuthorId",
                table: "Message",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AuthorId1",
                table: "Message",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Message_AuthorId1",
                table: "Message",
                column: "AuthorId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_AspNetUsers_AuthorId1",
                table: "Message",
                column: "AuthorId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
