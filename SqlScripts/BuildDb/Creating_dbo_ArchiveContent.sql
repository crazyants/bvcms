CREATE PROC [dbo].[ArchiveContent](@id INT)
AS
BEGIN
	DECLARE @dt DATETIME = GETDATE()
	DECLARE @lastname VARCHAR(100) = ISNULL((SELECT TOP 1 Name FROM dbo.Content WHERE ArchivedFromId = @id ORDER BY Archived DESC), '--.v.0')
	DECLARE @nextversion INT = (SELECT TOP 1 ISNULL(TRY_CONVERT(INT, REVERSE(value)),0) + 1 FROM dbo.Split(REVERSE(@lastname), 'v.'))

	-- Create new archive record
	INSERT dbo.Content 
		(Title,Body,DateCreated,TextOnly,TypeID,
		ThumbID,RoleID,OwnerID,CreatedBy,UseTimes,Snippet,
		Name, Archived, ArchivedFromId)
	SELECT 
		Title,Body,DateCreated,TextOnly,TypeID,
		ThumbID,RoleID,OwnerID,CreatedBy,UseTimes,Snippet,
		Name + '.v' + CONVERT(VARCHAR, @nextversion), @dt, @id
	FROM dbo.CONTENT
	WHERE Id = @id


	-- Delete all archived content except the last three
	DELETE dbo.Content
	WHERE ArchivedFromId = @id
	AND Id NOT IN (
		SELECT TOP 3 Id FROM dbo.Content
		WHERE ArchivedFromId = @id
		ORDER BY Archived DESC
	)
END
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
