ALTER TABLE [dbo].[LongRunningOp] ADD CONSTRAINT [PK_LongRunningOp] PRIMARY KEY CLUSTERED  ([id], [operation])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
