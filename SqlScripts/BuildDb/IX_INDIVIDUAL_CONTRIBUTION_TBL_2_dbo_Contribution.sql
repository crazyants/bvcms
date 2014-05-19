CREATE NONCLUSTERED INDEX [IX_INDIVIDUAL_CONTRIBUTION_TBL_2] ON [dbo].[Contribution] ([PledgeFlag])
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO